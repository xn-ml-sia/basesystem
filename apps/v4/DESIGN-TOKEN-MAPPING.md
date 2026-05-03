# DESIGN.md Token Mapping (apps/v4)

This maps the Uber-inspired design roles in [`DESIGN.md`](../../DESIGN.md) to semantic app tokens in `apps/v4`.

## Color Role Mapping

| DESIGN.md Role | Hex/Spec | apps/v4 Token |
|---|---|---|
| Uber Black | `#000000` | `--primary`, `--foreground` (light), `--background` (dark) |
| Pure White | `#ffffff` | `--background` (light), `--primary-foreground`, `--foreground` (dark) |
| Chip Gray | `#efefef` | component-level chip treatments (`Button ghost`, tabs/list surfaces, menu hovers) |
| Hover Gray | `#e2e2e2` | component hover/focus fills for secondary controls |
| Hover Light | `#f3f3f3` | subtle hover fill for inputs/select triggers |
| Body Gray | `#4b4b4b` | approximated by `--muted-foreground` |
| Muted Gray | `#afafaf` | switch unchecked state and tertiary UI text contexts |
| Border Black | `#000000` | `--border`, `--input` (light mode baseline) |
| Shadow Light | `rgba(0,0,0,0.12)` | cards/select overlays default shadow |
| Shadow Medium | `rgba(0,0,0,0.16)` | dialog/drawer/popover/tooltip elevated shadow |

## Typography Mapping

| DESIGN.md Role | apps/v4 Mapping |
|---|---|
| Headline / Display (`UberMove`, 700) | `--font-heading -> --font-uber-move-bold` |
| Body / UI (`UberMoveText`, 400-500) | `--font-sans -> --font-uber-move-medium` |
| Heading behavior | Global heading rule in `app/globals.css` uses `font-weight: 700`, tighter line-height |

## Radius and Shape Mapping

| DESIGN.md Role | apps/v4 Mapping |
|---|---|
| Standard corners (8px) | `--radius: 0.5rem` |
| Feature corners (12px) | component-level `rounded-xl` |
| Pills (999px) | `rounded-full` on primary interactive controls |

## Component Groups Covered

- Primitives: `button`, `badge`, `card`
- Forms/selection: `input`, `textarea`, `select`, `tabs`, `checkbox`, `radio-group`, `switch`
- Overlays/feedback: `dialog`, `drawer`, `popover`, `tooltip`, `sonner`
- Navigation/layout: `navigation-menu`, `menubar`

## Notes

- Semantic shadcn tokens are preserved (`bg-background`, `text-foreground`, etc.) while values are remapped to the DESIGN.md direction.
- A few component hovers use explicit neutral values (`#efefef`, `#e2e2e2`, `#f3f3f3`) to preserve the Uber-style interaction feel where token granularity is intentionally limited.
