# Repository Guidelines

## Project Structure & Module Organization
- `src/features/*` contains each domain, with their own `components/`, `hooks/`, `services/`, and (if needed) `contexts/` so implementation, side effects, and data-fetching live next to the UI that consumes them.
- Shared primitives (UI, layouts, modals) are under `src/components`, global helpers under `src/utils`, and the axios-backed clients + React Query hooks live inside `src/services/beasybox-api`. Shared state (auth, chat, toast) sits in `src/contexts` and is wired in `src/main.tsx` before requests hit the router.
- Keep routing declarations inside `src/routes`. Each folder mirrors a URL segment; nested folders correspond to nested layouts/routes.

## Build, Test, and Development Commands
- `npm run dev` — starts the Vite dev server (opening `/app/home` for convenience).
- `npm run build` — runs `tsc -b` followed by `vite build` for production artifacts.
- `npm run lint` — runs ESLint across `src` and tooling files.
- `npm run preview` — serves the production build locally for validation.
- `npm run storybook` / `npm run build-storybook` — run or build Storybook (Vitest Storybook plugin is configured inside `vite.config.ts`).

## Routing & Navigation
- `src/routes/__root.tsx` defines the root outlet with the NotFound page, and every additional `createFileRoute` lives inside `src/routes` so the file structure documents URLs. The generated `src/routeTree.gen.ts` comes from the TanStack Router Vite plugin; do not edit it manually—changes happen automatically when files/exports change.
- `src/routes/index.tsx` redirects `/` to `/app/home`, while `src/routes/login/index.tsx` and `src/routes/signup/index.tsx` mount the public auth flows that wrap the modal stacks inside `pages/LoginPage` and `pages/SignupPage`.
- The `/app` section is guarded by `ProtectedRoute` (`src/routes/app/route.tsx`), with `ErrorComponent` and `NotFoundAppRouteComponent` for failures. Its child layout under `src/routes/app/(main)/route.tsx` renders the `AsideBar`, sticky chat layout, and the `HelpButton`, and wraps the entire experience with `ChatProvider`.
- Inside `(main)` there are feature routes for `/home`, `/knowledge`, `/record`, `/search` and `/chat/$chatId`. Route names use `$` for dynamic segments; adding a new view means creating the matching folder structure, exporting a `createFileRoute` from `route.tsx` or `index.tsx`, and placing the actual UI component inside `src/pages` or the relevant feature folder.
- When adding new layouts, prefer the `(name)` convention to describe layout routes and include shared UI (navigation chrome, guards, loaders) there so downstream files only supply `component`.

## Coding Style & Naming Conventions
- Prefer functional React components and explicit `use` hooks. Keep hooks inside the feature that consumes them (e.g., `features/home/hooks/useHomePage.tsx`) and name them after their intent.
- Compose Tailwind + `class-variance-authority` classes via the shared `cn` helper (`src/utils/classname.ts`) to keep class strings readable.
- Use PascalCase for React components/modals and camelCase for helper files, hooks, and utilities.
- Solid React Query naming: `useGetFoo`, `useCreateFoo`, `useDeleteFoo`, etc., with query keys aligned to the resource (`['chats']`, `['files', userId]`). Invalidate or update the same key whenever mutations succeed so cached data stays consistent.
- When possible, keep UI focused on markup and pass behavior via props so modals/components remain reusable across flows.

## Testing Guidelines
- Vitest (configured inside `vite.config.ts:test`) runs unit tests plus Storybook stories via the addon. Run `npx vitest` (or add a `test` script) to exercise that suite.
- Storybook lives under `src/stories`; keep stories within the feature’s folder so they stay in sync with the component.
- Prioritize testing hooks that coordinate APIs or multiple actions, and any modals/dialog flows that orchestrate UX across several components.

## Commit & Pull Request Guidelines
- Follow the existing prefix convention (`feat:`, `fix:`, etc.) and describe what changed; reference the feature/route when possible (`feat(chat): improve pending state`).
- PRs should summarize what changed, include manual verification steps, and mention related tickets or UX notes; add screenshots for visual work, especially when layout or modals shift.
- Run `npm run lint` (and relevant tests) before requesting review, and document any API, config, or schema changes inside the PR description.

## Living Documentation
- Update this `AGENTS.md` whenever you formalize a new pattern (routing layout, auth contract, UX system, React Query cache rule, etc.) so it stays the single source of truth for the refactor. Changes should cite the relevant file/path to make the guidance actionable.

## Component Layer Notes
- The shared primitives and layouts in `src/components` mostly follow the hook+primitive pattern, but not every file is perfect yet—some still mix behavior inside JSX, live outside their consuming feature, or hard-code complex class strings. As we refactor:
  - Pull imperative logic into domain-specific hooks and keep JSX markup declarative.
  - Move a component closer to the feature that consumes it when it no longer feels generic.
  - Standardize styling through `cn`/CVA and keep props focused on intent so components stay easy to reuse.
- Record the issue and fix in this document so the evolving standard is clear to the whole team.

## Hook Layer Notes
- Hooks under `src/hooks` capture cross-cutting behaviors (drag/drop, dropdown positioning, table selection, etc.). They typically:
  - expose a focused API (inputs and returned functions/state) for the consuming component,
  - keep side effects inside `useEffect`/`useLayoutEffect` while exposing stable callbacks via `useCallback`, and
  - rely on shared contexts (toast, auth) when needed instead of passing them through props.
