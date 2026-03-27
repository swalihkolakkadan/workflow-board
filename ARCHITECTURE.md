# Architecture & Design Notes

## Component Hierarchy

```
App
├── ToastProvider (wraps entire app, renders toast viewport)
└── BoardPage
    ├── Header (title + "New Task" button)
    ├── FilterBar
    │   ├── TextInput (search)
    │   ├── Select (status filter)
    │   ├── Select (priority filter)
    │   └── Select (sort order)
    ├── DndContext
    │   ├── BoardColumn (Backlog)
    │   │   └── TaskCard[] (sortable, draggable)
    │   ├── BoardColumn (In Progress)
    │   │   └── TaskCard[]
    │   └── BoardColumn (Done)
    │       └── TaskCard[]
    ├── EmptyState (conditional: no tasks / no results)
    └── Modal (create/edit)
        └── TaskForm
```

## Key Design Decisions

### State Management: Zustand

Chose Zustand over React Context + useReducer because:

1. **Fine-grained subscriptions** — each `BoardColumn` can subscribe to only its tasks via selectors, preventing full-board re-renders when a single task changes.
2. **Built-in persistence** — while we wrote a custom storage layer for migration support, Zustand's lightweight API made the store trivial to implement.
3. **Cross-component access** — the toast store is accessed from both the task store (migration notifications) and UI components, which is awkward with Context.
4. **Bundle size** — ~1KB gzipped. Negligible overhead for significant DX improvement.

### Radix UI Primitives

Used `@radix-ui/react-dialog`, `@radix-ui/react-select`, and `@radix-ui/react-toast` for the three components where accessibility is hardest to get right from scratch: focus trapping, keyboard navigation, and ARIA live regions. All visual design is our own via Tailwind. Button, TextInput, TextArea, Tag, and Card are built entirely from scratch.

### Component Library (src/components/ui/)

Each component follows a consistent pattern:

- Extends native HTML element props (no props explosion)
- `forwardRef` for ref forwarding where appropriate
- `cva` (class-variance-authority) for declarative variant definitions
- `cn()` utility (clsx + tailwind-merge) for safe class merging

The Card component uses a compound component pattern (`Card.Header`, `Card.Body`, `Card.Footer`) for flexible composition without prop drilling.

### Storage & Schema Migrations

Tasks are stored in localStorage under key `workflow-board` with a versioned schema:

```json
{ "schemaVersion": 2, "tasks": [...] }
```

On app load, the storage layer checks `schemaVersion` and runs a migration pipeline — an ordered record of pure functions that transform data from one version to the next. This is extensible: adding a v3 migration is just adding another entry.

Migration from v1 → v2 adds `tags: []` and `updatedAt` (defaulting to `createdAt`) to each task.

If a migration runs, a toast notification informs the user.

### Filters in URL (not in Zustand)

Filter/sort state lives in the URL query string (`?search=bug&priority=high&sort=updatedAt`), not in the store. This makes filtered views shareable and restorable on refresh. A custom `useFilterParams` hook handles parsing and serialization with debounced URL updates (300ms for search input).

### Drag & Drop

@dnd-kit was chosen over react-beautiful-dnd because:

- Built-in keyboard support (Space to pick up, Arrow keys to move)
- Modern, maintained, and smaller bundle
- Accessible by default with ARIA announcements

Each column is a droppable target, each card is sortable. On drag end, the task's status is updated via `moveTask()`.

## Known Limitations & Trade-offs

- **Single status filter**: The status filter currently selects one status at a time (or all). True multi-select would require a custom multi-select component or a checkbox-based dropdown.
- **No task deletion UI**: `deleteTask` exists in the store but there's no UI button for it yet. Would add a destructive action in the edit modal.
- **No optimistic drag preview**: The drag overlay shows the card but doesn't show the "hole" where it would land. Could improve with @dnd-kit's sortable animations.
- **No persistence of column order**: Tasks within a column are sorted by the active sort, not by manual drag order within a column.
