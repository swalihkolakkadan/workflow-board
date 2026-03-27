import { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Select,
  Tag,
  TextArea,
  TextInput,
} from "@/components/ui";
import { useToastStore } from "@/stores/toastStore";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <p className="text-xs text-text-muted">{label}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`h-10 w-10 rounded-xl border border-border ${className}`} />
      <span className="text-[11px] text-text-muted">{name}</span>
    </div>
  );
}

export function UIReferencePage() {
  const addToast = useToastStore((s) => s.addToast);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [textareaVal, setTextareaVal] = useState("");
  const [selectVal, setSelectVal] = useState("");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-surface-glass backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              Design System
            </h1>
            <p className="text-xs text-text-muted mt-0.5">Workflow Board · UI Reference</p>
          </div>
          <a
            href="/"
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to Board
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* Typography */}
        <Section title="Typography">
          <Card>
            <Card.Body className="space-y-4">
              <div>
                <p className="text-[11px] text-text-muted mb-1">Display</p>
                <p className="text-3xl font-bold text-text-primary">Workflow Board</p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted mb-1">Heading</p>
                <p className="text-xl font-semibold text-text-primary">Task Management</p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted mb-1">Subheading</p>
                <p className="text-base font-medium text-text-primary">In Progress · 4 tasks</p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted mb-1">Body</p>
                <p className="text-sm text-text-primary">
                  Organize your work across Backlog, In Progress, and Done. Drag tasks between columns or click to edit.
                </p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted mb-1">Caption / Secondary</p>
                <p className="text-xs text-text-secondary">Updated 2 hours ago · Assigned to Alex</p>
              </div>
              <div>
                <p className="text-[11px] text-text-muted mb-1">Muted / Label</p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">Backlog</p>
              </div>
            </Card.Body>
          </Card>
        </Section>

        {/* Colors */}
        <Section title="Color Tokens">
          <Card>
            <Card.Body className="space-y-6">
              <div>
                <p className="text-xs text-text-muted mb-3">Surfaces</p>
                <div className="flex flex-wrap gap-4">
                  <Swatch name="surface" className="bg-surface" />
                  <Swatch name="surface-raised" className="bg-surface-raised" />
                  <Swatch name="surface-glass" className="bg-surface-glass" />
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-3">Brand — Primary</p>
                <div className="flex flex-wrap gap-3">
                  {["50","100","200","300","400","500","600","700","800","900"].map((shade) => (
                    <div key={shade} className="flex flex-col items-center gap-1.5">
                      <div className={`h-10 w-10 rounded-xl bg-primary-${shade}`} />
                      <span className="text-[11px] text-text-muted">{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-3">Semantic</p>
                <div className="flex flex-wrap gap-4">
                  <Swatch name="danger-500" className="bg-danger-500" />
                  <Swatch name="success-500" className="bg-success-500" />
                  <Swatch name="warning-500" className="bg-warning-500" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <Card>
            <Card.Body className="space-y-5">
              <Row label="Variants">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
              </Row>
              <Row label="Sizes">
                <Button size="lg">Large</Button>
                <Button size="md">Medium</Button>
                <Button size="sm">Small</Button>
              </Row>
              <Row label="States">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </Row>
            </Card.Body>
          </Card>
        </Section>

        {/* Tags / Chips */}
        <Section title="Tags · Chips">
          <Card>
            <Card.Body className="space-y-5">
              <Row label="Variants">
                <Tag variant="default">Default</Tag>
                <Tag variant="blue">Blue</Tag>
                <Tag variant="red">Red</Tag>
                <Tag variant="green">Green</Tag>
                <Tag variant="yellow">Yellow</Tag>
              </Row>
              <Row label="With remove">
                <Tag variant="default" onRemove={() => {}}>Default</Tag>
                <Tag variant="blue" onRemove={() => {}}>In Progress</Tag>
                <Tag variant="red" onRemove={() => {}}>High Priority</Tag>
                <Tag variant="green" onRemove={() => {}}>Done</Tag>
                <Tag variant="yellow" onRemove={() => {}}>Review</Tag>
              </Row>
              <Row label="Priority usage">
                <Tag variant="red">high</Tag>
                <Tag variant="yellow">medium</Tag>
                <Tag variant="blue">low</Tag>
              </Row>
            </Card.Body>
          </Card>
        </Section>

        {/* Cards */}
        <Section title="Card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <Card.Body>
                <p className="text-sm font-medium text-text-primary">Body only</p>
                <p className="text-xs text-text-secondary mt-1">
                  Simple card with just a body section.
                </p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <p className="text-sm font-semibold text-text-primary">With Header</p>
              </Card.Header>
              <Card.Body>
                <p className="text-xs text-text-secondary">
                  Card with a header divider separating the title from content.
                </p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <p className="text-sm font-semibold text-text-primary">Full Card</p>
              </Card.Header>
              <Card.Body>
                <p className="text-xs text-text-secondary">
                  Header, body, and footer sections with dividers between each.
                </p>
              </Card.Body>
              <Card.Footer>
                <div className="flex gap-2">
                  <Button size="sm">Confirm</Button>
                  <Button size="sm" variant="ghost">Cancel</Button>
                </div>
              </Card.Footer>
            </Card>

            <Card>
              <Card.Body className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary line-clamp-2">
                    Redesign onboarding flow
                  </p>
                  <Tag variant="red">high</Tag>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">
                  Update the onboarding screens to match the new Liquid Glass design system.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Tag variant="blue">design</Tag>
                  <Tag variant="default">ux</Tag>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-text-secondary">Alex Kim</span>
                  <span className="text-[11px] text-text-muted">2 hours ago</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Section>

        {/* Form Inputs */}
        <Section title="Form Inputs">
          <Card>
            <Card.Body className="space-y-5">
              <TextInput
                label="Text Input"
                placeholder="Enter task title..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <TextInput
                label="With error"
                placeholder="Enter value..."
                error="This field is required."
                defaultValue=""
              />
              <TextInput
                label="Disabled"
                placeholder="Not editable"
                disabled
              />
              <TextArea
                label="Text Area"
                placeholder="Add a description..."
                value={textareaVal}
                onChange={(e) => setTextareaVal(e.target.value)}
                autoGrow
              />
              <Select
                label="Select"
                placeholder="Choose status..."
                value={selectVal}
                onValueChange={setSelectVal}
                options={[
                  { value: "backlog", label: "Backlog" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "done", label: "Done" },
                ]}
              />
            </Card.Body>
          </Card>
        </Section>

        {/* Modal */}
        <Section title="Modal">
          <Card>
            <Card.Body>
              <Row>
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              </Row>
            </Card.Body>
          </Card>

          <Modal open={modalOpen} onOpenChange={setModalOpen}>
            <Modal.Header>
              <Modal.Title>Create Task</Modal.Title>
              <Modal.Description>
                Fill in the details below to create a new task.
              </Modal.Description>
            </Modal.Header>
            <Modal.Body className="space-y-4">
              <TextInput label="Title" placeholder="Enter task title..." />
              <TextArea label="Description" placeholder="Add a description..." autoGrow />
              <Select
                label="Priority"
                placeholder="Select priority..."
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Modal.Close>
              <Button>Create Task</Button>
            </Modal.Footer>
          </Modal>
        </Section>

        {/* Toast */}
        <Section title="Toast">
          <Card>
            <Card.Body>
              <Row label="Variants">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    addToast({ title: "Default notification", variant: "default" })
                  }
                >
                  Default
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    addToast({ title: "Task created", description: "Your task has been saved.", variant: "success" })
                  }
                >
                  Success
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    addToast({ title: "Something went wrong", description: "Please try again.", variant: "error" })
                  }
                >
                  Error
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    addToast({ title: "Storage unavailable", description: "Tasks will not be saved.", variant: "info" })
                  }
                >
                  Info
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Section>

      </main>
    </div>
  );
}
