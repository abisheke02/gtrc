import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, post } from '../services/api'

interface Admin { id: string; email: string; name: string }
interface AuthState {
  admin: Admin | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ admin: Admin }>('/admin/auth/me')
      .then((r) => setAdmin(r.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const r = await post<{ admin: Admin }>('/admin/auth/login', { email, password })
    setAdmin(r.admin)
  }, [])

  const logout = useCallback(async () => {
    await post('/admin/auth/logout', {}).catch(() => {})
    setAdmin(null)
  }, [])

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
