# Manual Visual QA Pass Workflow

This workflow is for validating the DESIGN.md migration quality in `apps/v4`.

## 1) Start the app

```bash
pnpm --filter=v4 dev
```

Open: `http://localhost:4000`

## 2) Priority routes

Validate these first on every pass:

1. `/view/new-york-v4/login-03`
2. `/view/new-york-v4/login-04`
3. `/view/new-york-v4/sidebar-03`
4. `/view/new-york-v4/sidebar-07`
5. `/view/new-york-v4/dashboard-01`
6. `/docs/components/radix/button`
7. `/docs/components/radix/input`
8. `/docs/components/radix/select`
9. `/docs/components/radix/tabs`

## 3) Per-component checklist

For each route, validate:

- **Color discipline**: black/white first, neutral grays only for support states.
- **Shape language**: pills for chips/buttons where appropriate, 8/12px elsewhere.
- **State coverage**: default, hover, focus-visible, active, disabled, invalid.
- **Typography hierarchy**: heading weight/size contrast, readable body labels.
- **Depth**: subtle shadows only (`0.12-0.16` opacity), no heavy glow.

## 4) Interaction checks

- Keyboard tab through key controls to ensure focus rings are visible and consistent.
- Verify no state loses contrast in dark mode surfaces.
- Validate overlays (dialog/drawer/popover/tooltip/toast) open/close behavior and readability.

## 5) Record findings format

For each issue, record:

- Route
- Element/component
- Severity (`high`, `medium`, `low`)
- Expected behavior
- Actual behavior
- Suggested fix (token-level preferred; component-level if needed)

## 6) Exit criteria

A pass is complete when:

- No high-severity contrast or readability issues remain.
- Primary controls follow the intended shape/radius rules.
- Focus-visible and disabled states are consistent across component groups.
- Overlays and feedback components read clearly and feel visually coherent.
