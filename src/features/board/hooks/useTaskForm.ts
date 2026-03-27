import { useState, useCallback, useRef, useMemo } from 'react'
import type { TaskFormValues } from '@/lib/types'

type FormErrors = Partial<Record<keyof TaskFormValues, string>>

const INITIAL_VALUES: TaskFormValues = {
  title: '',
  description: '',
  status: 'backlog',
  priority: 'medium',
  assignee: '',
  tags: [],
}

function validate(values: TaskFormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.title.trim()) {
    errors.title = 'Title is required'
  } else if (values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters'
  }

  return errors
}

export function useTaskForm(initialValues?: TaskFormValues) {
  const defaults = initialValues ?? INITIAL_VALUES
  const [values, setValues] = useState<TaskFormValues>(defaults)
  const [errors, setErrors] = useState<FormErrors>({})
  const initialRef = useRef(defaults)

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialRef.current)
  }, [values])

  const handleChange = useCallback(
    <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => {
        if (!prev[field]) return prev
        const next = { ...prev }
        delete next[field]
        return next
      })
    },
    []
  )

  const handleSubmit = useCallback(
    (onSubmit: (values: TaskFormValues) => void) => {
      const errs = validate(values)
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
      onSubmit(values)
    },
    [values]
  )

  const reset = useCallback((newDefaults?: TaskFormValues) => {
    const d = newDefaults ?? INITIAL_VALUES
    setValues(d)
    setErrors({})
    initialRef.current = d
  }, [])

  return { values, errors, isDirty, handleChange, handleSubmit, reset }
}