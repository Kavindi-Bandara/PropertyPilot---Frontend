import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from './auth-context'
import { TOKEN_KEY, USER_KEY } from '@/services/api'
import * as authService from '@/services/authService'
import type { AuthUser, LoginRequest } from '@/types/auth'

function loadStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function clearStorage() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(USER_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser)

  const login = useCallback(async (request: LoginRequest, remember: boolean) => {
    const { token, user } = await authService.login(request)
    clearStorage()
    // "Remember me" keeps the session after the browser closes.
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token)
    storage.setItem(USER_KEY, JSON.stringify(user))
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    clearStorage()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
