# Hodor product

## Problem and audience

A university attendance workflow needs two different views: staff start a
lecture and watch scans arrive, while students check their own record and fix
their details. Hodor is the browser frontend for that workflow, built as the
frontend part of Devora's Embedded System University Project at OTU. The
hardware side is an ESP8266 with an MFRC522 RFID reader and a TFT screen.

The audience is therefore:

- **Lecturers / admins** — start and finish lectures, watch the live feed,
  manage the roster, print a lecture report, and control edit permissions.
- **Students** — see attendance history and edit their own name and ID when
  permitted, through a QR-linked profile page.
- **Hardware operators** — flash the ESP8266 firmware and point it at a reachable
  Next.js server.

## What it does today

All behavior below is implemented in the tracked source; there is no backend
service beyond the three Next.js route handlers under `src/app/api/`.

| Capability | Implementation |
| --- | --- |
| Live lecture feed | `src/app/page.tsx` maps the active lecture's attendees to student rows, newest scan first; `LectureStatusBanner.tsx` shows the active lecture state. |
| Lecture lifecycle | `StartLectureModal.tsx` creates a lecture; the reducer allows one active lecture at a time; `src/app/page.tsx` finishes it and opens `LectureReportModal.tsx`. |
| Printable lecture report | `LectureReportModal.tsx` computes present/absent counts, rate, and duration, builds an HTML report string, writes it to a hidden iframe, and calls `print()` on it. |
| Roster and search | `src/app/all-data/page.tsx` filters by name (EN/AR), ID, or UID and sorts by name, percentage, or recent scan. |
| Student records | `StudentRow.tsx` exposes QR, edit, and delete dialogs (`QRModal.tsx`, `EditEntryModal.tsx`, `ConfirmDeleteModal.tsx`). |
| Student self-edit | `src/app/[uid]/page.tsx` and `StudentProfileClient.tsx` show a profile and allow edits only when both `globalAllowSelfEdit` and the student's `allowSelfEdit` are true. |
| Admin login | `src/app/login/page.tsx` compares input with `src/data/mock.json` admin fields via `AuthContext.tsx`; the flag is stored in `localStorage`. |
| Bilingual UI | `src/i18n/strings.ts` holds `ar` and `en` copy; `LocaleContext.tsx` sets `lang` and `dir` on `<html>` and switches to Cairo font under RTL in `globals.css`. |
| Themes | `ThemeContext.tsx` toggles `html.dark`; tokens live in `src/app/globals.css` and are summarized in [visual identity](./visual-identity.md). |
| Scan simulation | `Navbar.tsx` exposes start/stop; `StoreContext.tsx` schedules random scans (including unknown cards) and removes simulated scans when stopped. |
| RFID handoff | `src/app/api/scan/route.ts` accepts a UID from the firmware; `StoreContext.tsx` polls `GET /api/pending_scan`, consumes it with `DELETE`, and posts the active attendee list to `/api/sync_lecture`. |

## Data that exists today

- `src/data/mock.json` ships 10 students, 2 lectures, and one admin username /
  password pair. New students, edits, and lecture history live in browser
  `localStorage` (`hodor-store`) and are shared across tabs via `storage`
  events.
- Server-side handoff uses `os.tmpdir()` files: `rfid_last_scan.json` (read if
  newer than 60 seconds) and `rfid_active_attendees.json`.
- `next.config.ts` has no options; no database URL or external service is
  configured.

## Non-goals and known gaps

- **Not a persistent backend.** Data is seeded from a committed JSON file and
  cached in the browser. There is no database, migration, or account system.
- **Demo-only access control.** Admin credentials are readable in
  `src/data/mock.json`; API routes do not check the admin flag.
- **No committed test suite.** See [testing](./testing.md).
- **No deployment configuration.** `src/app/layout.tsx` sets a `metadataBase`
  URL, but no `vercel.json`, CI workflow, or Dockerfile is present.
- **Simulation is ephemeral.** Persistence to `hodor-store` is skipped while
  simulation is active, and stopping simulation removes simulated attendees
  from the active lecture (`StoreContext.tsx`).
- **A committed `.next/` build artifact exists** locally but is gitignored; it
  reflects a prior build and is not the source of truth for routes.

## Sources

- [`README.md`](../README.md)
- [`package.json`](../package.json)
- [`src/app/page.tsx`](../src/app/page.tsx), [`src/app/all-data/page.tsx`](../src/app/all-data/page.tsx), [`src/app/login/page.tsx`](../src/app/login/page.tsx), [`src/app/[uid]/StudentProfileClient.tsx`](../src/app/[uid]/StudentProfileClient.tsx)
- [`src/components/`](../src/components/), [`src/contexts/`](../src/contexts/), [`src/i18n/strings.ts`](../src/i18n/strings.ts), [`src/data/mock.json`](../src/data/mock.json)
- [`src/app/api/`](../src/app/api/), [`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino)
