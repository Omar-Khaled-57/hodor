# Hodor testing

## What the manifest provides

[`package.json`](../package.json) declares exactly four scripts:

| Command | Script | Kind of check |
| --- | --- | --- |
| `npm run dev` | `next dev` | Manual exploration. |
| `npm run build` | `next build` | Production build / type and route compilation. |
| `npm start` | `next start` | Manual exploration against the production build. |
| `npm run lint` | `eslint` | Static linting via ESLint 9 and `eslint-config-next`. |

**There is no `test` script.** No `test`, `test:watch`, `coverage`, or similar
command is declared, and no test runner (Jest, Vitest, Playwright, Cypress, or
Node's test runner) is a dependency. No `*.test.*`, `*.spec.*`, `__tests__/`, or
`e2e/` directory exists in the tracked tree. No coverage report is committed;
`.gitignore` does ignore a `/coverage` directory, but none is present.

## What can be verified today

- `npm run lint` — the only dedicated static check wired into the manifest.
  ESLint configuration is in [`eslint.config.mjs`](../eslint.config.mjs).
- `npm run build` — compiles the App Router routes and type-checks the project
  through Next.js.
- Manual smoke checks, derived from the implemented flows:
  - Start a lecture on `/`, then use the navbar's simulation toggle and watch
    rows arrive in `src/app/page.tsx`.
  - Stop simulation and confirm the simulated attendees are removed
    (`StoreContext.tsx` `STOP_SIMULATION`).
  - Finish the lecture and print the report from `LectureReportModal.tsx`.
  - On `/all-data`, search by UID/name/ID and change sort order.
  - Log in on `/login`, then confirm admin controls appear in the navbar and
    that toggling global self-edit disables the form on `/[uid]`.
  - Toggle language and theme and confirm `lang`, `dir`, and `html.dark`
    change as implemented by the contexts.
  - With hardware connected, POST a UID to `/api/scan` and observe the
    `/api/pending_scan` handoff and the firmware response.

## What is not covered

- No automated assertions exist for reducer transitions (`START_LECTURE`,
  `SCAN_STUDENT`, `FINISH_LECTURE`, `STOP_SIMULATION`), the 60-second pending
  scan freshness rule, or duplicate-UID rejection.
- No automated checks cover the API handlers, localStorage hydration, cross-tab
  `storage` sync, login rules, i18n completeness, or the printed report.
- No accessibility, performance, or visual regression suite is configured.
- No CI workflow runs lint or build automatically.

## Sources

- [`package.json`](../package.json), [`eslint.config.mjs`](../eslint.config.mjs), [`.gitignore`](../.gitignore)
- [`src/contexts/StoreContext.tsx`](../src/contexts/StoreContext.tsx), [`src/app/api/`](../src/app/api/), [`src/components/LectureReportModal.tsx`](../src/components/LectureReportModal.tsx)
