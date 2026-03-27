import { useCallback, useState } from 'react'
import { Button, TextInput, TextArea, Select } from '@/components/ui'
import { STATUSES, PRIORITIES } from '@/lib/constants'
import type { TaskFormValues } from '@/lib/types'
import { useTaskForm } from '../hooks/useTaskForm'

type TaskFormProps = {
    initialValues?: TaskFormValues
    onSubmit: (values: TaskFormValues) => void
    onCancel: () => void
    onDirtyChange?: (dirty: boolean) => void
}

export function TaskForm({ initialValues, onSubmit, onCancel, onDirtyChange }: TaskFormProps) {
    const { values, errors, isDirty, handleChange, handleSubmit } = useTaskForm(initialValues)
    const [tagInput, setTagInput] = useState('')

    if (onDirtyChange) {
        onDirtyChange(isDirty)
    }

    const addTag = useCallback(() => {
        const tag = tagInput.trim()
        if (tag && !values.tags.includes(tag)) {
            handleChange('tags', [...values.tags, tag])
        }
        setTagInput('')
    }, [tagInput, values.tags, handleChange])

    const removeTag = useCallback(
        (tag: string) => {
            handleChange(
                'tags',
                values.tags.filter((t) => t !== tag)
            )
        },
        [values.tags, handleChange]
    )

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(onSubmit)
            }}
            className="space-y-4"
            noValidate
        >
            <TextInput
                label="Title"
                placeholder="Task title"
                value={values.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                autoFocus
                required
            />

            <TextArea
                label="Description"
                placeholder="Describe the task..."
                value={values.description}
                onChange={(e) => handleChange('description', e.target.value)}
                autoGrow
                rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Status"
                    options={STATUSES}
                    value={values.status}
                    onValueChange={(v) => handleChange('status', v as TaskFormValues['status'])}
                />
                <Select
                    label="Priority"
                    options={PRIORITIES}
                    value={values.priority}
                    onValueChange={(v) => handleChange('priority', v as TaskFormValues['priority'])}
                />
            </div>

            <TextInput
                label="Assignee"
                placeholder="Who is responsible?"
                value={values.assignee}
                onChange={(e) => handleChange('assignee', e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="flex gap-2">
                    <TextInput
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                addTag()
                            }
                        }}
                        className="flex-1"
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={addTag}>
                        Add
                    </Button>
                </div>
                {values.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {values.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-gray-900"
                                    aria-label={`Remove ${tag}`}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">{initialValues ? 'Save Changes' : 'Create Task'}</Button>
            </div>
        </form>
    )
}