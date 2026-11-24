# Hodor deployment

## Build and serve

From [`package.json`](../package.json):

```bash
npm run build
npm start
```

`npm run build` runs `next build` and writes the `.next/` output. `.next/` is
gitignored; a copy exists in the working directory from an earlier build, but
it is a build artifact, not source. `npm start` runs `next start` against the
build output. Development uses `npm run dev` (`next dev`).

## Configuration present in the repo

- [`next.config.ts`](../next.config.ts) is empty: no output mode, rewrites, or
  custom build flags.
- [`src/app/layout.tsx`](../src/app/layout.tsx) sets `metadataBase` to
  `https://hodor-devora.vercel.app`. That is metadata in source code, not a
  deployment record.
- One runtime variable may be supplied: `NEXT_PUBLIC_API_URL`, which overrides
  the browser's scan poll endpoint. See [configuration](./configuration.md).
- The scan flow needs a writable OS temp directory on the server and network
  reachability from the ESP8266 to `/api/scan` (the firmware example targets
  port 3000).

## What is not configured

- No `vercel.json`, `Dockerfile`, `Procfile`, or serverless function mapping is
  committed.
- No CI/CD workflow, deploy script, or health check is present.
- No database or managed storage is configured. Students, lectures, and the
  admin flag live in browser `localStorage`; scan handoff uses OS temp files.
  The temp-file design assumes a single persistent Node.js process; no shared
  or durable storage adapter is provided.
- No environment template (`.env.example`) is committed, and `.env*` is
  gitignored.
- No release packaging or attendance export pipeline exists. Reports are
  printed from the browser by `LectureReportModal.tsx`.

## Operational notes

- Admin access is demo-only: credentials are in `src/data/mock.json` and the
  API routes do not enforce the admin flag. Do not expose the app to untrusted
  users as-is.
- The committed firmware carries literal WiFi credentials and a local IP
  address; reflash with deployment-specific values before use.
- Build with `npm run build` and verify with `npm run lint`; there is no test
  command. See [testing](./testing.md).

## Sources

- [`package.json`](../package.json), [`next.config.ts`](../next.config.ts), [`.gitignore`](../.gitignore)
- [`src/app/layout.tsx`](../src/app/layout.tsx), [`src/contexts/StoreContext.tsx`](../src/contexts/StoreContext.tsx), [`src/app/api/`](../src/app/api/)
- [`hardware/esp8266_nextjs_firmware.ino`](../hardware/esp8266_nextjs_firmware.ino)
