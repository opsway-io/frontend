# Frontend Development Guidelines for AI Agents (AGENTS.md)

Welcome to the Opsway frontend repository guidelines. This document provides technical instructions and constraints for modifying the frontend applications and packages.

---

## 1. Directory Structure

The frontend is structured as a TypeScript monorepo using **pnpm** and **Turborepo**:

- **[apps/dashboard](file:///home/teis/opsway/frontend/apps/dashboard)**: Vite + React + Material UI dashboard application.
- **[apps/status-page](file:///home/teis/opsway/frontend/apps/status-page)**: Vite + React + Material UI public service status pages.
- **[apps/website](file:///home/teis/opsway/frontend/apps/website)**: Vite + React + Material UI website using `@tanstack/react-router`.
- **[packages/ui](file:///home/teis/opsway/frontend/packages/ui)**: Shareable component library exporting React components utilizing Material UI styling.

---

## 2. Command Reference

All command executions must be performed from the root [frontend/](file:///home/teis/opsway/frontend) directory:

- **Development Server**: `pnpm dev`
- **Production Build**: `pnpm build`
- **Linter**: `pnpm lint`
- **Formatting**: `pnpm format`

---

## 3. Technology Stack & Coding Standards

### package.json & Monorepo Resolution

- **Never bypass pnpm**: Always use `pnpm --filter <app-or-package> add <dependency>` to modify package lists. Do not execute standard `npm install` or generate `package-lock.json` files.
- Keep devDependencies and dependencies strictly scoped to the packages that use them.

### UI & Styling Guidelines

- **Design System & Theme**: All styling should run through the Material UI (MUI) styling system using `@mui/material` or Emotion `styled` hooks.
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
  This is configured using `axios-mock-adapter`.
- **Rule**: When adding, updating, or removing API calls, always verify and update the mock adapters in [apps/dashboard/src](file:///home/teis/opsway/frontend/apps/dashboard/src) (look for mock definitions/adapters) to ensure the mocked development server launches successfully and functions correctly.

---

## 4. Verification Checklist

Before completing any frontend task:

1. Run `pnpm lint` to check for ESLint or TypeScript issues.
2. Run `pnpm build` to verify there are no compilation errors inside Turborepo.
3. Validate mock configurations if you modified REST integrations.
