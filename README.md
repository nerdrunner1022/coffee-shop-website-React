# Beans in a Pot — Prototype

Clickable front-end prototype for the Beans in a Pot coffee shop. No backend, database, or production integrations.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Phase status

- Phase 1: `docs/PROTOTYPE_BRIEF.md` validated.
- Phase 2: responsive homepage, full menu, and admin prototype routes implemented. Public pages
  share a floating navigation pill with Home, Offers, Menu, Services, and About links. Homepage
  sections fill at least the dynamic viewport height and center their contents. The hero begins
  with a solid background before its contents appear, followed 250ms later by the header; section
  color wipes reverse as users scroll in either direction. Menu sections also reveal on scroll.

## Routes

- `/` — public homepage.
- `/menu` — full public menu.
- `/admin` — admin overview; navigate to `/admin/menu`, `/admin/offers`, `/admin/catering`, or
  `/admin/newsletter` for the other prototype screens.
- `/admin/login` — demo admin sign-in, also accessible from the account icon in the public header.

The admin sign-in is a client-side prototype gate. Use `test@mail.com` / `demo123`; sign out with
the admin header control. This gate does not provide security and must not be used to protect
production data; there is no authentication backend.

## Tooling notes

- TypeScript is pinned to `6.0.3` because `typescript-eslint@8.72.1` supports `>=4.8.4 <6.1.0`; TypeScript `7.0.2` is outside that peer range.
- `npm audit` reports 10 moderate findings in development tooling (`minimatch` via ESLint and typescript-eslint). `npm audit --omit=dev` reports zero production vulnerabilities.
