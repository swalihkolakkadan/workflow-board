import { CaretDownIcon } from "@phosphor-icons/react";
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
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
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
              "flex h-9 w-full items-center justify-between rounded-xl border border-border bg-surface px-3 text-sm text-text-primary transition-all",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-placeholder:text-text-muted",
              error &&
                "border-danger-500 focus:ring-danger-500 focus:border-danger-500",
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <CaretDownIcon size={14} weight="bold" className="text-text-muted" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="z-50 overflow-hidden rounded-xl border border-border bg-surface shadow-lg animate-in fade-in-0 zoom-in-95"
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none",
                      "data-highlighted:bg-primary-50 data-highlighted:text-primary-700",
                      "data-disabled:pointer-events-none data-disabled:opacity-50",
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

export type { SelectOption, SelectProps };
export { Select };
