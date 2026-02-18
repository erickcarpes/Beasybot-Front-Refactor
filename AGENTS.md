# Repository Guidelines & Best Practices

This document serves as the single source of truth for architectural decisions, coding standards, and patterns used in the **Beasybot Front Refactor** project. All agents and developers should follow these guidelines to maintain consistency and quality.

---

## 🏗️ Project Structure & Module Organization

We follow a **Feature-First Architecture**. Code related to a specific domain should live together, rather than being split by type (components/hooks/services).

### Directory Layout

- **`src/features/*`**: The core of the application. Each folder here represents a domain (e.g., `chat`, `files`, `auth`).
  - `components/`: UI components specific to this feature.
  - `hooks/`: Business logic and state management custom hooks.
  - `services/`: API calls, mutations, and query options specific to this feature.
  - `contexts/`: (Optional) Context providers scoped to this feature.
- **`src/components/*`**: Shared, generic UI primitives (Buttons, Inputs, Modals) that are feature-agnostic.
- **`src/services/*`**: Global API clients (Axios instances), Socket configuration, and shared types.
- **`src/contexts/*`**: Global state providers (Auth, Toast, Theme).
- **`src/routes/*`**: Route definitions using TanStack Router.

---

## 💻 Tech Stack & Coding Patterns

### 1. UI & Styling

- **TailwindCSS v4**: We use utility classes for styling.
- **`cn` Helper**: ALWAYS use the `cn` utility (`clsx` + `tailwind-merge`) when applying classes, especially for conditional styling or merging props.
  ```tsx
  <div className={cn('flex flex-col', className)} />
  ```
- **CVA (Class Variance Authority)**: Use `cva` for creating component variants (e.g., Buttons, Badges) to manage complex state-based styling declaratively.
- **Icons**: Use `lucide-react` for all icons.

### 2. React Components

- **Functional Components**: Use `export default function ComponentName() {}`.
- **Props**: Use `interface` for prop definitions and `readonly<Props>` to enforce immutability.
- **Composition**: Prefer passing content via `children` rather than complex config objects for flexible layouts.
- **Naming**: PascalCase for components (`ChatInput.tsx`), camelCase for hooks/utils (`useChat.ts`).

### 3. State Management & Data Fetching

- **TanStack Query (React Query)**: The standard for server state.
  - **Keys**: Use array-based keys aligned with resources (e.g., `['chats', chatId]`, `['files', userId]`).
  - **Mutations**: Always invalidate relevant queries in `onSuccess` to keep UI in sync.
- **Context API**: Use sparingly for truly global state (Auth, Toast). Avoid using Context for complex state management that could be handled by React Query or local state.
- **Local State**: Use `useState` for UI-only state (modals open/close, inputs).

### 4. API & Networking

- **Axios Instance**: Use the configured instances in `src/services/beasybox-api/api.ts`.
  - `api`: Includes interceptors for auto-attaching headers and handling token refresh.
  - `apiAuth`: A lighter instance specifically for auth endpoints to avoid loops.
- **Socket.IO**: Use the `socketService` singleton for websocket connections. Manage event listeners inside `useEffect` in hooks, ensuring cleanup on unmount.

---

## 🛠️ Development Workflow

### Build & Run

- `npm run dev`: Start development server.
- `npm run build`: Type-check (`tsc`) and build for production.
- `npm run lint`: Run ESLint to ensure code quality.

### Code Quality

- **Strict TypeScript**: No `any`. Define proper interfaces for all data structures, especially API responses.
- **Linter**: Fix all lint warnings before committing. The CI/CD pipeline enforces this.
- **Unused Code**: Delete unused variables, imports (especially icons), and files. Keep the codebase lean.

---

## 🧪 Testing Strategy

- **Unit/Integration**: Use Vitest for logic and hook testing.
- **Storybook**: Use it to document and test UI components in isolation (`src/stories`).

---

## 📝 Documentation

- **Update this file**: If you introduce a new pattern or architectural decision, document it here immediately.
- **README.md**: Keep the main project README high-level (setup, features). This file is for internal developer guidelines.
