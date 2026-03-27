import { create } from 'zustand'
import type { ToastData, ToastVariant } from '@/components/ui/Toast'

interface ToastInput {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastState {
  toasts: ToastData[]
  addToast: (input: ToastInput) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  addToast: (input) => {
    const toast: ToastData = {
      ...input,
      id: crypto.randomUUID(),
    }
    set((state) => ({ toasts: [...state.toasts, toast] }))
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))