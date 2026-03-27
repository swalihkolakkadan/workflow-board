import { CURRENT_SCHEMA_VERSION } from "./constants";

export interface StoredData {
  schemaVersion: number;
  tasks: unknown[];
}

type Migration = (data: StoredData) => StoredData;

/** Shape of tasks persisted at schema v1 (before tags / updatedAt were guaranteed). */
type LegacyTaskV1 = Record<string, unknown> & {
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
};

const migrations: Record<number, Migration> = {
  1: (data) => ({
    schemaVersion: 2,
    tasks: data.tasks.map((t) => {
      const task = t as LegacyTaskV1;
      return {
        ...task,
        tags: task.tags ?? [],
        updatedAt: task.updatedAt ?? task.createdAt ?? new Date().toISOString(),
      };
    }),
  }),
};

export function migrateData(data: StoredData): {
  data: StoredData;
  migrated: boolean;
} {
  let current = data;
  let migrated = false;

  while (current.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const migrateFn = migrations[current.schemaVersion];
    if (!migrateFn) {
      console.warn(
        `No migration found for schema version ${current.schemaVersion}`,
      );
      break;
    }
    current = migrateFn(current);
    migrated = true;
  }

  return { data: current, migrated };
}
