import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SpotlightCarousel from '@/components/home/SpotlightCarousel'

const navMock = vi.fn()
vi.mock('@/services/events', () => ({
  fetchSpotlightPlaylists: () => Promise.resolve([
    { id: 'spot1', title: 'Nav Spot', description: 'desc', emoji: '✨', games: ['gen-z-fluency'] },
  ]),
}))
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => navMock,
  }
})

describe('SpotlightCarousel navigation', () => {
  it('navigates on play spotlight', async () => {
    render(<SpotlightCarousel />)
    fireEvent.click(await screen.findByText(/Play spotlight/i))
    expect(navMock).toHaveBeenCalled()
  })
})
