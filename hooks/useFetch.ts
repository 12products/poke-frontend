import { useCallback } from 'react'

import useAuth from '../hooks/useAuth'

function useFetch() {
  const { isAuthenticated, session } = useAuth()

  const pokeFetch = useCallback(
    (endpoint: RequestInfo, options?: RequestInit | undefined) => {
      const headers = new Headers()

      if (isAuthenticated && session?.access_token) {
        headers.append('Authorization', `Bearer ${session.access_token}`)
      }

      return fetch(endpoint, {
        ...options,
        headers,
      })
    },
    [isAuthenticated]
  )

  return { fetch: pokeFetch }
}

export default useFetch
