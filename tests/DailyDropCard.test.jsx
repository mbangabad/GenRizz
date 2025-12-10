import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import DailyDropCard from '@/components/home/DailyDropCard'

const navMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navMock,
  }
})

describe('DailyDropCard', () => {
  it('renders items and triggers navigation on play', () => {
    const drop = {
      title: 'Test Drop',
      description: 'desc',
      last_rotation: '2025-01-01T00:00:00Z',
      items: [{ game_id: 'gen-z-fluency' }, { game_id: 'boomer-era' }],
    }
    render(
      <MemoryRouter>
        <DailyDropCard drop={drop} />
      </MemoryRouter>
    )
    expect(screen.getByText('Test Drop')).toBeInTheDocument()
    expect(screen.getByText('gen-z-fluency')).toBeInTheDocument()
    expect(screen.getByText(/Last updated/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Play first game/i))
    expect(navMock).toHaveBeenCalled()
  })
})
