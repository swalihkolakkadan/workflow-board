import { ToastProvider } from '@/components/ui'
import { useToastStore } from '@/stores/toastStore'
import { BoardPage } from '@/features/board/BoardPage'

function App() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <ToastProvider toasts={toasts} onClose={removeToast}>
      <BoardPage />
    </ToastProvider>
  )
}

export default App