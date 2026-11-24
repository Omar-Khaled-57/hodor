# Hodor configuration

## Environment variables

Only one environment variable is read in the tracked application source:

| Variable | Read in | Default | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | [`src/contexts/StoreContext.tsx`](../src/contexts/StoreContext.tsx) line 373 | `/api/pending_scan` | Overrides the URL used by the real-hardware polling loop for both `GET` and `DELETE`. Because it has the `NEXT_PUBLIC_` prefix, it is exposed to the browser. |

There is no `.env`, `.env.example`, or environment declaration in
`next.config.ts`. The root `.gitignore` ignores `.env*` and `.next/`.
`CHROME_PATH`-style tooling variables are not used in this project.

## Config files

| File | What it sets |
| --- | --- |
| [`next.config.ts`](../next.config.ts) | Empty `NextConfig`; no custom flags. |
| [`tsconfig.json`](../tsconfig.json) | Strict TypeScript, `noEmit`, bundler resolution, `@/* → ./src/*`. |
| [`postcss.config.mjs`](../postcss.config.mjs) | Single plugin: `@tailwindcss/postcss`. |
| [`eslint.config.mjs`](../eslint.config.mjs) | ESLint flat config for the Next.js app. |
| [`src/app/globals.css`](../src/app/globals.css) | Light/dark CSS variable tokens, Tailwind `@theme` mapping, `.glass` utility. |
| [`next-env.d.ts`](../next-env.d.ts) | Generated Next.js TypeScript declarations (also gitignored). |
| [`.vscode/launch.json`](../.vscode/launch.json) | An unrelated leftover CMake/vcpkg debug configuration; it is not wired to the app. |

## App settings and local storage

These keys are read or written directly by the contexts. Defaults below are the
values in the provider code before hydration.

| Key | Reader / writer | Default and meaning |
| --- | --- | --- |
| `hodor-store` | `StoreContext.tsx` | JSON with `students`, `lectures`, `globalAllowSelfEdit`, and `activeLectureId`. Seeded from `src/data/mock.json`; writes are skipped during simulation. |
| `hodor-active-lecture` | `StoreContext.tsx` | Legacy fallback read only when `hodor-store` is absent. |
| `hodor-admin` | `AuthContext.tsx` | `'true'` when the demo admin login succeeds; removed on logout. |
| `hodor-locale` | `LocaleContext.tsx` | `'en'` or `'ar'`; auto-detected from `navigator.language` when unset. |
| `hodor-theme` | `ThemeContext.tsx` | `'dark'` or `'light'`; defaults to dark before hydration. |

User-facing switches in the UI are the theme toggle, language toggle,
global self-edit toggle (admins on `/` and `/all-data`), and simulation
start/stop. All except simulation are reflected in the keys above.

## Server-side handoff files

These paths are built with `os.tmpdir()` in the API routes; no path override is
configured.

| File | Owner | Behavior |
| --- | --- | --- |
| `rfid_last_scan.json` | `api/scan/route.ts` writes; `api/pending_scan/route.ts` reads and deletes | Holds the latest UID result; `GET` only serves it when its modification time is under 60 seconds old. |
| `rfid_active_attendees.json` | `api/sync_lecture/route.ts` writes; `api/scan/route.ts` reads | Mirror of the active lecture's attendee UIDs used for the firmware's duplicate flag. |

## Hardware constants

[`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino)
contains `WIFI_SSID`, `WIFI_PASSWORD`, and `SERVER_URL` at lines 15–17, plus the
pin definitions at lines 8–12. These are build-time constants in the sketch,
not runtime env vars; edit and rebuild the firmware for each network.

## Security notes

- The committed firmware contains literal WiFi credentials and a local IP
  address. Replace them before deploying and never commit real network
  secrets.
- `src/data/mock.json` contains a demo admin username and password that are
  readable by the browser. `AuthContext.tsx` is UI gating only; the three API
  routes do not verify the admin flag. Do not treat this as authentication for
  real data.
- `NEXT_PUBLIC_API_URL` is intentionally public. Do not put secrets in it.
- The scan handoff files live in the server's temp directory with no locking or
  authentication beyond reachability of the Next.js server. Keep the server on
  a trusted network for the hardware workflow.
- `.env*` is gitignored; prefer injected environment variables over committed
  files for any future configuration.

## Sources

- [`src/contexts/StoreContext.tsx`](../src/contexts/StoreContext.tsx), [`src/contexts/AuthContext.tsx`](../src/contexts/AuthContext.tsx), [`src/contexts/LocaleContext.tsx`](../src/contexts/LocaleContext.tsx), [`src/contexts/ThemeContext.tsx`](../src/contexts/ThemeContext.tsx)
- [`src/app/api/scan/route.ts`](../src/app/api/scan/route.ts), [`src/app/api/pending_scan/route.ts`](../src/app/api/pending_scan/route.ts), [`src/app/api/sync_lecture/route.ts`](../src/app/api/sync_lecture/route.ts)
- [`next.config.ts`](../next.config.ts), [`tsconfig.json`](../tsconfig.json), [`postcss.config.mjs`](../postcss.config.mjs), [`eslint.config.mjs`](../eslint.config.mjs), [`.gitignore`](../.gitignore), [`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino)
