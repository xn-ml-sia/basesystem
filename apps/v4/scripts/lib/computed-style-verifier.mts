import { promises as fs } from "fs"
import path from "path"

import puppeteer from "puppeteer"

type VerificationOptions = {
  outputRoot: string
  reportsRoot: string
  baseUrl: string
  shadcnStyle: string
  shadcnUiRoot: string
}

type VerificationResult = {
  generatedAt: string
  baseUrl: string
  status: "ok" | "skipped"
  reason?: string
  comparedComponents: number
  entries: Array<{
    baseweb: string
    shadcn: string
    matchedProperties: string[]
    mismatchedProperties: Array<{
      property: string
      basewebValue: string
      shadcnValue: string
    }>
    unavailableProperties: string[]
  }>
}

const COMPONENT_MAP: Record<string, string> = {
  accordion: "accordion",
  avatar: "avatar",
  badge: "badge",
  button: "button",
  card: "card",
  checkbox: "checkbox",
  dialog: "dialog",
  drawer: "drawer",
  input: "input",
  popover: "popover",
  select: "select",
  skeleton: "skeleton",
  slider: "slider",
  switch: "switch",
  tabs: "tabs",
  textarea: "textarea",
  tooltip: "tooltip",
}

const KEY_PROPERTIES = [
  "display",
  "position",
  "boxSizing",
  "width",
  "height",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopStyle",
  "borderTopColor",
  "borderRadius",
  "backgroundColor",
  "color",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "boxShadow",
  "opacity",
]

export async function runComputedStyleVerification({
  outputRoot,
  reportsRoot,
  baseUrl,
  shadcnStyle: _shadcnStyle,
  shadcnUiRoot,
}: VerificationOptions): Promise<VerificationResult> {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
    },
  })

  try {
    const entries: VerificationResult["entries"] = []
    for (const [basewebName, shadcnName] of Object.entries(COMPONENT_MAP)) {
      const componentCssPath = path.join(outputRoot, "components", `${basewebName}.css`)
      const componentCss = await safeRead(componentCssPath)
      if (!componentCss) {
        continue
      }

      const classNames = extractClassNames(componentCss)
      if (classNames.length === 0) {
        continue
      }

      const shadcnSourcePath = path.join(shadcnUiRoot, `${shadcnName}.tsx`)
      const shadcnSource = await safeRead(shadcnSourcePath)
      if (!shadcnSource) {
        continue
      }
      const shadcnClassList = extractShadcnUtilityClassList(shadcnSource)
      if (shadcnClassList.length === 0) {
        continue
      }

      const shadcnValues = await captureShadcnComputedStyle(browser, shadcnClassList)
      const basewebValues = await captureExtractedBasewebComputedStyle(
        browser,
        classNames,
        componentCss
      )

      if (!shadcnValues || !basewebValues) {
        continue
      }

      const matchedProperties: string[] = []
      const mismatchedProperties: VerificationResult["entries"][number]["mismatchedProperties"] =
        []
      const unavailableProperties: string[] = []

      for (const property of KEY_PROPERTIES) {
        const baseValue = basewebValues[property]
        const shadcnValue = shadcnValues[property]
        if (!baseValue || !shadcnValue) {
          unavailableProperties.push(property)
          continue
        }
        if (baseValue === shadcnValue) {
          matchedProperties.push(property)
        } else {
          mismatchedProperties.push({
            property,
            basewebValue: baseValue,
            shadcnValue: shadcnValue,
          })
        }
      }

      entries.push({
        baseweb: basewebName,
        shadcn: shadcnName,
        matchedProperties,
        mismatchedProperties,
        unavailableProperties,
      })
    }

    return {
      generatedAt: new Date().toISOString(),
      baseUrl,
      status: "ok",
      comparedComponents: entries.length,
      entries,
    }
  } finally {
    await browser.close()
    await fs.mkdir(reportsRoot, { recursive: true })
  }
}

async function captureShadcnComputedStyle(
  browser: puppeteer.Browser,
  classList: string[]
): Promise<Record<string, string> | null> {
  const page = await browser.newPage()
  try {
    await page.setContent(
      `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="probe" class="${classList.join(" ")}">probe</div>
</body>
</html>`,
      { waitUntil: "networkidle2" }
    )
    await page.waitForSelector("#probe", { timeout: 5000 })
    return await page.evaluate((properties) => {
      const probe = document.getElementById("probe")
      if (!probe) {
        return null
      }
      const style = getComputedStyle(probe)
      return Object.fromEntries(properties.map((property) => [property, style[property as keyof CSSStyleDeclaration] ?? ""]))
    }, KEY_PROPERTIES)
  } catch {
    return null
  } finally {
    await page.close()
  }
}

async function captureExtractedBasewebComputedStyle(
  browser: puppeteer.Browser,
  classNames: string[],
  css: string
): Promise<Record<string, string> | null> {
  const page = await browser.newPage()
  try {
    await page.setContent(
      `<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
</head>
<body>
  <div id="probe" class="${classNames.join(" ")}">probe</div>
</body>
</html>`,
      { waitUntil: "load" }
    )

    return await page.evaluate((properties) => {
      const probe = document.getElementById("probe")
      if (!probe) {
        return null
      }
      const style = getComputedStyle(probe)
      return Object.fromEntries(properties.map((property) => [property, style[property as keyof CSSStyleDeclaration] ?? ""]))
    }, KEY_PROPERTIES)
  } catch {
    return null
  } finally {
    await page.close()
  }
}

function extractClassNames(css: string) {
  const classMatches = css.match(/\.[_a-zA-Z]+[_a-zA-Z0-9-]*/g) ?? []
  const unique = Array.from(
    new Set(classMatches.map((value) => value.replace(/^\./, "")))
  )
  return unique.slice(0, 12)
}

function extractShadcnUtilityClassList(source: string) {
  const candidates: string[] = []

  const classNameDirect = source.match(/className="([^"]+)"/g) ?? []
  for (const entry of classNameDirect) {
    const match = entry.match(/className="([^"]+)"/)
    if (match?.[1]) {
      candidates.push(match[1])
    }
  }

  const cnCalls = source.match(/cn\(([\s\S]*?)\)/g) ?? []
  for (const call of cnCalls) {
    const stringLiterals = call.match(/"([^"]+)"/g) ?? []
    for (const literal of stringLiterals) {
      candidates.push(literal.replace(/^"|"$/g, ""))
    }
  }

  const cvaCalls = source.match(/cva\(([\s\S]*?)\)/g) ?? []
  for (const call of cvaCalls) {
    const stringLiterals = call.match(/"([^"]+)"/g) ?? []
    for (const literal of stringLiterals) {
      candidates.push(literal.replace(/^"|"$/g, ""))
    }
  }

  const utilities = Array.from(
    new Set(
      candidates
        .flatMap((chunk) => chunk.split(/\s+/))
        .map((token) => token.trim())
        .filter(Boolean)
        .filter((token) => /^[a-z0-9:_/\-[\].%]+$/i.test(token))
    )
  )

  return utilities.slice(0, 40)
}

async function safeRead(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8")
  } catch {
    return null
  }
}
