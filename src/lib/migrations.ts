import { CURRENT_SCHEMA_VERSION } from './constants'

export interface StoredData {
  schemaVersion: number
  tasks: unknown[]
}

type Migration = (data: StoredData) => StoredData

const migrations: Record<number, Migration> = {
  1: (data) => ({
    schemaVersion: 2,
    tasks: data.tasks.map((t: any) => ({
      ...t,
      tags: t.tags ?? [],
      updatedAt: t.updatedAt ?? t.createdAt ?? new Date().toISOString(),
    })),
  }),
}

export function migrateData(data: StoredData): { data: StoredData; migrated: boolean } {
  let current = data
  let migrated = false

  while (current.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const migrateFn = migrations[current.schemaVersion]
    if (!migrateFn) {
      console.warn(`No migration found for schema version ${current.schemaVersion}`)
      break
    }
    current = migrateFn(current)
    migrated = true
  }

  return { data: current, migrated }
}