import { useEffect, useState, useMemo, useCallback } from 'react'
import { DndContext, DragOverlay, closestCorners, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { Button } from '@/components/ui'
import { useTaskStore } from '@/stores/taskStore'
import { STATUSES } from '@/lib/constants'
import type { Task, Status } from '@/lib/types'
import { BoardColumn } from './components/BoardColumn'
import { TaskCard } from './components/TaskCard'

export function BoardPage() {
    const { tasks, init, moveTask } = useTaskStore()
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [, setEditingTask] = useState<Task | null>(null)

    useEffect(() => {
        init()
    }, [init])

    const tasksByStatus = useMemo(() => {
        const grouped: Record<Status, Task[]> = {
            backlog: [],
            'in-progress': [],
            done: [],
        }
        for (const task of tasks) {
            grouped[task.status].push(task)
        }
        return grouped
    }, [tasks])

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            const task = tasks.find((t) => t.id === event.active.id)
            setActiveTask(task ?? null)
        },
        [tasks]
    )

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            setActiveTask(null)
            const { active, over } = event
            if (!over) return

            const taskId = active.id as string
            const newStatus = over.id as Status

            if (STATUSES.some((s) => s.value === newStatus)) {
                const task = tasks.find((t) => t.id === taskId)
                if (task && task.status !== newStatus) {
                    moveTask(taskId, newStatus)
                }
            }
        },
        [tasks, moveTask]
    )

    const handleEditTask = useCallback((task: Task) => {
        setEditingTask(task)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Workflow Board</h1>
                    <Button size="sm">+ New Task</Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <DndContext
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {STATUSES.map(({ value }) => (
                            <BoardColumn
                                key={value}
                                status={value}
                                tasks={tasksByStatus[value]}
                                onEditTask={handleEditTask}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeTask && <TaskCard task={activeTask} onEdit={() => { }} />}
                    </DragOverlay>
                </DndContext>
            </main>
        </div>
    )
}