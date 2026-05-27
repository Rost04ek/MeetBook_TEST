/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { login as apiLogin, register as apiRegister, setAuthToken } from '../api/api'
import type { UserProfile } from '../types/models'

type AuthState = {
  user: UserProfile | null
  token: string | null
}

type AuthResponse = {
  token: string
  user: UserProfile
}

type AuthContextType = {
  user: UserProfile | null
  token: string | null
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (name: string, email: string, password: string) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function readAuthState(): AuthState {
  try {
    const raw = localStorage.getItem('auth')
    if (raw) return JSON.parse(raw) as AuthState
  } catch {
    // ignore storage issues
  }
  return { user: null, token: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(readAuthState)

  useEffect(() => {
    setAuthToken(auth.token)
  }, [auth.token])

  const { user, token } = auth

  function persist(newAuth: AuthState) {
    setAuth(newAuth)
    if (newAuth.token) localStorage.setItem('auth', JSON.stringify(newAuth))
    else localStorage.removeItem('auth')
  }

  async function login(email: string, password: string) {
    const data = (await apiLogin(email, password)) as AuthResponse
    persist({ user: data.user ?? null, token: data.token ?? null })
    return data
  }

  async function register(name: string, email: string, password: string) {
    const data = (await apiRegister(name, email, password)) as AuthResponse
    persist({ user: data.user ?? null, token: data.token ?? null })
    return data
  }

  function logout() {
    persist({ user: null, token: null })
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
