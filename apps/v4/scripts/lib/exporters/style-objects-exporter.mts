import { promises as fs } from "fs"
import path from "path"

import type { NormalizedComponentStyles } from "../styletron-css-normalizer.mts"

type StyleObjectsExporterInput = {
  outputRoot: string
  components: NormalizedComponentStyles[]
}

export async function exportStyleObjects({
  outputRoot,
  components,
}: StyleObjectsExporterInput) {
  const styleObjectsDir = path.join(outputRoot, "style-objects")
  await fs.mkdir(styleObjectsDir, { recursive: true })

  const grouped = new Map<string, NormalizedComponentStyles[]>()
  for (const item of components) {
    if (!grouped.has(item.component)) {
      grouped.set(item.component, [])
    }
    grouped.get(item.component)!.push(item)
  }

  for (const [componentName, entries] of grouped) {
    const variants = entries
      .sort((a, b) => a.variantId.localeCompare(b.variantId))
      .map((entry) => {
        const selectorMap = Object.fromEntries(
          entry.rules.map((rule) => [rule.selector, rule.declarations])
        )
        return {
          variantId: entry.variantId,
          theme: entry.theme,
          captureSource: entry.captureSource,
          selectors: selectorMap,
        }
      })

    const fileContent = `export const ${toExportName(componentName)} = ${JSON.stringify(
      {
        component: componentName,
        variants,
      },
      null,
      2
    )} as const\n`

    await fs.writeFile(
      path.join(styleObjectsDir, `${componentName}.ts`),
      fileContent,
      "utf8"
    )
  }
}

function toExportName(componentName: string) {
  return `${componentName
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join("")}StyleMap`
}
