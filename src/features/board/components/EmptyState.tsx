import { Button } from "@/components/ui";

type EmptyStateProps = {
  type: "no-tasks" | "no-results" | "storage-error";
  onAction?: () => void;
};

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const config = {
    "no-tasks": {
      title: "No tasks yet",
      description: "Create your first task to get started.",
      action: "Create Task",
    },
    "no-results": {
      title: "No matching tasks",
      description: "Try adjusting your filters or search query.",
      action: "Clear Filters",
    },
    "storage-error": {
      title: "Storage unavailable",
      description:
        "Your browser storage is not available. Tasks will not be saved.",
      action: undefined,
    },
  }[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h3 className="text-lg font-medium text-gray-900">{config.title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        {config.description}
      </p>
      {config.action && onAction && (
        <Button variant="primary" size="sm" className="mt-4" onClick={onAction}>
          {config.action}
        </Button>
      )}
    </div>
  );
}
