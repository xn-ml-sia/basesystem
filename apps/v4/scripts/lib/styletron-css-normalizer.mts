export type CapturedStyleSheet = {
  component: string
  variantId: string
  theme: "light" | "dark"
  css: string
  captureSource: "ssr" | "runtime"
}

export type NormalizedStyleRule = {
  selector: string
  declarations: string
}

export type NormalizedComponentStyles = {
  component: string
  variantId: string
  theme: "light" | "dark"
  captureSource: "ssr" | "runtime"
  rawCss: string
  normalizedCss: string
  rules: NormalizedStyleRule[]
}

export function normalizeCapturedStyles(input: CapturedStyleSheet[]) {
  return input.map((entry) => {
    const rules = normalizeCssToRules(entry.css)
    const normalizedCss = rules
      .map((rule) => `${rule.selector}{${rule.declarations}}`)
      .join("\n")

    return {
      component: entry.component,
      variantId: entry.variantId,
      theme: entry.theme,
      captureSource: entry.captureSource,
      rawCss: entry.css,
      normalizedCss,
      rules,
    } satisfies NormalizedComponentStyles
  })
}

function normalizeCssToRules(css: string) {
  const compact = css.replace(/\s+/g, " ").trim()
  const matches = compact.match(/[^{}]+{[^{}]*}/g) ?? []
  const rulesBySignature = new Map<string, NormalizedStyleRule>()

  for (const match of matches) {
    const parts = match.split("{")
    if (parts.length < 2) {
      continue
    }

    const selector = parts[0].trim()
    const declarationPart = parts.slice(1).join("{").replace(/}\s*$/, "")
    const declarations = declarationPart
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join(";")

    if (!selector || !declarations) {
      continue
    }

    const signature = `${selector}::${declarations}`
    if (!rulesBySignature.has(signature)) {
      rulesBySignature.set(signature, { selector, declarations })
    }
  }

  return Array.from(rulesBySignature.values()).sort((a, b) => {
    if (a.selector === b.selector) {
      return a.declarations.localeCompare(b.declarations)
    }
    return a.selector.localeCompare(b.selector)
  })
}
