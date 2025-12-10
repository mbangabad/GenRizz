import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SpotlightCarousel from '@/components/home/SpotlightCarousel'

vi.mock('@/services/events', () => ({
  fetchSpotlightPlaylists: () => Promise.resolve([
    { id: 'spot1', title: 'Test Spot', description: 'desc', emoji: '✨', games: ['gen-z-fluency'] },
  ]),
}))

const navMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navMock,
  }
})

describe('SpotlightCarousel', () => {
  it('renders spotlight events', async () => {
    render(<SpotlightCarousel />)
    expect(await screen.findByText('Test Spot')).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Play spotlight/i))
    expect(navMock).toHaveBeenCalled()
  })
})
