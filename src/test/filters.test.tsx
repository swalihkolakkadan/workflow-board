
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { useTaskStore } from '@/stores/taskStore'
import type { Task } from '@/lib/types'

const mockTasks: Task[] = [
    {
        id: '1',
        title: 'Fix login bug',
        description: 'Users cannot log in',
        status: 'backlog',
        priority: 'high',
        assignee: 'Alice',
        tags: ['bug'],
        createdAt: '2025-06-01T00:00:00.000Z',
        updatedAt: '2025-06-01T00:00:00.000Z',
    },
    {
        id: '2',
        title: 'Add dark mode',
        description: 'Implement theme switching',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Bob',
        tags: ['feature'],
        createdAt: '2025-06-02T00:00:00.000Z',
        updatedAt: '2025-06-02T00:00:00.000Z',
    },
    {
        id: '3',
        title: 'Write docs',
        description: 'Document the API',
        status: 'done',
        priority: 'low',
        assignee: 'Charlie',
        tags: ['docs'],
        createdAt: '2025-06-03T00:00:00.000Z',
        updatedAt: '2025-06-03T00:00:00.000Z',
    },
]

describe('Filter behavior', () => {
    beforeEach(() => {
        localStorage.clear()
        window.history.replaceState(null, '', '/')
        useTaskStore.setState({ tasks: mockTasks, initialized: true, storageError: undefined })
    })

    it('filters tasks by text search', async () => {
        const user = userEvent.setup()
        render(<App />)

        const searchInput = screen.getByPlaceholderText('Search tasks...')
        await user.type(searchInput, 'login')

        expect(screen.getByText('Fix login bug')).toBeInTheDocument()
        expect(screen.queryByText('Add dark mode')).not.toBeInTheDocument()
        expect(screen.queryByText('Write docs')).not.toBeInTheDocument()
    })

    it('shows all tasks when search is cleared', async () => {
        const user = userEvent.setup()
        render(<App />)

        const searchInput = screen.getByPlaceholderText('Search tasks...')
        await user.type(searchInput, 'login')
        await user.clear(searchInput)

        expect(screen.getByText('Fix login bug')).toBeInTheDocument()
        expect(screen.getByText('Add dark mode')).toBeInTheDocument()
        expect(screen.getByText('Write docs')).toBeInTheDocument()
    })
})