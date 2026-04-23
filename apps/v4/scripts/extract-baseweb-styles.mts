import { createHash } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { createRequire } from "module"

import { exportCssVarsAndComponentCss } from "./lib/exporters/css-vars-exporter.mts"
import { exportStyleObjects } from "./lib/exporters/style-objects-exporter.mts"
import { exportTokensJson } from "./lib/exporters/tokens-json-exporter.mts"
import { runComputedStyleVerification } from "./lib/computed-style-verifier.mts"
import {
  buildBasewebComponentCatalog,
  type BasewebComponentCatalogItem,
} from "./lib/baseweb-component-catalog.mts"
import {
  normalizeCapturedStyles,
  type CapturedStyleSheet,
} from "./lib/styletron-css-normalizer.mts"

const OUTPUT_ROOT = path.join(process.cwd(), "public/baseweb-styles")
const REPORTS_ROOT = path.join(OUTPUT_ROOT, "reports")
const RAW_ROOT = path.join(OUTPUT_ROOT, "raw")

const requireFromHere = createRequire(import.meta.url)

const RECIPE_OVERRIDES: Record<
  string,
  { exportName?: string; props?: Record<string, unknown> }
> = {
  button: { exportName: "Button", props: { children: "Base Web Button" } },
  card: { exportName: "Card", props: { title: "Card title", children: "Card body" } },
  checkbox: { exportName: "Checkbox", props: { children: "Checkbox label" } },
  "checkbox-v2": {
    exportName: "Checkbox",
    props: { children: "Checkbox label" },
  },
  input: { exportName: "Input", props: { value: "Hello", onChange: () => {} } },
  textarea: { exportName: "Textarea", props: { value: "Hello", onChange: () => {} } },
  select: { exportName: "Select", props: { options: [{ id: "1", label: "One" }] } },
  tag: { exportName: "Tag", props: { children: "Tag" } },
  tooltip: { exportName: "Tooltip", props: { content: "Tooltip", children: "Hover me" } },
}

