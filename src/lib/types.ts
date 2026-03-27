
export type Status = 'backlog' | 'in-progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'
export type SortField = 'createdAt' | 'updatedAt' | 'priority'

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  assignee: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type TaskFormValues = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>

export interface FilterState {
  search: string
  status: Status[]
  priority: Priority | ''
  sort: SortField
}