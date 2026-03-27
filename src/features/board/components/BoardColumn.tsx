
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, Status } from '@/lib/types'
import { STATUSES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { TaskCard } from './TaskCard'

type BoardColumnProps = {
    status: Status
    tasks: Task[]
    onEditTask: (task: Task) => void
}

const STATUS_COLORS: Record<Status, string> = {
    backlog: 'bg-gray-400',
    'in-progress': 'bg-primary-500',
    done: 'bg-success-500',
}

export function BoardColumn({ status, tasks, onEditTask }: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status })
    const label = STATUSES.find((s) => s.value === status)?.label ?? status

    return (
        <section
            className={cn(
                'flex flex-col rounded-lg bg-gray-50 border border-gray-200 min-h-[200px] transition-colors',
                isOver && 'border-primary-300 bg-primary-50/50'
            )}
            aria-label={`${label} column`}
        >
            <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-200">
                <span className={cn('h-2.5 w-2.5 rounded-full', STATUS_COLORS[status])} />
                <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
                <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
                    {tasks.length}
                </span>
            </div>

            <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onEdit={onEditTask} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">No tasks</p>
                )}
            </div>
        </section>
    )
}