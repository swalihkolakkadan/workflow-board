import * as SelectPrimitive from "@radix-ui/react-select";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
};

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      error,
      placeholder = "Select...",
      options,
      value,
      defaultValue,
      onValueChange,
      disabled,
      className,
      id: idProp,
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            id={id}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-[placeholder]:text-gray-400",
              error &&
                "border-danger-500 focus:ring-danger-500 focus:border-danger-500",
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <ChevronDownIcon />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95"
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded px-3 py-1.5 text-sm text-gray-900 outline-none",
                      "data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700",
                      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && (
          <p id={errorId} className="text-sm text-danger-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="text-gray-500"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type { SelectOption, SelectProps };
export { Select };
