import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDistanceToNow } from 'date-fns'
import { Card, Tag } from '@/components/ui'
import type { Task } from '@/lib/types'
import { cn } from '@/lib/utils'

const PRIORITY_VARIANT = {
    high: 'red',
    medium: 'yellow',
    low: 'blue',
} as const

type TaskCardProps = {
    task: Task
    onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { task },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card
                className={cn(
                    'cursor-grab active:cursor-grabbing hover:border-gray-300 transition-all',
                    isDragging && 'opacity-50 shadow-lg rotate-2'
                )}
                onClick={() => onEdit(task)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onEdit(task)
                    }
                }}
                aria-label={`Task: ${task.title}`}
            >
                <Card.Body className="space-y-2" {...listeners}>
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h3>
                        <Tag variant={PRIORITY_VARIANT[task.priority]} className="shrink-0">
                            {task.priority}
                        </Tag>
                    </div>

                    {task.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
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
                            <span className="text-xs text-gray-500 truncate max-w-[120px]">
                                {task.assignee}
                            </span>
                        )}
                        <span className="text-[11px] text-gray-400 ml-auto">
                            {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                        </span>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}