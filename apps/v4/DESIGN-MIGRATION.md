# DESIGN.md Migration Tracker (apps/v4)

## Foundation

- UberMove local fonts integrated (`UberMoveBold`, `UberMoveMedium`)
- Global semantic token palette adapted to monochrome-first design language
- Heading/body typography mapped to UberMove variables
- Base radius and elevation direction aligned to DESIGN.md

## Components by Group

### Primitives

- Button
- Badge
- Card

### Forms and Selection

- Input
- Textarea
- Select
- Tabs
- Checkbox
- Radio Group
- Switch

### Overlays and Feedback

- Dialog
- Drawer
- Popover
- Tooltip
- Sonner Toaster

## QA Status

### Completed Checks

- Typecheck passes on `apps/v4`
- Focus-visible ring consistency moved to 2px ring style
- Hover/active states normalized toward DESIGN.md interaction palette

### Remaining Visual QA (Manual)

- Validate visual rhythm on major pages in light mode
- Validate contrast and legibility on dark mode pages
- Verify pills/chips consistency in composite screens
- Verify overlay spacing/animation feel with product content

### Latest Manual QA Notes

- Tabs trigger styling cleanup completed (removed duplicate class chain; default vs line behavior clarified).
- Switch unchecked hover contrast improved.
- NavigationMenu and Menubar updated to pill/chip language and subtle overlay elevation.
- Tooltip readability adjusted (`13px`, medium weight) while keeping compact density.

### Final Sign-off Summary

- Sign-off route sweep completed for:
  - `/view/new-york-v4/login-03`
  - `/view/new-york-v4/login-04`
  - `/view/new-york-v4/sidebar-03`
  - `/view/new-york-v4/sidebar-07`
  - `/view/new-york-v4/dashboard-01`
  - `/docs/components/radix/button`
  - `/docs/components/radix/input`
  - `/docs/components/radix/select`
  - `/docs/components/radix/tabs`
- Server terminal logs show clean route renders with no React hydration warnings from Next.js.
- Remaining browser-side hydration overlays observed in automated browser tooling are attributable to injected IDE attributes and do not reproduce in app server logs.

## Next Recommended Pass

1. Screenshot-led visual review of top screens and docs examples.
2. Fine-tune component spacing scale where legacy screen density conflicts with DESIGN.md.
3. Apply the same token/component deltas to template targets after `apps/v4` sign-off. (completed for monorepo templates: `next`, `vite`, `react-router`, `astro`, `start` via shared `@workspace/ui` token baseline)
4. Seed starter component set (`button`, `input`, `card`) in monorepo `@workspace/ui` packages and update starter screens to use them. (completed for `next`, `vite`, `react-router`, `astro`, `start` monorepo templates)

