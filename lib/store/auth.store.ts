/**
 * Auth Store with Zustand
 *
 * Реактивная аутентификация с автоматической персистацией в localStorage
 */

import CryptoJS from 'crypto-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { familiesRepo } from '@/lib/repositories.instance'
import type { Family, FamilyId } from '@/lib/schemas'

const FAMILY_KEY = 'sbornitsa-family'

/**
 * Auth State Interface
 */
interface AuthState {
  family: Family | null
  isAuthenticated: boolean
  login: (username: FamilyId, password: string) => boolean
  logout: () => void
  hydrated: boolean
  setHydrated: (state: boolean) => void
}

/**
 * Auth Store
 *
 * Features:
 * - ✨ Реактивность - компоненты автоматически обновляются при изменении
 * - 💾 Автоматическая персистация в localStorage
 * - 🔐 Проверка пароля через SHA256
 * - 🎯 Type-safe с TypeScript
 *
 * @example
 * // В компоненте
 * const { family, isAuthenticated, login, logout } = useAuthStore()
 *
 * // Только определенное поле (оптимизация)
 * const family = useAuthStore(state => state.family)
 */
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      // Initial state
      family: null,
      isAuthenticated: false,

      /**
       * Вход в систему
       * @returns true если вход успешный, false если неверные credentials
       */
      login: (username: FamilyId, password: string): boolean => {
        const family = familiesRepo.findById(username)

        if (!family) {
          console.warn(`Family not found: ${username}`)
          return false
        }

        const hashedPassword = CryptoJS.SHA256(password).toString()

        if (family.password !== hashedPassword) {
          console.warn('Invalid password')
          return false
        }

        set({ family, isAuthenticated: true })
        return true
      },

      /**
       * Выход из системы
       */
      logout: () => {
        set({ family: null, isAuthenticated: false })
      },

      // Hydration state
      hydrated: false,
      setHydrated: (state: boolean) => {
        set({ hydrated: state })
      },
    }),
    {
      name: FAMILY_KEY,
      onRehydrateStorage: () => state => {
        state?.setHydrated(true)
      },
    }
  )
)

/**
 * Хук для получения только семьи (оптимизация)
 * @example
 * const family = useFamily()
 */
export const useFamily = () => useAuthStore(state => state.family)

/**
 * Хук для проверки аутентификации
 * @example
 * const isAuth = useIsAuthenticated()
 */
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