- During the refactor watch for hooks that:
  - feel too tightly coupled to one feature—consider moving them closer to that feature instead of keeping them global,
  - contain non-memoized callbacks that may trigger extra renders, or
  - duplicate logic already provided by another hook (e.g., multiple drag/drop helpers).
- Note any hook-level refactors here so the team sees the evolving expectations for reusable behavior.

## Context Layer Notes
- Global state lives in `src/contexts`: auth/user, chat, and toast providers. Each provider wraps the router tree from `main.tsx`, keeping UI components shallow and letting pages use `useAuth`, `useChatContext`, and `useToast`.
- The `ChatProvider` (`src/contexts/chatContext.tsx`) exposes `chats`, loading states, a `pendingMessage` slot, and a `refetchChatData` helper that currently ignores its `chatId` argument—cleanup and more precise cache invalidation should happen during the refactor.
- The auth context (`src/contexts/user`) bundles `handleLogin/handleLogout`, user data, and `isLoading`. It decodes the token, fetches user/account details in parallel, and stores the active user in localStorage so other providers and routes can rely on it.
- `ToastProvider` keeps the toast stack inside a portal and exposes `showToast`/`removeToast`. Hooks everywhere already rely on `useToast` so the provider needs to stay high in the tree.
- Watch for opportunities to tighten these contexts: keep their APIs minimal, memoize derived values, and ensure any new hook/provider pair follows the same pattern (provider at the root, hook for consumers, logic centralized here). Document notable changes in this section so the shared state story remains transparent.

## Service Layer Notes
- `src/services` should only host reusable infrastructure: the shared axios clients (`service/beasybox-api/api.ts`), socket helpers, or integrations (e.g., `beasybox-n8n/api.ts`). Business logic tied to a single feature should live under that feature’s folder to keep this directory focused on cross-feature concerns.
- Each query/mutation file here (chats, messages, knowledge, meetings, files) must align its query keys to the relevant resource and scope so invalidations work predictably (e.g., keep `['files', userId]` instead of just `['files']`). Also watch for unused parameters or duplicate logic—move it down into `features/*/services` or hooks when only one feature consumes it.
- Shared helpers like `useGetAllChats` call `api.get` and update React Query caches; keep those functions thin and rely on the axios client to enforce auth/refresh behavior, rather than reimplementing fetch logic inside every feature.
- When refactoring, document any service that is migrated into feature-specific folders or replaced with a more focused hook. This keeps the service layer clean and prevents duplicated fetching logic across the app.

## Feature Layer Notes
- Each major feature (`chats`, `home`, `meeting`, `user`, `login`, `signup`, `onboarding`) mirrors the home-grown structure: `components/` with reusable UI building blocks, `hooks/` that orchestrate behavior/data flow, `services/` for feature-scoped queries/mutations, and `contexts/` when needed (e.g., chats track menu state or login maintains its own flow context). Pages import the feature’s hook(s) rather than reconstructing data handling.
- While this structure keeps features organized, some logic still lives outside the owning feature. During the refactor move the feature-specific services/hooks (like chat search helpers, onboarding modal helpers, meeting-related websocket logic, etc.) back into their folders to avoid leaking implementation details into shared directories.
- Watch for duplicated utilities (two different hooks doing similar table selection, for example) and favor reusing the existing shared hook or extracting a new one inside the feature when reuse is actually required.
- As you refine each feature, document the conventions here: mention any hook/service that gets split, moved, deduplicated, or replaced with a cleaner pattern. This ensures the “feature architecture” guidance evolves alongside the codebase.

## Signup Flow Notes
- `SignupPage` relies on `features/signup` so the page stays a thin shell over the modal stack. `SignupModal` renders the form, `TermsModal`, and footer while `useSignupFlow` coordinates the signup + verification steps with toasts and navigation.
- Current pain points to address during the refactor:
  - The Terms checkbox uses `register('terms')` and disables the checkbox unless `termsAccepted` is true, creating a confusing click loop. We should streamline the checkbox interaction (always interactive, simply toggle modal).
  - `useSignupFlow` mixes toast error handling, modal control, verification steps, and login/redirection logic all in one hook; we can split responsibilities (e.g., `useSignupForm` handles validation, `useVerificationCodeFlow` just handles codes, and a new `useSignupSteps` hook orchestrates the UI state transitions).
  - Services talk to `/auth/signup` and `/auth/signup/validate` via `useMutation`, but the resulting promise/success logic needs better typing and consistent error-handling (avoid commits to contexts or toasts in the service; keep them in the hook or UI layer).
  - Add skeleton/placeholder states while signup or verification requests are pending to improve the UX and keep the UI responsive.
- Use this section to capture any structural changes you make to the signup flow (new hooks, degenerate modals, moved services, etc.), ensuring the refinements are documented before we start the full rebuild in `Beasybot-Front-Refactor`.

## Page Layer Notes
- Pages in `src/pages` act as feature shells; they rarely contain raw data fetching or complex state, instead importing hooks from `src/features/*` to handle UX, API calls, and business logic (e.g., `HomePage` uses `useHomePage`, `ChatPage` leans on `useGetMessages` and socket hooks, `KnowledgePage` relies on `useKnowledge`, etc.).
- Keep this separation when adding/refining pages: the page composes layout + feature hooks, while the feature folder owns the actual data/mutation logic. Use lightweight presentational components from `src/features/*/components` for repeated UI elements (cards, lists, modals).
- Watch for opportunities to replace inline JSX with smaller shared components (e.g., message list, empty state, loaders, modals) and to inject skeleton/placeholder states for slow data paths. Document any structural changes here so the team knows which pages still need cleanup or UX improvements.
