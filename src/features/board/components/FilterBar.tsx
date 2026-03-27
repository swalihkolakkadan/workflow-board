import { Button, Select, TextInput } from "@/components/ui";
import { PRIORITIES, SORT_OPTIONS, STATUSES } from "@/lib/constants";
import type { FilterState, Priority, SortField, Status } from "@/lib/types";

type FilterBarProps = {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
};

export function FilterBar({
  filters,
  onFilterChange,
  onClear,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 mb-6">
      <div className="flex-1 min-w-[200px]">
        <TextInput
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <div className="w-40">
        <Select
          placeholder="Status"
          options={[{ value: "__all__", label: "All Statuses" }, ...STATUSES]}
          value={filters.status.length === 1 ? filters.status[0] : "__all__"}
          onValueChange={(v) => {
            if (v === "__all__") {
              onFilterChange("status", [] as Status[]);
            } else {
              onFilterChange("status", [v as Status]);
            }
          }}
        />
      </div>

      <div className="w-36">
        <Select
          placeholder="Priority"
          options={[
            { value: "__all__", label: "All Priorities" },
            ...PRIORITIES,
          ]}
          value={filters.priority || "__all__"}
          onValueChange={(v) => {
            onFilterChange("priority", (v === "__all__" ? "" : v) as Priority);
          }}
        />
      </div>

      <div className="w-40">
        <Select
          placeholder="Sort by"
          options={SORT_OPTIONS}
          value={filters.sort}
          onValueChange={(v) => onFilterChange("sort", v as SortField)}
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
