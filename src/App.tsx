import { ToastProvider } from "@/components/ui";
import { BoardPage } from "@/features/board/BoardPage";
import { UIReferencePage } from "@/features/ui-reference/UIReferencePage";
import { useToastStore } from "@/stores/toastStore";

const isUIRoute = window.location.pathname === "/ui";

function App() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <ToastProvider toasts={toasts} onClose={removeToast}>
      {isUIRoute ? <UIReferencePage /> : <BoardPage />}
    </ToastProvider>
  );
}

export default App;
