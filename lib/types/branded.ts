/**
 * Branded Types System
 *
 * Branded types предотвращают случайное смешивание похожих типов.
 * Например, UserId нельзя передать вместо FamilyId, даже если оба - строки.
 */

// Branded type helper
declare const brand: unique symbol
type Brand<T, B> = T & { readonly [brand]: B }

/**
 * Branded type для User ID
 * @example 'anastasia.chernaya', 'boris.yuzhakov'
 */
export type UserId = Brand<string, 'UserId'>

/**
 * Branded type для Family ID
 * @example 'yuzhakov', 'eremeev'
 */
export type FamilyId = Brand<string, 'FamilyId'>

/**
 * Branded type для Transaction ID
 * @example 'tx-english-2026-02-15'
 */
export type TransactionId = Brand<string, 'TransactionId'>

/**
 * Branded type для Category ID
 * @example 'music', 'english'
 */
export type CategoryId = Brand<string, 'CategoryId'>

/**
 * Branded type для Timestamp
 * Unix timestamp в миллисекундах
 */
export type Timestamp = Brand<number, 'Timestamp'>

/**
 * Type guards для проверки branded types
 */

export const isUserId = (value: string): value is UserId => {
  // Формат: lowercase letters + dot + lowercase letters
  return /^[a-z]+\.[a-z]+$/.test(value)
}

export const isFamilyId = (value: string): value is FamilyId => {
  // Формат: только lowercase letters
  return /^[a-z]+$/.test(value)
}

export const isTransactionId = (value: string): value is TransactionId => {
  // Формат: начинается с 'tx-'
  return value.startsWith('tx-')
}

export const isCategoryId = (value: string): value is CategoryId => {
  const validCategories = ['music', 'english', 'transfers', 'supermarkets', 'gifts'] as const
  return validCategories.includes(value as any)
}

export const isTimestamp = (value: number): value is Timestamp => {
  // Проверяем что это валидный timestamp (больше 0 и не в будущем более чем на год)
  const now = Date.now()
  const oneYearInFuture = now + 365 * 24 * 60 * 60 * 1000
  return value > 0 && value <= oneYearInFuture
}

/**
 * Конструкторы для создания branded types
 * Эти функции НЕ делают валидацию - только cast
 * Используйте Zod schemas для валидации!
 */

export const createUserId = (id: string): UserId => id as UserId
export const createFamilyId = (id: string): FamilyId => id as FamilyId
export const createTransactionId = (id: string): TransactionId => id as TransactionId
export const createCategoryId = (id: string): CategoryId => id as CategoryId
export const createTimestamp = (ms: number): Timestamp => ms as Timestamp
// export const createUserRole = (role: string): UserRole => role as UserRole

/**
 * Utility types для работы с branded types
 */

// Извлечение underlying type из branded type
export type UnwrapBrand<T> = T extends Brand<infer U, any> ? U : T

// Проверка является ли тип branded
export type IsBranded<T> = T extends Brand<any, any> ? true : false
