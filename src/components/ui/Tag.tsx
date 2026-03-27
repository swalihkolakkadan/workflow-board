import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/30 text-text-primary ring-black/8",
        blue: "bg-primary-500/15 text-primary-700 ring-primary-500/25",
        red: "bg-danger-500/15 text-danger-600 ring-danger-500/25",
        green: "bg-success-500/15 text-success-600 ring-success-500/25",
        yellow: "bg-warning-500/15 text-warning-600 ring-warning-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type TagProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tagVariants> & {
    onRemove?: () => void;
  };

function Tag({ className, variant, children, onRemove, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant }), className)} {...props}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-current"
          aria-label={`Remove ${typeof children === "string" ? children : "tag"}`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 3l6 6M9 3l-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export type { TagProps };
export { Tag };
