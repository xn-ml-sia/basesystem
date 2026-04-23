import { promises as fs } from "fs"
import path from "path"

import type { NormalizedComponentStyles } from "../styletron-css-normalizer.mts"

type CssVarExporterInput = {
  outputRoot: string
  tokenDictionary: Record<string, string>
  components: NormalizedComponentStyles[]
}

export async function exportCssVarsAndComponentCss({
  outputRoot,
  tokenDictionary,
  components,
}: CssVarExporterInput) {
  const tokensCssPath = path.join(outputRoot, "tokens.css")
  const componentsDir = path.join(outputRoot, "components")
  await fs.mkdir(componentsDir, { recursive: true })

  const sortedTokenEntries = Object.entries(tokenDictionary).sort(([a], [b]) =>
    a.localeCompare(b)
  )
  const tokenLines = sortedTokenEntries.map(([name, value]) => `  --${name}: ${value};`)
  const tokensCss = `:root {\n${tokenLines.join("\n")}\n}\n`
  await fs.writeFile(tokensCssPath, tokensCss, "utf8")

  const grouped = new Map<string, NormalizedComponentStyles[]>()
  for (const item of components) {
    if (!grouped.has(item.component)) {
      grouped.set(item.component, [])
    }
    grouped.get(item.component)!.push(item)
  }

  for (const [component, entries] of grouped) {
    const componentCss = entries
      .sort((a, b) => a.variantId.localeCompare(b.variantId))
      .map(
        (entry) =>
          `/* ${entry.variantId} (${entry.theme}, ${entry.captureSource}) */\n${entry.normalizedCss}`
      )
      .join("\n\n")
    await fs.writeFile(
      path.join(componentsDir, `${component}.css`),
      `${componentCss}\n`,
      "utf8"
    )
  }
}
