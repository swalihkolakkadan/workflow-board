import { XIcon } from "@phosphor-icons/react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "pointer-events-auto flex w-full items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl transition-all data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-text-primary",
        success: "border-success-500/30 bg-success-50 text-success-600",
        error: "border-danger-500/30 bg-danger-50 text-danger-600",
        info: "border-primary-500/30 bg-primary-50 text-primary-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>["variant"]>;

type ToastData = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastProps = ToastData & {
  onClose: (id: string) => void;
};

function Toast({
  id,
  title,
  description,
  variant = "default",
  duration = 4000,
  onClose,
}: ToastProps) {
  return (
    <ToastPrimitive.Root
      className={cn(toastVariants({ variant }))}
      duration={duration}
      onOpenChange={(open) => {
        if (!open) onClose(id);
      }}
    >
      <div className="flex-1">
        <ToastPrimitive.Title className="text-sm font-medium">
          {title}
        </ToastPrimitive.Title>
        {description && (
          <ToastPrimitive.Description className="mt-1 text-xs opacity-80">
            {description}
          </ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close
        className="rounded p-1 opacity-50 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-current"
        aria-label="Dismiss"
      >
        <XIcon size={14} weight="bold" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

type ToastProviderProps = {
  children: ReactNode;
  toasts: ToastData[];
  onClose: (id: string) => void;
};

function ToastProvider({ children, toasts, onClose }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-[360px] max-w-[100vw] flex-col gap-2 p-4" />
    </ToastPrimitive.Provider>
  );
}

export type { ToastData, ToastVariant };
export { Toast, ToastProvider };
