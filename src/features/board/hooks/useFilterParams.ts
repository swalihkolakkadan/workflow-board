import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_FILTERS } from "@/lib/constants";
import type { FilterState, Priority, SortField, Status } from "@/lib/types";

function parseFromURL(): FilterState {
  const params = new URLSearchParams(window.location.search);

  const statusRaw = params.get("status");
  const status = statusRaw
    ? (statusRaw.split(",").filter(Boolean) as Status[])
    : [];

  return {
    search: params.get("search") ?? "",
    status,
    priority: (params.get("priority") as Priority) ?? "",
    sort: (params.get("sort") as SortField) ?? "updatedAt",
  };
}

function writeToURL(filters: FilterState) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status.length > 0) params.set("status", filters.status.join(","));
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.sort !== "updatedAt") params.set("sort", filters.sort);

  const qs = params.toString();
  const url = qs
    ? `${window.location.pathname}?${qs}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
}

export function useFilterParams() {
  const [filters, setFilters] = useState<FilterState>(() => parseFromURL());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeToURL(filters);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [filters]);

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status.length > 0 ||
    filters.priority !== "";

  return { filters, setFilter, clearFilters, hasActiveFilters };
}
