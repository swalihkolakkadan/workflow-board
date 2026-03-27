import { PencilLineIcon, TrashIcon } from "@phosphor-icons/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow } from "date-fns";
import { Button, Card, Tag } from "@/components/ui";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIORITY_VARIANT = {
  high: "red",
  medium: "yellow",
  low: "blue",
} as const;

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          "group cursor-grab active:cursor-grabbing hover:border-gray-300 transition-all",
          isDragging && "opacity-50 shadow-lg rotate-2",
        )}
        onClick={() => onEdit(task)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEdit(task);
          }
        }}
        aria-label={`Task: ${task.title}`}
      >
        <Card.Body className="space-y-2" {...listeners}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium text-text-primary line-clamp-2">
              {task.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-primary-600 hover:bg-primary-50"
                aria-label={`Edit task: ${task.title}`}
              >
                <PencilLineIcon size={14} weight="bold" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-danger-600 hover:bg-danger-50"
                aria-label={`Delete task: ${task.title}`}
              >
                <TrashIcon size={14} weight="bold" />
              </Button>
              <Tag variant={PRIORITY_VARIANT[task.priority]}>
                {task.priority}
              </Tag>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-text-secondary line-clamp-2">
              {task.description}
            </p>
          )}

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Tag key={tag} variant="default" className="text-[11px]">
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            {task.assignee && (
              <span className="text-xs text-text-secondary truncate max-w-[120px]">
                {task.assignee}
              </span>
            )}
            <span className="text-[11px] text-text-muted ml-auto">
              {task.createdAt === task.updatedAt ? "Created" : "Updated"}{" "}
              {formatDistanceToNow(new Date(task.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
