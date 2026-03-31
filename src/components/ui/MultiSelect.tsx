import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as Popover from "@radix-ui/react-popover";
import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
};

const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      label,
      placeholder = "Select...",
      options,
      value,
      onValueChange,
      disabled,
      className,
    },
    ref,
  ) => {
    const id = useId();

    function toggleOption(optionValue: string) {
      if (value.includes(optionValue)) {
        onValueChange(value.filter((v) => v !== optionValue));
      } else {
        onValueChange([...value, optionValue]);
      }
    }

    const triggerLabel =
      value.length === 0
        ? placeholder
        : value.length === 1
          ? options.find((o) => o.value === value[0])?.label ?? placeholder
          : `${value.length} selected`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              ref={ref}
              id={id}
              type="button"
              disabled={disabled}
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-xl border border-border bg-surface px-3 text-sm transition-all",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                "disabled:cursor-not-allowed disabled:opacity-50",
                value.length > 0 ? "text-text-primary" : "text-text-muted",
                className,
              )}
            >
              <span className="truncate">{triggerLabel}</span>
              <CaretDownIcon
                size={14}
                weight="bold"
                className="text-text-muted"
              />
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              sideOffset={4}
              align="start"
              className={cn(
                "z-50 w-(--radix-popover-trigger-width) overflow-hidden rounded-xl border border-border bg-surface shadow-lg",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              )}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="p-1" role="listbox" aria-multiselectable="true" aria-label={label ?? placeholder}>
                {options.map((option) => {
                  const checked = value.includes(option.value);
                  const optionId = `${id}-${option.value}`;
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={checked}
                      tabIndex={0}
                      className={cn(
                        "flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none",
                        "hover:bg-primary-50 hover:text-primary-700",
                        "focus-visible:bg-primary-50 focus-visible:text-primary-700",
                      )}
                      onClick={() => toggleOption(option.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleOption(option.value);
                        }
                      }}
                    >
                      <span
                        className={cn(
                          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                          checked
                            ? "border-primary-600 bg-primary-600"
                            : "border-text-muted bg-surface",
                        )}
                        aria-hidden="true"
                      >
                        {checked && (
                          <CheckIcon
                            size={10}
                            weight="bold"
                            className="text-white"
                          />
                        )}
                      </span>
                      <input
                        id={optionId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(option.value)}
                        className="sr-only"
                        tabIndex={-1}
                      />
                      <span>{option.label}</span>
                    </div>
                  );
                })}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export type { MultiSelectOption, MultiSelectProps };
export { MultiSelect };
