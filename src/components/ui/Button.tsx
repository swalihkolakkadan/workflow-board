import { CircleNotchIcon } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all hover:-translate-y-px active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md shadow-primary-500/25",
        secondary:
          "border border-border bg-surface text-text-primary hover:bg-surface-raised active:bg-surface-raised",
        destructive:
          "bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700 shadow-md shadow-danger-600/25",
        ghost: "text-text-primary hover:bg-surface-raised active:bg-surface-raised",
      },
      size: {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-9 px-4 text-sm gap-2",
        lg: "h-10 px-5 text-base gap-2",
        icon: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, disabled, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <CircleNotchIcon size={16} className="animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export type { ButtonProps };
export { Button };
