# Frontend Development Guidelines for AI Agents (AGENTS.md)

Welcome to the Opsway frontend repository guidelines. This document provides technical instructions and constraints for modifying the frontend applications and packages.

---

## 1. Directory Structure

The frontend is structured as a TypeScript monorepo using **pnpm** and **Turborepo**:

- **[apps/dashboard](file:///home/teis/opsway/frontend/apps/dashboard)**: Vite + React + Joy UI (`@mui/joy`) dashboard application (dark theme).
- **[apps/status-page](file:///home/teis/opsway/frontend/apps/status-page)**: Vite + React + Material UI public service status pages.
- **[apps/website](file:///home/teis/opsway/frontend/apps/website)**: Vite + React + Joy UI marketing website using `@tanstack/react-router` (own dark theme in `src/theme.ts`).
- **[packages/ui](file:///home/teis/opsway/frontend/packages/ui)**: Shared themes: `JoyTheme` (dashboard) and the legacy Material `DarkTheme` (status-page).

---

## 2. Command Reference

All command executions must be performed from the root [frontend/](file:///home/teis/opsway/frontend) directory:

- **Development Server**: `pnpm dev`
- **Production Build**: `pnpm build`
- **Linter**: `pnpm lint` (oxlint, config in `.oxlintrc.json`)
- **Type check**: `pnpm typecheck` (TypeScript 7)
- **Tests**: `pnpm test` (vitest)
- **Unused code/deps**: `pnpm knip`
- **Everything**: `pnpm check`
- **Formatting**: `pnpm format`

---

## 3. Technology Stack & Coding Standards

### package.json & Monorepo Resolution

- **Never bypass pnpm**: Always use `pnpm --filter <app-or-package> add <dependency>` to modify package lists. Do not execute standard `npm install` or generate `package-lock.json` files.
- Keep devDependencies and dependencies strictly scoped to the packages that use them.

### UI & Styling Guidelines

- **Design System & Theme**: Dashboard and website styling runs through Joy UI (`@mui/joy` components, `sx`, `styled` from `@mui/joy`) and the theme tokens (`text.secondary`, `background.level1`, `divider`, `radius`, …). Don't import `@mui/material` there; the status-page app still uses Material UI.
- **Vanilla CSS vs Tailwind**: Avoid TailwindCSS unless explicitly requested by the user. Rely on predefined theme configuration tokens and shared components in `@opsway/ui`.
- Maintain responsive layouts and smooth transitions. Avoid hardcoded generic colors (e.g. `red`, `blue`); instead, query theme colors.

### Routing & State

- **Router**: `website` uses `@tanstack/react-router` with Vite route generation. Keep route definitions structured under `src/routes/`. Other applications (e.g., `dashboard`) use standard `react-router-dom`.
- **State Management**: Standard client state is handled via `zustand`. Server-side caching is managed via `@tanstack/react-query`.

### Mock API Integration

- The dashboard application features a mocked developer mode accessible via:
  ```bash
  pnpm start:mocked
  ```
  This sets the `MOCKED` env flag (see `apps/dashboard/src/env.ts`); there is currently no mock adapter implementation.
- **Rule**: When adding, updating, or removing API calls, always verify and update the mock adapters in [apps/dashboard/src](file:///home/teis/opsway/frontend/apps/dashboard/src) (look for mock definitions/adapters) to ensure the mocked development server launches successfully and functions correctly.

---

## 4. Verification Checklist

Before completing any frontend task:

1. Run `pnpm check` (oxlint, TypeScript, vitest and knip) and fix everything it reports.
2. Run `pnpm build` to verify there are no compilation errors inside Turborepo.
3. Validate mock configurations if you modified REST integrations.
