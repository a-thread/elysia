# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Elysia is a recipe-management SPA — React 18 + TypeScript + Vite 6, styled with Tailwind CSS 4, backed directly by Supabase (Postgres + Auth + Storage) with no custom backend server in this repo. It's a client-only app deployed as a static site to GitHub Pages (hence `HashRouter` and `base: '/elysia/'` in `vite.config.ts`). It's a PWA (vite-plugin-pwa/Workbox) with runtime caching for Supabase storage images and REST reads, so recent data renders offline.

## Commands

- `npm run dev` — start dev server (fixed port 3000, opens browser)
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — preview the production build locally
- `npm run deploy` — build and publish `dist/` to GitHub Pages via `gh-pages`

- `npm run test` — run the Vitest suite once
- `npm run test:watch` — run Vitest in watch mode

Tests use Vitest + React Testing Library (`vitest.config.ts`, setup in `src/test/setup.ts`). Spec convention: cover default/loading, success, error, and an empty/edge case. Specs live next to the file they test (`Foo.ts` / `Foo.test.ts`).

Node version is pinned via `.node-version` (`^24.18.1`).

## Environment variables

Required in `.env` (gitignored, not checked in — no `.env.example` exists either):

- `VITE_API_URL`, `VITE_API_KEY` — Supabase project URL and publishable/anon key. `src/shared/services/SupabaseWithAbort.ts` throws at startup if either is missing.
- `VITE_RECIPE_SCRAPER_API` — URL of an external .NET recipe-scraping microservice (hosted on Render) used for URL-based recipe import.
- `VITE_DEPLOY_URL` — injected only in CI (`.github/workflows/deploy.yml`), used for auth redirect URLs.

## Architecture

Single-package SPA under `src/`, organized **by feature**, not by type. `@shared/*` is aliased to `src/shared/*` (see `tsconfig.app.json` and `vite.config.ts`).

- `src/auth/` — Supabase auth pages (sign in, forgot/reset password)
- `src/home/`, `src/About.tsx` — marketing/landing pages
- `src/recipes/` — `list/`, `detail/`, `form/` (create/edit), `import-review/` (post-bulk-import review wizard)
- `src/collections/` — `list/`, `detail/`, `form/` — collection CRUD, public/private visibility, sharing
- `src/shared/`
  - `components/` — shared UI: modal system (`BaseModal`, `ModalManager`, `AddRecipeModal`, `ShareModal`), `Fab`/`AddRecipeFab`, `NavBar`, `PhotoUpload` (+ its `PhotoService`), `Toast`
  - `contexts/` — `AuthContext`, `DarkModeContext`
  - `hooks/` — cross-feature hooks, e.g. `useShareableEntity` (share/revoke/toggle-public/copy-link, used by both the recipe and collection ellipsis menus)
  - `models/` — `Collection`, `Recipe`, `Tag`, etc.
  - `services/` — `CollectionService`, `RecipeService`, `TagService`, `UserService`, `PdfGenerator`, `SupabaseWithAbort`, `TableNames`
  - `utils/` — `ProtectedRoute`, form-field helpers

**Data layer**: no REST/GraphQL/tRPC routes of our own — service modules in `src/shared/services/` call Supabase's PostgREST client directly. `CollectionService.getDetail` is a representative example of the more complex queries: it joins `collection_to_recipes`, `collection_to_tags`, `recipe_to_tags`, and `collection_to_users`, manually merges/dedupes recipes reached both directly and via shared tags, and computes a `can_edit` flag from `user_id` match or an `edit` permission row.

**Request cancellation pattern**: `src/shared/services/SupabaseWithAbort.ts` wraps the Supabase client so in-flight requests are keyed by a `requestKey` string; issuing a new request with the same key aborts the previous one. Reuse this pattern rather than introducing a different cancellation approach when adding new data-fetching code.

**Layering convention** (Service → data hook → composed page hook → components): service modules (`*Service.ts`) do HTTP/Supabase calls only, no state. A data hook per entity (e.g. `useRecipeDetails`, `useCollectionDetails`) owns fetching + loading state. Each page calls exactly one composed hook (e.g. `useRecipeDetailPage`, `useCollectionDetailPage`) that combines the data hook with any shared orchestration hooks (e.g. `useShareableEntity`) and the page's own intents (edit/delete/etc.), returning everything the page needs. Child components (e.g. the ellipsis menus) receive state and callbacks via props rather than fetching their own data. This pattern is established in `recipes/detail` and `collections/detail`; apply it the same way when refactoring other features.

**Auth**: `AuthContext` (`src/shared/contexts/AuthContext.tsx`) wraps Supabase's `auth.onAuthStateChange` (through the abort-wrapped client) and exposes `user` / `isAuthenticated` / `authHasBeenChecked`. `ProtectedRoute` (`src/shared/utils/ProtectedRoute.tsx`) gates authenticated routes (add/edit recipe, import-review, collection edit, etc.).

**State management**: no Redux/Zustand/React Query — plain React Context for cross-cutting state (auth, dark mode, modals, toasts) plus per-feature custom hooks (e.g. `useCollectionForm`, `useImportReviewForm`, `useFetchCollections`) that call the `*Service` modules directly.

**Recipe import**: `AddRecipeModal` (`src/shared/components/Modals/AddRecipeModal/index.tsx`) offers three ways to add recipes — URL scrape, photo(s), or a "Cookbook PDF" bulk import — defaulting to the URL tab. Bulk PDF/photo imports route through `RecipeScraperService.ts` (HTTP calls to the external scraper API) and `recipeHtmlParser.ts` (pasted-HTML parsing via cheerio, independently testable), then navigate to `/import-review` (`src/recipes/import-review/`), a wizard that lets the user edit/save-and-advance or discard each extracted recipe before it's persisted.

**Mobile FAB**: `src/shared/components/Fab.tsx` (visible only below `sm` breakpoint) and `AddRecipeFab.tsx` (wraps it to open `AddRecipeModal`) are used on `home`, `recipes/list`, and `collections/list` as the mobile equivalent of a desktop "add" button.

## Linting

ESLint flat config (`eslint.config.js`, ESLint 9 + typescript-eslint 8): `js.recommended` + `tseslint.recommended`/`stylistic` + React (flat recommended) + `react-hooks` + `react-refresh`. Notable deviations from defaults: `@typescript-eslint/no-unused-vars` is `warn` (ignores `^_`-prefixed args), `@typescript-eslint/explicit-function-return-type` is off. No Prettier is configured — don't assume Prettier formatting rules apply.

Tailwind CSS 4 is configured via `@tailwindcss/vite` (CSS-first config, no `tailwind.config.js`).

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`: `npm ci` → `npm run build` (with the four `VITE_*` secrets injected) → publish `dist/` to GitHub Pages via `peaceiris/actions-gh-pages`. Manual deploy is also available via `npm run deploy`.

## Committing

Don't commit with any Claude signature
