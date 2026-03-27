import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
                secondary:
                    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
                destructive: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700',
                ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
            },
            size: {
                sm: 'h-8 px-3 text-sm gap-1.5',
                md: 'h-9 px-4 text-sm gap-2',
                lg: 'h-10 px-5 text-base gap-2',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        loading?: boolean
    }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
export type { ButtonProps }