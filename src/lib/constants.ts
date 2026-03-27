import type { Status, Priority, SortField, FilterState } from './types'

export const STATUSES: { value: Status; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'priority', label: 'Priority' },
]

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  status: [],
  priority: '',
  sort: 'updatedAt',
}

export const STORAGE_KEY = 'workflow-board'
export const CURRENT_SCHEMA_VERSION = 2