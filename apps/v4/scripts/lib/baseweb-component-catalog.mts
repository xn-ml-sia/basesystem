type GitHubTreeNode = {
  path: string
  type: "tree" | "blob"
}

export type BasewebComponentVariant = {
  id: string
  label: string
  theme: "light" | "dark"
  state: "default" | "interactive"
}

export type BasewebComponentCatalogItem = {
  name: string
  sourcePath: string
  examplePaths: string[]
  isPortalComponent: boolean
  variants: BasewebComponentVariant[]
}

const BASEWEB_REPO_API_TREE_URL =
  "https://api.github.com/repos/uber/baseweb/git/trees/main?recursive=1"

const PORTAL_COMPONENTS = new Set([
  "dialog",
  "drawer",
  "menu",
  "modal",
  "notification",
  "popover",
  "select",
  "sheet",
  "snackbar",
  "toast",
  "tooltip",
])

export async function buildBasewebComponentCatalog() {
  const tree = await fetchGitHubTree()
  const sourceComponentDirs = listSourceComponentDirectories(tree)
  const examplesByComponent = collectExamplesByComponent(tree)

  const catalog: BasewebComponentCatalogItem[] = sourceComponentDirs.map((dir) => {
    const variants = createDefaultVariants(dir)
    const examplePaths = (examplesByComponent.get(dir) ?? []).sort((a, b) =>
      a.localeCompare(b)
    )

    return {
      name: dir,
      sourcePath: `src/${dir}`,
      examplePaths,
      isPortalComponent: PORTAL_COMPONENTS.has(dir),
      variants,
    }
  })

  return catalog.sort((a, b) => a.name.localeCompare(b.name))
}

async function fetchGitHubTree() {
  const response = await fetch(BASEWEB_REPO_API_TREE_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "base-system-baseweb-style-extractor",
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Base Web tree (${response.status} ${response.statusText})`
    )
  }

  const payload = (await response.json()) as { tree?: GitHubTreeNode[] }
  if (!Array.isArray(payload.tree)) {
    throw new Error("Unexpected GitHub tree payload shape")
  }

  return payload.tree
}

function listSourceComponentDirectories(tree: GitHubTreeNode[]) {
  const ignoredDirectories = new Set([
    "a11y",
    "helpers",
    "helper",
    "locale",
    "styles",
    "test",
    "themes",
    "tokens",
    "types",
    "utils",
  ])

  const componentNames = new Set<string>()
  for (const node of tree) {
    if (node.type !== "tree" || !node.path.startsWith("src/")) {
      continue
    }

    const segments = node.path.split("/")
    if (segments.length !== 2) {
      continue
    }

    const name = segments[1]
    if (ignoredDirectories.has(name)) {
      continue
    }

    componentNames.add(name)
  }

  return Array.from(componentNames)
}

function collectExamplesByComponent(tree: GitHubTreeNode[]) {
  const map = new Map<string, string[]>()

  for (const node of tree) {
    if (
      node.type !== "blob" ||
      !node.path.startsWith("documentation-site/examples/") ||
      !node.path.endsWith(".tsx")
    ) {
      continue
    }

    const parts = node.path.split("/")
    if (parts.length < 4) {
      continue
    }

    const componentName = parts[2]
    if (!map.has(componentName)) {
      map.set(componentName, [])
    }

    map.get(componentName)!.push(node.path)
  }

  return map
}

function createDefaultVariants(componentName: string): BasewebComponentVariant[] {
  const variants: BasewebComponentVariant[] = [
    {
      id: "light-default",
      label: "Light / Default",
      theme: "light",
      state: "default",
    },
    {
      id: "dark-default",
      label: "Dark / Default",
      theme: "dark",
      state: "default",
    },
  ]

  if (PORTAL_COMPONENTS.has(componentName)) {
    variants.push(
      {
        id: "light-interactive",
        label: "Light / Interactive",
        theme: "light",
        state: "interactive",
      },
      {
        id: "dark-interactive",
        label: "Dark / Interactive",
        theme: "dark",
        state: "interactive",
      }
    )
  }

  return variants
}
