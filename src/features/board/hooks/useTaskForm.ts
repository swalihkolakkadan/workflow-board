import { useState } from "react";
import type { TaskFormValues } from "@/lib/types";

type FormErrors = Partial<Record<keyof TaskFormValues, string>>;

const INITIAL_VALUES: TaskFormValues = {
  title: "",
  description: "",
  status: "backlog",
  priority: "medium",
  assignee: "",
  tags: [],
};

function validate(values: TaskFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  } else if (values.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  return errors;
}

export function useTaskForm(initialValues?: TaskFormValues) {
  const defaults = initialValues ?? INITIAL_VALUES;
  const [values, setValues] = useState<TaskFormValues>(defaults);
  const [errors, setErrors] = useState<FormErrors>({});
  const [baseline, setBaseline] = useState<TaskFormValues>(() => defaults);

  const isDirty = JSON.stringify(values) !== JSON.stringify(baseline);

  function handleChange<K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(onSubmit: (values: TaskFormValues) => void) {
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(values);
  }

  function reset(newDefaults?: TaskFormValues) {
    const d = newDefaults ?? INITIAL_VALUES;
    setValues(d);
    setErrors({});
    setBaseline(d);
  }

  return { values, errors, isDirty, handleChange, handleSubmit, reset };
}
