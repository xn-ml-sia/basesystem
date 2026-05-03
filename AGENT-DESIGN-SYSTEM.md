# Design system guide for agents

This repository is upstream **shadcn/ui** with a **fork-local design direction** applied in the v4 app. There is **no separate npm package** named “design system”; agents should treat **`apps/v4` + `DESIGN.md` + CSS tokens** as the source of truth.

## Where things live

| Concern | Location |
|--------|----------|
| Product / brand spec (roles, rationale) | [`DESIGN.md`](./DESIGN.md) |
| Token names ↔ `DESIGN.md` roles | [`apps/v4/DESIGN-TOKEN-MAPPING.md`](./apps/v4/DESIGN-TOKEN-MAPPING.md) |
| Rollout / migration notes | [`apps/v4/DESIGN-MIGRATION.md`](./apps/v4/DESIGN-MIGRATION.md) |
| Global semantic colors, motion, typography | [`apps/v4/app/globals.css`](./apps/v4/app/globals.css) |
| UberMove font registration | [`apps/v4/lib/fonts.ts`](./apps/v4/lib/fonts.ts), [`apps/v4/public/fonts/`](./apps/v4/public/fonts/) |
| shadcn-style primitives (Button, Card, …) | [`apps/v4/registry/new-york-v4/ui/`](./apps/v4/registry/new-york-v4/ui/) |
| Example product surface (“Jupitermoss”) | [`apps/v4/app/(app)/jupitermoss/`](./apps/v4/app/(app)/jupitermoss/), data in [`apps/v4/lib/jupitermoss-places.ts`](./apps/v4/lib/jupitermoss-places.ts) |

## Run and verify the v4 app

From the **`ui/` directory** (this is the git root for this workspace):

```bash
pnpm install
pnpm v4:dev
```

Then open the dev URL printed for the v4 app (commonly port **4000**). Navigate to **`/jupitermoss`** for the scoped demo.

Useful checks before pushing:

```bash
pnpm --filter=v4 lint
pnpm --filter=v4 typecheck
```

## How to use tokens in UI code

1. **Default site chrome** uses shadcn semantic tokens: `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc. Their values are set in `:root` / `.dark` in `globals.css`.
2. **Product-specific palettes** should stay **scoped in CSS**, not hard-coded as one-off hex across many components. The Jupitermoss pattern:
   - Wrap the product subtree in a container with **`data-slot="jupitermoss"`** (see the Jupitermoss route layouts).
   - Define **`--jm-*`** variables under `[data-slot="jupitermoss"]` in `globals.css` (reference swatches + semantic aliases).
   - In TSX, prefer **`style={{ color: "var(--jm-accent)" }}`** or Tailwind arbitrary values like **`bg-[var(--jm-chip-bg)]`** so the subtree reads the scoped variables.

3. **Typography**: headings use the heading font stack; body uses `--font-sans`. Do not re-embed font files in random routes; extend `lib/fonts.ts` if you add families.

## Adding a new scoped “brand island”

1. Add a `[data-slot="your-product"]` block in `globals.css` with your semantic `--your-*` variables (reference hex only inside that block when needed).
2. Mount pages under `app/(app)/your-product/` and set `data-slot` on a top-level wrapper once.
3. Reuse **registry components** from `registry/new-york-v4/ui/` so behavior (focus, a11y) stays consistent; adjust only classes / CSS variables.

## Registry and templates

- **Registry JSON** under `apps/v4/public/r/styles/new-york-v4/` mirrors built component styles; if you change primitives, rebuild the registry when the project expects it (`pnpm registry:build` from root — see root `package.json`).
- **Starter templates** under `templates/` were synced to carry globals / font paths consistent with v4; treat them as consumers of the same token story, not the primary editing surface.

## Git root

The parent folder `base-system/` may **not** contain `.git`. Clone operations and **`git push origin main`** apply to **`ui/`** for this tree.
