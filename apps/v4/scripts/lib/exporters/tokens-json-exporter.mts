import { promises as fs } from "fs"
import path from "path"

type TokensJsonExporterInput = {
  outputRoot: string
  tokenDictionary: Record<string, string>
}

export async function exportTokensJson({
  outputRoot,
  tokenDictionary,
}: TokensJsonExporterInput) {
  const groups: Record<string, Record<string, string>> = {
    color: {},
    typography: {},
    sizing: {},
    spacing: {},
    border: {},
    shadow: {},
    zIndex: {},
    motion: {},
    miscellaneous: {},
  }

  for (const [name, value] of Object.entries(tokenDictionary)) {
    const targetGroup = detectTokenGroup(name)
    groups[targetGroup][name] = value
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    total: Object.keys(tokenDictionary).length,
    groups,
  }

  await fs.writeFile(
    path.join(outputRoot, "tokens.json"),
    JSON.stringify(payload, null, 2),
    "utf8"
  )
}

function detectTokenGroup(name: string): keyof typeof GROUP_HINTS {
  for (const [group, hints] of Object.entries(GROUP_HINTS) as Array<
    [keyof typeof GROUP_HINTS, string[]]
  >) {
    if (hints.some((hint) => name.toLowerCase().includes(hint))) {
      return group
    }
  }

  return "miscellaneous"
}

const GROUP_HINTS = {
  color: ["color", "background", "content", "border", "accent"],
  typography: ["font", "typography", "lineheight", "letterspacing"],
  sizing: ["size", "dimension", "width", "height", "scale"],
  spacing: ["space", "padding", "margin", "gap"],
  border: ["radius", "stroke", "outline"],
  shadow: ["shadow", "depth"],
  zIndex: ["zindex", "layer"],
  motion: ["motion", "animation", "duration", "easing"],
  miscellaneous: [],
}
