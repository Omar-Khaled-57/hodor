# Hodor development

## Prerequisites

- Node.js 20+ and npm (the original [`README.md`](../README.md) states Node
  20+; `next@16.2.4` is declared in [`package.json`](../package.json)).
- Arduino IDE with ESP8266, MFRC522, TFT_eSPI, and ESP8266WiFi / HTTPClient
  libraries for the hardware path.
- For RFID scanning: the ESP8266 and the machine running the dev server on the
  same WiFi network. Simulation mode needs no hardware.

## Install and run

```bash
npm install
npm run dev
```

Open the dev server at the port Next.js prints (the firmware example uses
port 3000). Build and serve with:

```bash
npm run build
npm start
```

## Command reference

Every command below is copied verbatim from the `scripts` block of
[`package.json`](../package.json).

| Command | Script | Purpose |
| --- | --- | --- |
| `npm run dev` | `next dev` | Start the development server. |
| `npm run build` | `next build` | Produce the production `.next/` output. |
| `npm start` | `next start` | Serve the production build. |
| `npm run lint` | `eslint` | Run ESLint with the project config. |

There is no `test` script. See [testing](./testing.md).

## Repository structure

```text
hardware/esp8266_nextjs_firmware.ino   RFID reader firmware
public/                                Logo and default SVG assets
src/app/
  page.tsx                             / live lecture feed
  all-data/page.tsx                    /all-data roster
  login/page.tsx                       /login admin form
  [uid]/page.tsx, StudentProfileClient.tsx  /[uid] student self-edit
  api/scan/route.ts                    POST UID from hardware
  api/pending_scan/route.ts            GET/DELETE handoff cache
  api/sync_lecture/route.ts            POST active attendee list
  globals.css                          Tailwind theme tokens
  icon.tsx, opengraph-image.tsx, twitter-image.tsx  Metadata images
src/components/                        UI components and Providers
src/contexts/                          Reducer store, auth, locale, theme
src/data/mock.json                     Seed data and demo admin credentials
src/i18n/strings.ts                    EN/AR strings
```

## Conventions evidenced in the tree

- Interactive pages and most components start with `'use client'`;
  `src/app/[uid]/page.tsx` stays a server component and unwraps `params` with
  React `use()`.
- Imports use the `@/` alias for `src/` (see [`tsconfig.json`](../tsconfig.json)).
- Shared mutable state belongs in `StoreContext.tsx` reducer actions;
  component-local UI state uses `useState` inside the component.
- UI copy is added to both `strings.en` and `strings.ar` in
  [`src/i18n/strings.ts`](../src/i18n/strings.ts); direction and theme are set on
  `<html>` by the locale and theme contexts.
- Visual values come from CSS variables in
  [`src/app/globals.css`](../src/app/globals.css); see
  [visual identity](./visual-identity.md).

## Adding a feature

1. Add or edit the route under `src/app/` (or a component under
   `src/components/`).
2. If it needs shared attendance data, add an action to the reducer in
   `src/contexts/StoreContext.tsx` and expose it through `StoreContextValue`.
3. Add any new copy to both locales in `src/i18n/strings.ts`.
4. Style with existing Tailwind theme tokens (`bg-surface`, `text-accent`, and
   similar) rather than new hard-coded colors.
5. Verify with `npm run lint` and `npm run build`; manually exercise both
   languages and both themes. See [testing](./testing.md) for the limits of
   what is automated.

## Hardware setup

The steps below follow
[`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino)
and the original hardware section of the README:

1. Open the `.ino` file in Arduino IDE. It includes `SPI.h`, `MFRC522.h`,
   `TFT_eSPI.h`, `ESP8266WiFi.h`, and `ESP8266HTTPClient.h`.
2. Edit `WIFI_SSID`, `WIFI_PASSWORD`, and `SERVER_URL` at lines 15–17. The
   committed values are a local network example ending in `/api/scan`; replace
   them before flashing. Do not commit real credentials.
3. Wire the pins defined at the top of the sketch: `SS_PIN D8`, `RST_PIN D3`,
   `BUZZER D2`, `RGB_RED D4`, `RGB_GREEN 3`.
4. Start the Next.js server (`npm run dev`) and scan a card. The firmware POSTs
   `{"uid": "..."}` to `/api/scan`; the page polls for the pending UID while a
   lecture is active.

The scan API looks up UIDs in `src/data/mock.json`, so a card whose UID is not
in that file is reported as unknown.

## Troubleshooting grounded in the code

| Symptom | Check |
| --- | --- |
| Scan never appears in the feed | A lecture must be active; `StoreContext.tsx` only starts polling when `activeLectureId` is set. It polls every 1500 ms. |
| Firmware cannot reach the server | `SERVER_URL` in the sketch must point to the machine running Next.js on the same network; `StoreContext.tsx` can override the poll URL with `NEXT_PUBLIC_API_URL`. |
| Card reported as unknown | `/api/scan` only recognizes UIDs present in `src/data/mock.json`. |
| Duplicate scan ignored | The reducer rejects a UID already present in the active lecture's `attendees`. The firmware's "Already Marked" screen uses the synced attendee file. |
| Two tabs disagree | `StoreContext.tsx` listens for `storage` events on `hodor-store`; both tabs must share the same browser profile. |
| Simulation changes vanish | Persistence is intentionally skipped during simulation, and stopping it removes simulated scans from the active lecture. |
| `npm run lint` reports hook dependencies | `StoreContext.tsx` contains targeted `eslint-disable` comments for its interval and effect callbacks; inspect them before changing the polling logic. |

## Sources

- [`package.json`](../package.json), [`tsconfig.json`](../tsconfig.json), [`README.md`](../README.md)
- [`src/app/`](../src/app/), [`src/contexts/StoreContext.tsx`](../src/contexts/StoreContext.tsx), [`src/i18n/strings.ts`](../src/i18n/strings.ts), [`src/app/globals.css`](../src/app/globals.css)
- [`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino)
