import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core'
import { Button, Modal } from '@/components/ui'
import { useTaskStore } from '@/stores/taskStore'
import { useToastStore } from '@/stores/toastStore'
import { STATUSES } from '@/lib/constants'
import type { Task, Status, TaskFormValues } from '@/lib/types'
import { BoardColumn } from './components/BoardColumn'
import { TaskCard } from './components/TaskCard'
import { TaskForm } from './components/TaskForm'

export function BoardPage() {
    const { tasks, init, addTask, updateTask, moveTask } = useTaskStore()
    const addToast = useToastStore((s) => s.addToast)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const isDirtyRef = useRef(false)

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
                    addToast({
                        title: `Moved to ${STATUSES.find((s) => s.value === newStatus)?.label}`,
                        variant: 'success',
                    })
                }
            }
        },
        [tasks, moveTask, addToast]
    )

    const openCreate = useCallback(() => {
        setEditingTask(null)
        setModalOpen(true)
    }, [])

    const openEdit = useCallback((task: Task) => {
        setEditingTask(task)
        setModalOpen(true)
    }, [])

    const handleModalClose = useCallback(
        (open: boolean) => {
            if (!open && isDirtyRef.current) {
                const confirmed = window.confirm('You have unsaved changes. Discard them?')
                if (!confirmed) return
            }
            setModalOpen(open)
            if (!open) {
                setEditingTask(null)
                isDirtyRef.current = false
            }
        },
        []
    )

    const handleSubmit = useCallback(
        (values: TaskFormValues) => {
            if (editingTask) {
                updateTask(editingTask.id, values)
                addToast({ title: 'Task updated', variant: 'success' })
            } else {
                addTask(values)
                addToast({ title: 'Task created', variant: 'success' })
            }
            setModalOpen(false)
            setEditingTask(null)
            isDirtyRef.current = false
        },
        [editingTask, updateTask, addTask, addToast]
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Workflow Board</h1>
                    <Button size="sm" onClick={openCreate}>
                        + New Task
                    </Button>
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
                                onEditTask={openEdit}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeTask && <TaskCard task={activeTask} onEdit={() => { }} />}
                    </DragOverlay>
                </DndContext>
            </main>

            <Modal open={modalOpen} onOpenChange={handleModalClose}>
                <Modal.Header>
                    <Modal.Title>{editingTask ? 'Edit Task' : 'Create Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TaskForm
                        key={editingTask?.id ?? 'new'}
                        initialValues={
                            editingTask
                                ? {
                                    title: editingTask.title,
                                    description: editingTask.description,
                                    status: editingTask.status,
                                    priority: editingTask.priority,
                                    assignee: editingTask.assignee,
                                    tags: editingTask.tags,
                                }
                                : undefined
                        }
                        onSubmit={handleSubmit}
                        onCancel={() => handleModalClose(false)}
                        onDirtyChange={(dirty) => {
                            isDirtyRef.current = dirty
                        }}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}