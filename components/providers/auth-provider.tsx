/**
 * Auth Provider
 *
 * Теперь использует Zustand внутри для state management
 * но сохраняет React Context API для обратной совместимости
 */

'use client'

import { createContext, useContext, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useLocale } from 'next-intl'

import type { Family, FamilyId } from '@/lib/schemas'
import { migrateOldAuthData, useAuthStore, useFamily } from '@/lib/store/auth.store'

interface AuthContextType {
  family: Family | null
  login: (username: FamilyId, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const locale = useLocale()

  // Используем Zustand store напрямую
  const family = useFamily()
  const zustandLogin = useAuthStore(state => state.login)
  const zustandLogout = useAuthStore(state => state.logout)

  // Миграция при монтировании
  useEffect(() => {
    migrateOldAuthData()
  }, [])

  const login = (username: FamilyId, password: string) => {
    return zustandLogin(username, password)
  }

  const logout = () => {
    zustandLogout()
    router.replace(`/${locale}/login`)
  }

  return <AuthContext.Provider value={{ family, login, logout }}>{children}</AuthContext.Provider>
}

/**
 * Hook для использования auth context
 *
 * @deprecated Используйте useAuthStore() напрямую для лучшей производительности
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
