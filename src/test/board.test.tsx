
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { useTaskStore } from '@/stores/taskStore'

describe('Board workflow', () => {
    beforeEach(() => {
        localStorage.clear()
        useTaskStore.setState({ tasks: [], initialized: false, storageError: undefined })
    })

    it('creates a task and shows it on the board', async () => {
        const user = userEvent.setup()
        render(<App />)

        await user.click(screen.getByText('+ New Task'))

        const dialog = screen.getByRole('dialog')
        const titleInput = within(dialog).getByLabelText('Title')
        await user.type(titleInput, 'My first task')

        const descInput = within(dialog).getByLabelText('Description')
        await user.type(descInput, 'Some description')

        await user.click(within(dialog).getByRole('button', { name: /create task/i }))

        expect(screen.getByText('My first task')).toBeInTheDocument()
    })

    it('shows validation error when title is empty', async () => {
        const user = userEvent.setup()
        render(<App />)

        await user.click(screen.getByText('+ New Task'))

        const dialog = screen.getByRole('dialog')
        await user.click(within(dialog).getByRole('button', { name: /create task/i }))

        expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
})