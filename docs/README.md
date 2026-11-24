# Hodor documentation

Hodor is the Next.js frontend for Devora's RFID attendance project at OTU. It
shows a live lecture feed, a searchable student roster, an admin login, and a
QR-linked self-edit page for students. This index follows the
[hub documentation standard](../../docs/DOC-STANDARD.md).

## Start here

- [Product](./product.md) — the problem, audience, feature inventory, and gaps.
- [Architecture](./architecture.md) — routes, state, API routes, and the ESP8266
  handoff.
- [Development](./development.md) — install, commands, conventions, hardware
  setup, and troubleshooting.

Configuration, testing, deployment, and release history each have their own
page. The pre-existing [visual identity guide](./visual-identity.md) remains
the design reference.

## Documentation index

| Page | Answers |
| --- | --- |
| [Product](./product.md) | What Hodor does today and what it does not do. |
| [Architecture](./architecture.md) | Stack, entry points, directory map, data and process flow. |
| [Development](./development.md) | Prerequisites, scripts, repository map, conventions, fixes. |
| [Configuration](./configuration.md) | Env var, config files, local storage keys, server temp files, hardware constants. |
| [Testing](./testing.md) | Scripts, absence of a test runner, manual checks, gaps. |
| [Deployment](./deployment.md) | Build command, artifact, runtime assumptions, missing config. |
| [Changelog](./changelog.md) | Release-note pointers and version history that actually exists. |
| [Visual identity](./visual-identity.md) | Palette and design tokens (pre-existing guide). |
| [Hub documentation standard](../../docs/DOC-STANDARD.md) | The shared contract all hub projects follow. |

## Canonical source-of-truth files

| File | Authority for |
| --- | --- |
| [`package.json`](../package.json) | Scripts, dependency versions, package name and version. |
| [`next.config.ts`](../next.config.ts) | Next.js configuration (currently empty). |
| [`src/app/layout.tsx`](../src/app/layout.tsx) | Root layout, metadata, provider tree. |
| [`src/app/page.tsx`](../src/app/page.tsx) | Live lecture feed and lecture controls. |
| [`src/app/all-data/page.tsx`](../src/app/all-data/page.tsx) | Roster search and sorting. |
| [`src/app/login/page.tsx`](../src/app/login/page.tsx) | Admin login form. |
| [`src/app/[uid]/StudentProfileClient.tsx`](../src/app/[uid]/StudentProfileClient.tsx) | Student self-edit rules and lecture history. |
| [`src/contexts/StoreContext.tsx`](../src/contexts/StoreContext.tsx) | Reducer, polling, simulation, persistence. |
| [`src/contexts/AuthContext.tsx`](../src/contexts/AuthContext.tsx), [`src/contexts/LocaleContext.tsx`](../src/contexts/LocaleContext.tsx), [`src/contexts/ThemeContext.tsx`](../src/contexts/ThemeContext.tsx) | Admin flag, locale/direction, theme. |
| [`src/app/api/`](../src/app/api/) | Scan and lecture-sync HTTP handlers. |
| [`src/data/mock.json`](../src/data/mock.json) | Seed students, lectures, and demo admin credentials. |
| [`src/i18n/strings.ts`](../src/i18n/strings.ts) | English and Arabic UI copy. |
| [`src/app/globals.css`](../src/app/globals.css) | Theme tokens and glass utilities. |
| [`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino) | ESP8266 + MFRC522 + TFT firmware. |
| [`README.md`](../README.md) | Original project overview, team notes, hardware walkthrough. |

## Known gaps

- No `test` script and no test files are present. See [testing](./testing.md).
- Student data and admin credentials are demo data in `src/data/mock.json`; no
  database is configured.
- API handlers exchange scan state through files in the server's OS temp
  directory; no external storage or serverless adapter is configured.
- No `vercel.json`, CI workflow, or Dockerfile is committed.
