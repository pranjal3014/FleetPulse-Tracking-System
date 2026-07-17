import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/services'

const AuthContext = createContext(null)
const USER_KEY = 'fp_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })

  const persist = useCallback((data) => {
    const profile = { userId: data.userId, name: data.name, email: data.email, role: data.role }
    localStorage.setItem('fp_access_token', data.accessToken)
    localStorage.setItem('fp_refresh_token', data.refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
    return profile
  }, [])

  const login = useCallback(async (credentials) => persist((await authApi.login(credentials)).data), [persist])
  const register = useCallback(async (details) => (await authApi.register(details)).data, [])
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('fp_refresh_token')
    try { if (refreshToken) await authApi.logout(refreshToken) } finally {
      localStorage.removeItem('fp_access_token'); localStorage.removeItem('fp_refresh_token'); localStorage.removeItem(USER_KEY); setUser(null)
    }
  }, [])

  useEffect(() => {
    const expire = () => setUser(null)
    window.addEventListener('fleetpulse:session-expired', expire)
    return () => window.removeEventListener('fleetpulse:session-expired', expire)
  }, [])

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, register, logout }), [user, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