async function main() {
  const startedAt = Date.now()
  await fs.mkdir(REPORTS_ROOT, { recursive: true })
  await fs.mkdir(RAW_ROOT, { recursive: true })

  const catalog = await buildBasewebComponentCatalog()
  await fs.writeFile(
    path.join(RAW_ROOT, "catalog.json"),
    JSON.stringify(catalog, null, 2),
    "utf8"
  )

  const captureResult = await captureComponentStyles(catalog)
  const normalized = normalizeCapturedStyles(captureResult.captured)

  await writeRawOutputs(captureResult.captured, normalized)
  await exportCssVarsAndComponentCss({
    outputRoot: OUTPUT_ROOT,
    tokenDictionary: captureResult.tokens,
    components: normalized,
  })
  await exportTokensJson({
    outputRoot: OUTPUT_ROOT,
    tokenDictionary: captureResult.tokens,
  })
  await exportStyleObjects({
    outputRoot: OUTPUT_ROOT,
    components: normalized,
  })

  const coverage = buildCoverageReport({
    catalog,
    captured: captureResult.captured,
    errors: captureResult.errors,
  })
  await fs.writeFile(
    path.join(REPORTS_ROOT, "coverage.json"),
    JSON.stringify(coverage, null, 2),
    "utf8"
  )

  const determinism = buildDeterminismReport(normalized)
  await fs.writeFile(
    path.join(REPORTS_ROOT, "determinism.json"),
    JSON.stringify(determinism, null, 2),
    "utf8"
  )

  const computedStyleVerification = await runComputedStyleVerification({
    outputRoot: OUTPUT_ROOT,
    reportsRoot: REPORTS_ROOT,
    baseUrl: process.env.BASEWEB_VERIFY_BASE_URL ?? "http://localhost:4000",
    shadcnStyle: process.env.BASEWEB_VERIFY_SHADCN_STYLE ?? "new-york-v4",
    shadcnUiRoot:
      process.env.BASEWEB_VERIFY_SHADCN_UI_ROOT ??
      path.join(process.cwd(), "registry/new-york-v4/ui"),
  })
  await fs.writeFile(
    path.join(REPORTS_ROOT, "computed-style-verification.json"),
    JSON.stringify(computedStyleVerification, null, 2),
    "utf8"
  )

  const manifest = {
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    sourceRepository: "https://github.com/uber/baseweb",
    sourceBranch: "main",
    outputRoot: "public/baseweb-styles",
    files: {
      tokensCss: "public/baseweb-styles/tokens.css",
      tokensJson: "public/baseweb-styles/tokens.json",
      componentCssDir: "public/baseweb-styles/components",
      styleObjectsDir: "public/baseweb-styles/style-objects",
      coverageReport: "public/baseweb-styles/reports/coverage.json",
      determinismReport: "public/baseweb-styles/reports/determinism.json",
      computedStyleVerification:
        "public/baseweb-styles/reports/computed-style-verification.json",
    },
    totals: {
      componentsDiscovered: catalog.length,
      captures: captureResult.captured.length,
      errors: captureResult.errors.length,
      tokenCount: Object.keys(captureResult.tokens).length,
    },
  }

  await fs.writeFile(
    path.join(OUTPUT_ROOT, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  )

  console.log(
    `✅ Base Web style extraction complete (${manifest.totals.captures} captures, ${manifest.totals.errors} errors).`
  )
}

async function captureComponentStyles(catalog: BasewebComponentCatalogItem[]) {
  const React = await importDependency("react")
  const ReactDOMServer = await importDependency("react-dom/server")
  const StyletronReact = await importDependency("styletron-react")
  const StyletronEngine = await importDependency("styletron-engine-monolithic")
  const BaseuiBaseProvider = await importDependency("baseui")
  const ThemesModule = await importDependency("baseui/themes")

  const BaseProvider =
    BaseuiBaseProvider.BaseProvider ??
    BaseuiBaseProvider.default?.BaseProvider ??
    BaseuiBaseProvider.default
  if (typeof BaseProvider !== "function") {
    throw new Error("Could not resolve BaseProvider from baseui package")
  }

  const lightTheme = ThemesModule.LightTheme
  const darkTheme = ThemesModule.DarkTheme
  if (!lightTheme || !darkTheme) {
    throw new Error("Could not resolve LightTheme/DarkTheme from baseui/themes")
  }
  const tokens = flattenThemeTokens({
    light: lightTheme,
    dark: darkTheme,
  })

  const captured: CapturedStyleSheet[] = []
  const errors: Array<{ component: string; variant: string; error: string }> = []

  for (const item of catalog) {
    for (const variant of item.variants) {
      const engine = new StyletronEngine.Server()
      const providerTree = await buildRenderTree({
        componentName: item.name,
        React,
        theme: variant.theme === "dark" ? darkTheme : lightTheme,
      })

      if (!providerTree.ok) {
        errors.push({
          component: item.name,
          variant: variant.id,
          error: providerTree.error,
        })
        continue
      }

      const node = React.createElement(
        StyletronReact.Provider,
        { value: engine },
        React.createElement(BaseProvider, { theme: variant.theme === "dark" ? darkTheme : lightTheme }, providerTree.element)
      )

      try {
        ReactDOMServer.renderToString(node)
        const css = engine.getCss?.() ?? ""

        captured.push({
          component: item.name,
          variantId: variant.id,
          theme: variant.theme,
          captureSource: "ssr",
          css,
        })
      } catch (error) {
        errors.push({
          component: item.name,
          variant: variant.id,
          error: toErrorMessage(error),
        })
      }
    }
  }

  return { captured, errors, tokens }
}

async function buildRenderTree({
  componentName,
  React,
  theme,
}: {
  componentName: string
  React: typeof import("react")
  theme: unknown
}): Promise<
  { ok: true; element: unknown } | { ok: false; error: string }
> {
  let componentModule: Record<string, unknown>
  try {
    componentModule = await importDependency(`baseui/${componentName}`)
  } catch (error) {
    return {
      ok: false,
      error: `Module import failed for baseui/${componentName}: ${toErrorMessage(error)}`,
    }
  }

  const override = RECIPE_OVERRIDES[componentName]
  const candidateNames = [
    override?.exportName,
    toPascalCase(componentName),
    "default",
  ].filter(Boolean) as string[]
  const componentExport = pickComponentExport(componentModule, candidateNames)

  if (!componentExport) {
    return {
      ok: false,
      error: `No React component export found in baseui/${componentName}`,
    }
  }

  const props = {
    ...(override?.props ?? {}),
    $theme: theme,
  } as Record<string, unknown>

  return {
    ok: true,
    element: React.createElement(componentExport, props),
  }
}

function pickComponentExport(
  moduleRecord: Record<string, unknown>,
  preferredNames: string[]
) {
  const expandedRecord: Record<string, unknown> = { ...moduleRecord }
  if (
    typeof moduleRecord.default === "object" &&
    moduleRecord.default !== null &&
    !Array.isArray(moduleRecord.default)
  ) {
    Object.assign(expandedRecord, moduleRecord.default as Record<string, unknown>)
  }

  for (const name of preferredNames) {
    const candidate = expandedRecord[name]
    if (typeof candidate === "function") {
      return candidate
    }
  }

  for (const value of Object.values(expandedRecord)) {
    if (typeof value === "function") {
      return value
    }
  }

  return null
}

function flattenThemeTokens(themeMap: Record<string, unknown>) {
  const result: Record<string, string> = {}

  function visit(value: unknown, pathParts: string[]) {
    if (
      value === null ||
      value === undefined ||
      typeof value === "boolean" ||
      typeof value === "number"
    ) {
      return
    }

    if (typeof value === "string") {
      if (pathParts.length > 0) {
        result[pathParts.join("-")] = value
      }
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, [...pathParts, String(index)]))
      return
    }

    if (typeof value === "object") {
      for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
        visit(nested, [...pathParts, key])
      }
    }
  }

  visit(themeMap, [])
  return result
}

