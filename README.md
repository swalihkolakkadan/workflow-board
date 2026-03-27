# Workflow Board

A team workflow management app — a simplified Jira/Trello board for viewing, creating, editing, filtering, and drag-and-dropping tasks across status columns. Built with a custom component library.

## Quick Start

@@ -9,36 +9,52 @@ npm install
npm run dev

```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Type-check and build for production
- `npm run test` — Run tests in watch mode
- `npm run test:run` — Run tests once
- `npm run lint` — Lint with ESLint
- `npm run preview` — Preview production build



## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite** for builds and dev server
- **Tailwind CSS v4** + `class-variance-authority` for styling and component variants
- **Zustand** for state management (justification in ARCHITECTURE.md)
- **Radix UI** primitives for Dialog, Select, Toast (unstyled, accessible)
- **@dnd-kit** for accessible drag-and-drop
- **date-fns** for relative time formatting
- **Vitest** + **React Testing Library** for tests

## Project Structure

```

src/
├── components/ui/ # Design system: Button, TextInput, TextArea, Select,
│ # Tag, Card, Modal, Toast
├── features/board/ # Board feature
│ ├── components/ # BoardColumn, TaskCard, TaskForm, FilterBar, EmptyState
│ ├── hooks/ # useFilterParams, useTaskForm
│ └── BoardPage.tsx # Main page orchestrator
├── stores/ # Zustand stores (taskStore, toastStore)
├── hooks/ # Shared hooks (useFormGuard)
├── lib/ # Types, constants, storage, migrations
└── test/ # Test setup and test files

```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design decisions.

## AI Assistance

This project was built with AI pair-programming assistance (Cursor with Claude). All code was reviewed, understood, and adjusted by the author. Specific areas where AI assisted:

- Initial project scaffolding and Tailwind/Vitest configuration
- Component boilerplate (props types, forwardRef patterns)
- Test file structure

Changes made from AI suggestions: adjusted Radix component APIs to match actual library usage, fixed React 19 `useRef` signature change, scoped test selectors to dialog context to avoid ambiguous queries.
```
