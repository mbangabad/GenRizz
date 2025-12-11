import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { emitEvent } from '@/services/telemetry'

export default function TelemetryTracker() {
  const location = useLocation()

  useEffect(() => {
    emitEvent('screen_view', { path: location.pathname + location.search })
  }, [location])

  return null
}