async function writeRawOutputs(captured: CapturedStyleSheet[], normalized: unknown) {
  await fs.writeFile(
    path.join(RAW_ROOT, "captured-styles.json"),
    JSON.stringify(captured, null, 2),
    "utf8"
  )
  await fs.writeFile(
    path.join(RAW_ROOT, "normalized-styles.json"),
    JSON.stringify(normalized, null, 2),
    "utf8"
  )
}

function buildCoverageReport({
  catalog,
  captured,
  errors,
}: {
  catalog: BasewebComponentCatalogItem[]
  captured: CapturedStyleSheet[]
  errors: Array<{ component: string; variant: string; error: string }>
}) {
  const componentsWithCapture = new Set(captured.map((entry) => entry.component))
  const attemptedVariants = catalog.reduce(
    (sum, item) => sum + item.variants.length,
    0
  )

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      componentsDiscovered: catalog.length,
      componentsCaptured: componentsWithCapture.size,
      variantsAttempted: attemptedVariants,
      variantsCaptured: captured.length,
      variantsFailed: errors.length,
    },
    missingComponents: catalog
      .filter((item) => !componentsWithCapture.has(item.name))
      .map((item) => item.name),
    failures: errors,
  }
}

function buildDeterminismReport(
  normalized: Array<{
    component: string
    variantId: string
    normalizedCss: string
  }>
) {
  const signatures = normalized.map((entry) => {
    const digest = createHash("sha256").update(entry.normalizedCss).digest("hex")
    return {
      component: entry.component,
      variantId: entry.variantId,
      digest,
    }
  })

  return {
    generatedAt: new Date().toISOString(),
    entries: signatures,
  }
}

function toPascalCase(value: string) {
  return value
    .split("-")
    .map((segment) => segment.slice(0, 1).toUpperCase() + segment.slice(1))
    .join("")
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

async function importDependency(name: string) {
  const resolved = requireFromHere.resolve(name, { paths: [process.cwd()] })
  return import(resolved)
}

main().catch((error) => {
  console.error("❌ Base Web extraction failed")
  console.error(error)
  process.exit(1)
})
