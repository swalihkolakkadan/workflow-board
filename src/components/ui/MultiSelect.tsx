import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { forwardRef, useEffect, useId, useRef, useState } from "react";
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
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
      if (!open) return;
      function handleClickOutside(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

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
      <div className="flex flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            id={id}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={handleKeyDown}
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
              className={cn("text-text-muted transition-transform", open && "rotate-180")}
            />
          </button>

          {open && (
            <ul
              role="listbox"
              aria-multiselectable="true"
              aria-label={label ?? placeholder}
              onKeyDown={handleKeyDown}
              className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg animate-in fade-in-0 zoom-in-95"
            >
              <div className="p-1">
                {options.map((option) => {
                  const checked = value.includes(option.value);
                  const checkboxId = `${id}-${option.value}`;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={checked}
                      className={cn(
                        "flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-primary",
                        "hover:bg-primary-50 hover:text-primary-700",
                      )}
                      onClick={() => toggleOption(option.value)}
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
                        {checked && <CheckIcon size={10} weight="bold" className="text-white" />}
                      </span>
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOption(option.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="sr-only"
                        aria-label={option.label}
                      />
                      <label
                        htmlFor={checkboxId}
                        className="cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        {option.label}
                      </label>
                    </li>
                  );
                })}
              </div>
            </ul>
          )}
        </div>
      </div>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export type { MultiSelectOption, MultiSelectProps };
export { MultiSelect };
