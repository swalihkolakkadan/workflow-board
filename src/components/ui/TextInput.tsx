import { forwardRef, type InputHTMLAttributes, useId } from 'react'
import { cn } from '@/lib/utils'

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    label?: string
    error?: string
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ className, label, error, id: idProp, ...props }, ref) => {
        const autoId = useId()
        const id = idProp ?? autoId
        const errorId = `${id}-error`

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-danger-500 focus:ring-danger-500 focus:border-danger-500',
                        className
                    )}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    {...props}
                />
                {error && (
                    <p id={errorId} className="text-sm text-danger-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

TextInput.displayName = 'TextInput'

export { TextInput }
export type { TextInputProps }