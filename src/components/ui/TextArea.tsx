import {
  forwardRef,
  type TextareaHTMLAttributes,
  useCallback,
  useId,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  autoGrow?: boolean;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      error,
      autoGrow = false,
      id: idProp,
      onChange,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = `${id}-error`;
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoGrow && internalRef.current) {
          internalRef.current.style.height = "auto";
          internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
        }
        onChange?.(e);
      },
      [autoGrow, onChange],
    );

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          ref={setRefs}
          id={id}
          className={cn(
            "min-h-[80px] rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all resize-vertical",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            autoGrow && "resize-none overflow-hidden",
            error &&
              "border-danger-500 focus:ring-danger-500 focus:border-danger-500",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-danger-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export type { TextAreaProps };
export { TextArea };
