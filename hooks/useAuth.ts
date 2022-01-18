import shallow from 'zustand/shallow'

import { useStore } from '../store'

function useAuth() {
  const { session, isAuthenticated, setSession } = useStore(
    (state) => ({
      session: state.session,
      isAuthenticated: state.isAuthenticated,
      setSession: state.setSession,
    }),
    shallow
  )

  return { session, isAuthenticated, setSession }
}

export default useAuth
