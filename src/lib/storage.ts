
import { STORAGE_KEY, CURRENT_SCHEMA_VERSION } from './constants'
import { migrateData, type StoredData } from './migrations'
import type { Task } from './types'

export function loadTasks(): { tasks: Task[]; migrated: boolean; error?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { tasks: [], migrated: false }
    }

    const parsed: StoredData = JSON.parse(raw)
    const { data, migrated } = migrateData(parsed)

    if (migrated) {
      saveTasks(data.tasks as Task[])
    }

    return { tasks: data.tasks as Task[], migrated }
  } catch (e) {
    console.error('Failed to load tasks from storage:', e)
    return { tasks: [], migrated: false, error: 'Failed to load data from storage' }
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    const data: StoredData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save tasks to storage:', e)
  }
}

export function isStorageAvailable(): boolean {
  try {
    const key = '__storage_test__'
    localStorage.setItem(key, 'test')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}