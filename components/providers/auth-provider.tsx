'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useLocale } from 'next-intl'

import { login as authLogin, logout as authLogout, getFamily } from '@/lib/auth'
import type { Family } from '@/lib/definitions'

interface AuthContextType {
  family: Family | null
  login: (username: string, family: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<Family | null>(null)
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => {
    // Initialize state from localStorage on mount
    const family = getFamily()
    if (family?.id) {
      setFamily(family)
    }
  }, [])

  const login = (username: string, password: string) => {
    const success = authLogin(username, password)
    if (success) {
      setFamily(getFamily())
    }
    return success
  }

  const logout = () => {
    authLogout()
    setFamily(null)
    router.replace(`/${locale}/login`)
  }

  return <AuthContext.Provider value={{ family, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
