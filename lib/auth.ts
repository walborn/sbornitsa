/**
 * Authentication Module
 *
 * Теперь основан на Zustand store для реактивности
 * Сохраняем обратную совместимость со старым API
 */

export const FAMILY_KEY = 'sbornitsa-family'

// Re-export Zustand hooks для использования в Client Components
export { useAuthStore, useFamily, useIsAuthenticated } from '@/lib/store/auth.store'

// import type { Family, FamilyId } from '@/lib/schemas'

/**
 * Server-side утилиты для аутентификации
 * Эти функции НЕ реактивные и используются только на сервере
 */

/**
 * Получить семью из localStorage (server-side)
 * ⚠️ НЕ РЕАКТИВНО! Используйте useFamily() в компонентах
 */
// export const getFamily = (): Family | null => {
//   if (typeof window === 'undefined') return null

//   const familyStr = localStorage.getItem(FAMILY_KEY)
//   if (typeof familyStr !== 'string') return null

//   try {
//     const parsed = JSON.parse(familyStr)

//     // Поддержка старого формата
//     if (parsed.id && !parsed.state) {
//       return parsed as Family
//     }

//     // Новый формат Zustand
//     return parsed.state?.family ?? null
//   } catch {
//     return null
//   }
// }

/**
 * Проверить аутентификацию (server-side)
 * ⚠️ НЕ РЕАКТИВНО! Используйте useIsAuthenticated() в компонентах
 */
// export const isAuthenticated = (): boolean => {
//   if (typeof window === 'undefined') return false

//   const familyStr = localStorage.getItem(FAMILY_KEY)
//   if (typeof familyStr !== 'string') return false

//   try {
//     const parsed = JSON.parse(familyStr)

//     // Старый формат
//     if (parsed.id && !parsed.state) {
//       return Boolean(parsed.id)
//     }

//     // Новый формат
//     return parsed.state?.isAuthenticated ?? false
//   } catch {
//     return false
//   }
// }

/**
 * Вход в систему (server-side)
 * ⚠️ НЕ РЕАКТИВНО! Используйте useAuthStore().login() в компонентах
 *
 * Эта функция сохранена для обратной совместимости
 * но рекомендуется использовать хук useAuthStore()
 */
// export const login = (username: FamilyId, password: string): boolean => {
//   if (typeof window === 'undefined') return false

//   // Используем store напрямую
//   const { useAuthStore } = require('@/lib/store/auth.store')
//   return useAuthStore.getState().login(username, password)
// }

/**
 * Выход из системы (server-side)
 * ⚠️ НЕ РЕАКТИВНО! Используйте useAuthStore().logout() в компонентах
 */
// export const logout = (): void => {
//   if (typeof window === 'undefined') return

//   const { useAuthStore } = require('@/lib/store/auth.store')
//   useAuthStore.getState().logout()
// }
