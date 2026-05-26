# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # install all workspace dependencies
pnpm dev:portal       # start portal app in dev mode
pnpm build            # build all apps
```

There is no test suite configured (`pnpm test` exits with an error).

## Architecture

This is a **pnpm monorepo** with two packages:

- `base/` — a shared Nuxt layer (`@surf/nuxt-base`) that all apps extend
- `apps/portal/` — the portal application

### Nuxt layer inheritance

`apps/portal/nuxt.config.ts` declares `extends: '@surf/nuxt-base'`. This means everything in `base/` (components, pages, layouts, stores, server routes, composables) is available to the portal app automatically. The portal overrides or augments what it needs in its own directories.

### Authentication

Authentication is handled by `nuxt-oidc-auth` (SURFconext OIDC). The `base/server/middleware/auth.ts` contains JWT middleware, but apps with `appType === 'portal'` bypass it entirely — the portal relies on OIDC session auth instead. The OIDC `idToken` is exposed to the client; `pages/index.vue` decodes it with `jose` to read the `edumember_is_member_of` claim for pilot group membership.

### Credential issuance flow

The core feature is issuing verifiable credentials to digital wallets via QR codes. The `InlineIssuanceAuthorizationCodeFlow` component (`base/components/`) drives this:

1. User clicks "Add to wallet" → `POST /api/credential-offer` with `credentialType`
2. Server-side `createCredentialOffer` (`base/server/utils/credential-offer/index.ts`) dispatches to a type-specific handler (eduId, enrollment, entitlement, exam, result, etc.)
3. Each handler calls an external issuer agent API and returns `{ qr_id, qr_uri, pin }`
4. Component displays the QR code and polls `GET /api/credential-offer-acf/[id]` every 3 seconds
5. Status transitions: `CLEAR → LOADINGQR → SHOWQR → WAITING → FINISHED`

### Pinia stores (`base/stores/`)

- `session` — stores JWT tokens per app name, persisted via cookie
- `me` — fetches and caches the current user persona from `/api/me`
- `institution` — list of institutions, with helpers to look up by ID or app name shortcode
- `portal` — persists `pilotLink` and `institution` for the current pilot session

### Server API structure (`base/server/api/`)

Routes follow Nuxt's file-based API conventions. Key groups:

- `/api/credential-offer` — create credential offers (pre-authorized code flow)
- `/api/credential-offer-acf/[id]` — poll for authorization code flow status
- `/api/nlwallet/` — NL Wallet presentation requests (EDC/EUDI)
- `/api/me/`, `/api/institutions/`, `/api/programs/`, `/api/courses/` — data endpoints

### Internationalization

Default locale is Dutch (`nl`), with English (`en`) as secondary. Locale files live in `{app}/i18n/locales/`. The `@nuxtjs/i18n` strategy is `prefix_except_default` — Dutch routes have no prefix, English routes are prefixed with `/en/`.

### Environment setup

Copy `apps/portal/.env.example` to `apps/portal/.env` and fill in:
- OIDC provider credentials (`NUXT_OIDC_PROVIDERS_OIDC_*`)
- Issuer/verifier tokens (`NUXT_ISSUER_TOKEN`, `NUXT_VERIFIER_TOKEN`, `NUXT_EDUID_ISSUER_TOKEN`)
- External service URLs (`NUXT_PUBLIC_AGENT_BASE_URL`, `NUXT_PUBLIC_API_BASE_URL`, etc.)
- OIDC session secrets (`NUXT_OIDC_SESSION_SECRET`, `NUXT_OIDC_TOKEN_KEY`, `NUXT_OIDC_AUTH_SESSION_SECRET`)

`NUXT_PUBLIC_APP_ENV` controls which pilots are shown: `development`/`playground`, `staging`, or `production`.
