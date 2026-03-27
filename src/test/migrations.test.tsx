
import { describe, it, expect } from 'vitest'
import { migrateData, type StoredData } from '@/lib/migrations'

describe('migrations', () => {
    it('migrates v1 data to v2 by adding tags and updatedAt', () => {
        const v1Data: StoredData = {
            schemaVersion: 1,
            tasks: [
                {
                    id: '1',
                    title: 'Old task',
                    description: 'No tags field',
                    status: 'backlog',
                    priority: 'high',
                    assignee: 'Alice',
                    createdAt: '2025-01-01T00:00:00.000Z',
                },
            ],
        }

        const { data, migrated } = migrateData(v1Data)

        expect(migrated).toBe(true)
        expect(data.schemaVersion).toBe(2)
        expect(data.tasks[0]).toMatchObject({
            id: '1',
            title: 'Old task',
            tags: [],
            updatedAt: '2025-01-01T00:00:00.000Z',
        })
    })

    it('returns unmigrated for current schema version', () => {
        const currentData: StoredData = {
            schemaVersion: 2,
            tasks: [{ id: '1', title: 'Current', tags: ['bug'] }],
        }

        const { data, migrated } = migrateData(currentData)

        expect(migrated).toBe(false)
        expect(data).toEqual(currentData)
    })
})