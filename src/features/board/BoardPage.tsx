import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const { tasks, init, addTask, updateTask, moveTask } = useTaskStore();
  const addToast = useToastStore((s) => s.addToast);
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useFilterParams();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((t) => filters.status.includes(t.status));
    }

    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    result = [...result].sort((a, b) => {
      if (filters.sort === "priority") {
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }
      return (
        new Date(b[filters.sort]).getTime() -
        new Date(a[filters.sort]).getTime()
      );
    });

    return result;
  }, [tasks, filters]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<Status, Task[]> = {
      backlog: [],
      "in-progress": [],
      done: [],
    };
    for (const task of filteredTasks) {
      grouped[task.status].push(task);
    }
    return grouped;
  }, [filteredTasks]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      setActiveTask(task ?? null);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const newStatus = over.id as Status;

      if (STATUSES.some((s) => s.value === newStatus)) {
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.status !== newStatus) {
          moveTask(taskId, newStatus);
          addToast({
            title: `Moved to ${STATUSES.find((s) => s.value === newStatus)?.label}`,
            variant: "success",
          });
        }
      }
    },
    [tasks, moveTask, addToast],
  );

  const openCreate = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback((open: boolean) => {
    if (!open && isDirtyRef.current) {
      const confirmed = window.confirm(
        "You have unsaved changes. Discard them?",
      );
      if (!confirmed) return;
    }
    setModalOpen(open);
    if (!open) {
      setEditingTask(null);
      isDirtyRef.current = false;
    }
  }, []);

  const handleSubmit = useCallback(
    (values: TaskFormValues) => {
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
    },
    [editingTask, updateTask, addTask, addToast],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Workflow Board</h1>
          <Button size="sm" onClick={openCreate}>
            + New Task
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <FilterBar
          filters={filters}
          onFilterChange={setFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500">
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
            <h3 className="text-lg font-medium text-gray-900">
              No matching tasks
            </h3>
            <p className="mt-1 text-sm text-gray-500">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUSES.map(({ value }) => (
              <BoardColumn
                key={value}
                status={value}
                tasks={tasksByStatus[value]}
                onEditTask={openEdit}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} onEdit={() => {}} />}
          </DragOverlay>
        </DndContext>
      </main>

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
