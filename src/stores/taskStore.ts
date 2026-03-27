import { create } from "zustand";
import { loadTasks, saveTasks } from "@/lib/storage";
import type { Status, Task, TaskFormValues } from "@/lib/types";
import { useToastStore } from "./toastStore";

interface TaskState {
  tasks: Task[];
  storageError: string | undefined;
  initialized: boolean;
  init: () => void;
  addTask: (values: TaskFormValues) => Task;
  updateTask: (id: string, values: Partial<TaskFormValues>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  storageError: undefined,
  initialized: false,

  init: () => {
    if (get().initialized) return;
    const { tasks, migrated, error } = loadTasks();
    set({ tasks, storageError: error, initialized: true });

    if (migrated) {
      useToastStore.getState().addToast({
        title: "Data migrated",
        description: "Your stored data was updated to the latest format.",
        variant: "info",
      });
    }

    if (error) {
      useToastStore.getState().addToast({
        title: "Storage error",
        description: error,
        variant: "error",
      });
    }
  },

  addTask: (values) => {
    const now = new Date().toISOString();
    const task: Task = {
      ...values,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => {
      const tasks = [...state.tasks, task];
      saveTasks(tasks);
      return { tasks };
    });
    return task;
  },

  updateTask: (id, values) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id
          ? { ...t, ...values, updatedAt: new Date().toISOString() }
          : t,
      );
      saveTasks(tasks);
      return { tasks };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id);
      saveTasks(tasks);
      return { tasks };
    });
  },

  moveTask: (id, status) => {
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t,
      );
      saveTasks(tasks);
      return { tasks };
    });
  },
}));
