import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import '@/styles/ui-enhancements.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { initializeFlags } from '@/services/flags'
import { registerRenderer, GAME_MODES } from '@/game-core'

const OpinionGameplay = lazy(() => import('@/pages/OpinionGameplay'))
const PersonalityGameplay = lazy(() => import('@/pages/PersonalityGameplay'))
const TimelineRenderer = lazy(() => import('@/components/game/mechanics/TimelineRenderer.jsx'))
const ConnectionRenderer = lazy(() => import('@/components/game/mechanics/ConnectionRenderer.jsx'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Initialize feature flags (reads VITE_FLAG_*). No-op if env absent.
initializeFlags()

// Register non-quiz renderers (avoids redirects when using registry)
registerRenderer(GAME_MODES.OPINION, (props) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
    <OpinionGameplay {...props} />
  </Suspense>
))
registerRenderer(GAME_MODES.TIMELINE, (props) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
    <TimelineRenderer {...props} />
  </Suspense>
))
registerRenderer(GAME_MODES.CONNECTION, (props) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
    <ConnectionRenderer {...props} />
  </Suspense>
))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
) 

// Register service worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed', err);
    });
  });
}
