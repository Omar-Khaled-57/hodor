# Hodor architecture

## Technology stack

Versions are taken from [`package.json`](../package.json).

| Layer | Choice |
| --- | --- |
| Framework | Next.js `16.2.4`, App Router |
| UI | React `19.2.4`, TypeScript `^5` |
| Styling | Tailwind CSS `^4` via `@tailwindcss/postcss` |
| Motion | `framer-motion` `^12.38.0` |
| Notifications | `sonner` `^2.0.7` |
| QR codes | `qrcode.react` `^4.2.0` |
| Linting | ESLint `^9` with `eslint-config-next` `16.2.4` |

## Entry points

| Entry | Role |
| --- | --- |
| [`src/app/layout.tsx`](../src/app/layout.tsx) | Root layout; loads Inter and Cairo through `next/font/google`, sets metadata, wraps children in `Providers` and `InitialLoader`. |
| [`src/components/Providers.tsx`](../src/components/Providers.tsx) | Nested providers: theme → locale → auth → store, plus the Sonner `Toaster`. |
| [`src/app/page.tsx`](../src/app/page.tsx) | `/` live lecture feed and admin controls. |
| [`src/app/all-data/page.tsx`](../src/app/all-data/page.tsx) | `/all-data` roster table with search and sorting. |
| [`src/app/login/page.tsx`](../src/app/login/page.tsx) | `/login` admin form. |
| [`src/app/[uid]/page.tsx`](../src/app/[uid]/page.tsx) | `/[uid]`; unwraps the `params` promise with React `use()` and renders `StudentProfileClient.tsx`. |
| [`src/app/api/`](../src/app/api/) | `scan`, `pending_scan`, and `sync_lecture` route handlers. |
| [`src/app/icon.tsx`](../src/app/icon.tsx), [`opengraph-image.tsx`](../src/app/opengraph-image.tsx), [`twitter-image.tsx`](../src/app/twitter-image.tsx) | Generated metadata images. |

`next.config.ts` contains an empty `NextConfig` object; no rewrites, env
declarations, or output mode overrides are configured there.

## Directory map

```text
hardware/                 ESP8266 firmware (SPI/RFID, TFT, WiFi, HTTP POST)
src/app/                  App Router pages, API routes, metadata images, tokens
src/components/           Navbar, modals, banners, rows, toggles, loader, providers
src/contexts/             Theme, locale, auth, and store providers/reducer
src/data/mock.json        Seed students, seed lectures, demo admin credentials
src/i18n/strings.ts       English/Arabic string tables
public/                   Logo and default Next.js SVG assets
```

Imports use the `@/*` alias mapped to `./src/*` in
[`tsconfig.json`](../tsconfig.json).

## State and data flow

`StoreContext.tsx` owns a `useReducer` store with students, lectures, the
active lecture ID, recent scans, global edit flag, unknown UID, and simulation
state. It starts from `src/data/mock.json`, hydrates from `localStorage`
(`hodor-store`, with a legacy `hodor-active-lecture` fallback), and listens for
cross-tab `storage` events. Persistence is skipped while simulation is active.

```text
RFID card
  │
  ▼
ESP8266 firmware ── HTTP POST {"uid": "..."} ──▶ /api/scan
                                                    │
                                                    ▼
                                    os.tmpdir()/rfid_last_scan.json
                                                    │  GET (≤60 s old)
                                                    ▼
StoreContext polling (1.5 s) ──▶ GET /api/pending_scan (or NEXT_PUBLIC_API_URL)
                                  DELETE same URL after consuming the UID
                                  │
                                  ▼
                          SCAN_STUDENT action ──▶ active lecture attendees
                                  │                 + student scannedAt
                                  ▼
                          localStorage 'hodor-store' ──▶ UI rows / report

Browser active lecture ──POST /api/sync_lecture──▶ os.tmpdir()/rfid_active_attendees.json
                                                    │
                                                    ▼
                                          /api/scan reads it to set
                                          the firmware's "already" flag
```

Simulation mode replaces the polling branch with a timer (2.5–7 s delay)
that dispatches random `SCAN_STUDENT` or `UNKNOWN_SCAN` actions. It never
writes the simulation state to `localStorage`, and `STOP_SIMULATION` removes
UIDs collected during the simulation from the active lecture's attendees.

Other boundaries:

- `AuthContext.tsx` compares typed credentials against the admin object in
  `src/data/mock.json` and stores a boolean flag in `localStorage`
  (`hodor-admin`). API routes do not consult it.
- `LocaleContext.tsx` writes `lang` and `dir` to `<html>` and stores
  `hodor-locale`; `ThemeContext.tsx` toggles `html.dark` and stores
  `hodor-theme`.
- `LectureReportModal.tsx` builds its own HTML string and prints it through a
  hidden iframe; it does not call a server endpoint.
- `QRModal.tsx` renders `QRCodeSVG` for a student UID and links to `/${uid}`.

## Process model

The repository contains a single Next.js application. During a real lecture it
assumes one reachable Node.js process with a writable OS temp directory: the
API handlers and the browser poll coordinate through temp files, not a shared
database. The ESP8266 is a separate device on the same network. No worker
process, queue, or external cache is configured.

## Sources

- [`package.json`](../package.json), [`next.config.ts`](../next.config.ts), [`tsconfig.json`](../tsconfig.json), [`postcss.config.mjs`](../postcss.config.mjs)
- [`src/app/layout.tsx`](../src/app/layout.tsx), [`src/components/Providers.tsx`](../src/components/Providers.tsx), [`src/app/`](../src/app/)
- [`src/contexts/StoreContext.tsx`](../src/contexts/StoreContext.tsx), [`src/contexts/AuthContext.tsx`](../src/contexts/AuthContext.tsx), [`src/contexts/LocaleContext.tsx`](../src/contexts/LocaleContext.tsx), [`src/contexts/ThemeContext.tsx`](../src/contexts/ThemeContext.tsx)
- [`src/app/api/pending_scan/route.ts`](../src/app/api/pending_scan/route.ts), [`src/app/api/scan/route.ts`](../src/app/api/scan/route.ts), [`src/app/api/sync_lecture/route.ts`](../src/app/api/sync_lecture/route.ts)
- [`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino)
