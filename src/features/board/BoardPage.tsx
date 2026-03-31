import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "@/components/ui";
import { PRIORITY_WEIGHT, STATUSES } from "@/lib/constants";
import { isStorageAvailable } from "@/lib/storage";
import type { Status, Task, TaskFormValues } from "@/lib/types";
import { useTaskStore } from "@/stores/taskStore";
import { useToastStore } from "@/stores/toastStore";
import { BoardColumn } from "./components/BoardColumn";
import { FilterBar } from "./components/FilterBar";
import { TaskCard } from "./components/TaskCard";
import { TaskForm } from "./components/TaskForm";
import { useFilterParams } from "./hooks/useFilterParams";
import { useFormGuard } from "./hooks/useFormGuard";

export function BoardPage() {
  const { tasks, init, addTask, updateTask, deleteTask, moveTask } = useTaskStore();
  const addToast = useToastStore((s) => s.addToast);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useFilterParams();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [discardOpen, setDiscardOpen] = useState(false);
  const isDirtyRef = useRef(false);
  const [isDirtyState, setIsDirtyState] = useState(false);

  useFormGuard(isDirtyState);

  useEffect(() => {
    init();
    if (!isStorageAvailable()) {
      addToast({
        title: "Storage unavailable",
        description:
          "Your browser storage is not available. Tasks will not be saved.",
        variant: "error",
        duration: 8000,
      });
    }
  }, [init, addToast]);

  let filteredTasks = tasks;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }

  if (filters.status.length > 0) {
    filteredTasks = filteredTasks.filter((t) => filters.status.includes(t.status));
  }

  if (filters.priority) {
    filteredTasks = filteredTasks.filter((t) => t.priority === filters.priority);
  }

  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (filters.sort === "priority") {
      return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    }
    return (
      new Date(b[filters.sort]).getTime() -
      new Date(a[filters.sort]).getTime()
    );
  });

  const tasksByStatus: Record<Status, Task[]> = {
    backlog: [],
    "in-progress": [],
    done: [],
  };
  for (const task of filteredTasks) {
    if (tasksByStatus[task.status]) {
      tasksByStatus[task.status].push(task);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // over.id is either a column status or a card UUID — resolve to a status
    const newStatus: Status | undefined = STATUSES.some((s) => s.value === overId)
      ? (overId as Status)
      : tasks.find((t) => t.id === overId)?.status;

    if (newStatus) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== newStatus) {
        moveTask(taskId, newStatus);
        addToast({
          title: `Moved to ${STATUSES.find((s) => s.value === newStatus)?.label}`,
          variant: "success",
        });
      }
    }
  }

  function openCreate() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleDelete(task: Task) {
    setTaskToDelete(task);
  }

  function handleConfirmDelete() {
    if (!taskToDelete) return;
    deleteTask(taskToDelete.id);
    addToast({ title: "Task deleted", variant: "default" });
    setTaskToDelete(null);
  }

  function handleModalClose(open: boolean) {
    if (!open && isDirtyRef.current) {
      setDiscardOpen(true);
      return;
    }
    setModalOpen(open);
    if (!open) {
      setEditingTask(null);
      isDirtyRef.current = false;
    }
  }

  function handleDiscardConfirm() {
    setDiscardOpen(false);
    setModalOpen(false);
    setEditingTask(null);
    isDirtyRef.current = false;
    setIsDirtyState(false);
  }

  function handleSubmit(values: TaskFormValues) {
    if (editingTask) {
      updateTask(editingTask.id, values);
      addToast({ title: "Task updated", variant: "success" });
    } else {
      addTask(values);
      addToast({ title: "Task created", variant: "success" });
    }
    setModalOpen(false);
    setEditingTask(null);
    isDirtyRef.current = false;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-surface-glass backdrop-blur-xl shadow-sm shadow-black/4">
        <div className="max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 xl:px-10 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">Workflow Board</h1>
          <Button size="sm" onClick={openCreate}>
            + New Task
          </Button>
        </div>
      </header>

      <main className="max-w-7xl xl:max-w-none mx-auto px-4 sm:px-6 xl:px-10 py-6 md:pb-4 w-full flex-1 flex flex-col min-h-0">
        <FilterBar
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-medium text-text-primary">No tasks yet</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Create your first task to get started.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={openCreate}
            >
              Create Task
            </Button>
          </div>
        )}

        {filteredTasks.length === 0 && tasks.length > 0 && hasActiveFilters && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-medium text-text-primary">
              No matching tasks
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Try adjusting your filters or search query.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}

        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:flex-1 md:min-h-0">
            {STATUSES.map(({ value }) => (
              <BoardColumn
                key={value}
                status={value}
                tasks={tasksByStatus[value]}
                onEditTask={openEdit}
                onDeleteTask={handleDelete}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} onEdit={() => { }} onDelete={() => { }} />}
          </DragOverlay>
        </DndContext>
      </main>

      <Modal open={discardOpen} onOpenChange={(open) => { if (!open) setDiscardOpen(false); }} className="max-w-sm">
        <Modal.Header>
          <Modal.Title>Discard changes?</Modal.Title>
          <Modal.Description>
            You have unsaved changes. They will be lost if you close this form.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDiscardOpen(false)}>
            Keep editing
          </Button>
          <Button variant="destructive" onClick={handleDiscardConfirm}>
            Discard
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={!!taskToDelete} onOpenChange={(open) => { if (!open) setTaskToDelete(null); }} className="max-w-sm">
        <Modal.Header>
          <Modal.Title>Delete Task?</Modal.Title>
          <Modal.Description>
            "{taskToDelete?.title}" will be permanently deleted.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Modal.Close>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={modalOpen} onOpenChange={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{editingTask ? "Edit Task" : "Create Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm
            key={editingTask?.id ?? "new"}
            initialValues={
              editingTask
                ? {
                  title: editingTask.title,
                  description: editingTask.description,
                  status: editingTask.status,
                  priority: editingTask.priority,
                  assignee: editingTask.assignee,
                  tags: editingTask.tags,
                }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => handleModalClose(false)}
            onDirtyChange={(dirty) => {
              isDirtyRef.current = dirty;
              setIsDirtyState(dirty);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
