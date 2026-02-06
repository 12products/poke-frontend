import { useState, useCallback } from 'react'

import { POKE_URL } from '../constants/secrets'
import { SystemStatus } from '../types'

function useStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${POKE_URL}/status`)

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`)
      }

      const data: SystemStatus = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status')
      setStatus(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { status, isLoading, error, fetchStatus }
}

export default useStatus
