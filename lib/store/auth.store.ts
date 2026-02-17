/**
 * Auth Store with Zustand
 *
 * Реактивная аутентификация с автоматической персистацией в localStorage
 */

'use client'

import CryptoJS from 'crypto-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  getFamily: () => Family | null
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
    (set, get) => ({
      // Initial state
      family: null,
      isAuthenticated: false,

      /**
       * Вход в систему
       * @returns true если вход успешный, false если неверные credentials
       */
      login: (username: FamilyId, password: string): boolean => {
        // Импортируем динамически чтобы избежать circular dependencies
        const { familiesRepo } = require('@/lib/repositories.instance')
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

        // Успешный вход
        set({ family, isAuthenticated: true })
        return true
      },

      /**
       * Выход из системы
       */
      logout: () => {
        set({ family: null, isAuthenticated: false })
      },

      /**
       * Получить текущую семью
       * @returns текущая семья или null если не авторизован
       */
      getFamily: () => {
        return get().family
      },
    }),
    {
      name: FAMILY_KEY,
      // Используем стандартный localStorage
      // Для миграции со старого формата см. migrateOldAuthData()
    }
  )
)

/**
 * Миграция со старого формата на новый
 * Вызывается один раз при первом рендере
 */
export const migrateOldAuthData = () => {
  if (typeof window === 'undefined') return

  try {
    const oldData = localStorage.getItem(FAMILY_KEY)
    if (!oldData) return

    const parsed = JSON.parse(oldData)

    // Если это старый формат (прямо Family объект без state)
    if (parsed.id && !parsed.state) {
      console.log('Migrating old auth data to Zustand format...')

      // Удаляем старые данные
      localStorage.removeItem(FAMILY_KEY)

      // Устанавливаем через store
      useAuthStore.setState({
        family: parsed,
        isAuthenticated: true,
      })
    }
  } catch (error) {
    console.error('Failed to migrate old auth data:', error)
  }
}

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
