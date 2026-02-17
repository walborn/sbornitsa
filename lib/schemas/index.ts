/**
 * Zod Schemas для валидации данных
 *
 * Эти схемы обеспечивают runtime validation и являются single source of truth
 * для типов User, Family, Transaction, etc.
 */

import { z } from 'zod'

// ============================================================================
// БАЗОВЫЕ СХЕМЫ
// ============================================================================

/**
 * Все возможные User IDs
 * ВАЖНО: При добавлении нового пользователя, добавьте его ID сюда!
 */
const USER_IDS = [
  // Mothers
  'alexandra.pimenova',
  'svetlana.eremeeva',
  'maria.legoshina',
  'anastasia.marsheva',
  'ksenya.petrova',
  'nadezhda.fadeeva',
  'natasha.novitskaya',
  'sofya.gerber',
  'olga.skvortsova',
  'olga.kirillova',
  'maria.usarova',
  'anastasia.chernaya',
  'ornella.zubkova',
  'polina.leonenko',
  // Fathers
  'denis.petrov',
  'gennady.fadeev',
  'boris.yuzhakov',
  // Teachers
  'veronika.zolotareva',
  'amira.h',
  'natalya.m',
  // Children
  'nina.chernaya',
  'vitya.cherny',
  'ivan.eremeev',
  'vera.eremeeva',
  'meera.yuzhakova',
  'mila.legoshina',
  'misha.novitskiy',
  'anna.novitskaya',
  'kirill.skvortsov',
  'agata.gerber',
  'platon.gerber',
  'emil.usarov',
  'aurora.fadeeva',
  'marusya.fadeeva',
  'varya.petrova',
  'igor.marshev',
  'emilia.pimenova',
  'emma.kirillova',
  'aellita.leonenko',
] as const

/**
 * Все возможные Family IDs
 * ВАЖНО: При добавлении новой семьи, добавьте ID сюда!
 */
const FAMILY_IDS = [
  'pimenov',
  'eremeev',
  'legoshin',
  'marshev',
  'petrov',
  'fadeev',
  'novitskiy',
  'gerber',
  'skvortsov',
  'kirillov',
  'usarov',
  'cherny',
  'yuzhakov',
  'leonenko',
] as const

/**
 * Все возможные категории
 */
const CATEGORY_IDS = ['music', 'english', 'transfers', 'supermarkets', 'gifts'] as const

/**
 * Все возможные теги пользователей
 */
const USER_TAGS = [
  'teachers',
  'parents',
  'mothers',
  'fathers',
  'children',
  'daughters',
  'sons',
] as const

/**
 * Все возможные роли
 */
const USER_ROLES = ['user', 'manager', 'admin'] as const

// ============================================================================
// ZODE SCHEMAS
// ============================================================================

/**
 * Schema для UserId
 * Ограничивает только существующими user IDs
 */
export const UserIdSchema = z.enum(USER_IDS)

/**
 * Schema для FamilyId
 * Ограничивает только существующими family IDs
 */
export const FamilyIdSchema = z.enum(FAMILY_IDS)

/**
 * Schema для CategoryId
 */
export const CategoryIdSchema = z.enum(CATEGORY_IDS)

/**
 * Schema для UserTag
 */
export const UserTagSchema = z.enum(USER_TAGS)

/**
 * Schema для UserRole
 */
export const UserRoleSchema = z.enum(USER_ROLES)

/**
 * Schema для контактов
 */
const PhoneSchema = z.string().regex(/^\+7\d{10}$/, {
  message: 'Phone number should be in format +7XXXXXXXXXX (10 digits after +7)',
})

const TelegramSchema = z.string().regex(/^@[a-zA-Z0-9_]+$/, {
  message: 'Telegram should start with @',
})

export const ContactsSchema = z.object({
  phone: PhoneSchema.optional(),
  telegram: TelegramSchema.optional(),
})

/**
 * Schema для User
 *
 * Обратите внимание: используем UserIdSchema для строгой типизации!
 */
export const UserSchema = z.object({
  id: UserIdSchema,
  name: z.string().min(1, 'Name cannot be empty'),
  family: FamilyIdSchema.optional(),
  birthdate: z.date(),
  avatar: z.string().url('Avatar must be a valid URL'),
  contacts: ContactsSchema.optional(),
  role: UserRoleSchema,
  tags: z.set(UserTagSchema),
})

/**
 * Schema для Family
 *
 * ВАЖНО: mother, father, children ограничены только валидными UserIds!
 * Это отвечает на ваш вопрос - используем UserIdSchema
 */
export const FamilySchema = z.object({
  id: FamilyIdSchema,
  name: z.object({
    ru: z.string().min(1),
    en: z.string().min(1),
  }),
  mother: UserIdSchema, // ✅ Только валидные UserId!
  father: UserIdSchema.optional(), // ✅ Только валидные UserId!
  children: z.array(UserIdSchema), // ✅ Только валидные UserId!
  value: z.number(),
  password: z.string().min(1),
  avatar: z.url().optional(),
})

/**
 * Schema для Category
 */
export const CategorySchema = z.object({
  id: CategoryIdSchema,
  name: z.string().min(1),
  description: z.string(),
  icon: z.url(),
})

/**
 * Schema для TransactionTarget
 */
export const TransactionTargetSchema = z.object({
  bank: z.string().optional(), // tbank, sber, ...
  name: z.string().optional(),
  message: z.string().optional(),
  category: z.string().optional(),
  user: UserIdSchema.optional(), // ✅ Только валидные UserId!
})

/**
 * Schema для TransactionSource
 */
export const TransactionSourceSchema = z.object({
  bank: z.string().optional(),
  name: z.string().optional(),
  message: z.string().optional(),
})

/**
 * Schema для FamiliesIncomes (распределение по семьям)
 */
export const FamiliesIncomesSchema = z.record(FamilyIdSchema, z.number())

/**
 * Schema для Transaction
 */

export const TransactionIdSchema = z.string().uuid({
  message: 'Wrong TransactionId format (must be UUID)',
})

export const TransactionSchema = z.object({
  id: TransactionIdSchema.default(() => crypto.randomUUID()),
  name: z.string().min(1),
  description: z.string(),
  value: z.number(),
  category: CategoryIdSchema,
  families: FamiliesIncomesSchema,
  timestamp: z.number().positive('Timestamp must be positive'),
  teacher: UserIdSchema.optional(), // ✅ Только валидные UserId!
  target: TransactionTargetSchema.optional(),
  source: TransactionSourceSchema.optional(),
})

/**
 * Schema для FamilyTransaction
 */
export const FamilyTransactionSchema = z.object({
  family: FamilyIdSchema,
  transaction: z.string().min(1),
  value: z.number(),
})

// ============================================================================
// TYPE INFERENCE
// ============================================================================

/**
 * Типы, выведенные из Zod schemas
 * Это наши новые типы - single source of truth!
 */
export type UserId = z.infer<typeof UserIdSchema>
export type FamilyId = z.infer<typeof FamilyIdSchema>
export type CategoryId = z.infer<typeof CategoryIdSchema>
export type UserTag = z.infer<typeof UserTagSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type Contacts = z.infer<typeof ContactsSchema>
export type User = z.infer<typeof UserSchema>
export type Family = z.infer<typeof FamilySchema>
export type Category = z.infer<typeof CategorySchema>
export type TransactionTarget = z.infer<typeof TransactionTargetSchema>
export type TransactionSource = z.infer<typeof TransactionSourceSchema>
export type FamiliesIncomes = z.infer<typeof FamiliesIncomesSchema>
export type TransactionId = z.infer<typeof TransactionIdSchema>
export type Transaction = z.infer<typeof TransactionSchema>
export type FamilyTransaction = z.infer<typeof FamilyTransactionSchema>

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Безопасная валидация с возвратом результата
 */
export function validateUser(
  data: unknown
): { success: true; data: User } | { success: false; error: string } {
  const result = UserSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.message }
}

export function validateFamily(
  data: unknown
): { success: true; data: Family } | { success: false; error: string } {
  const result = FamilySchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.message }
}

export function validateTransaction(
  data: unknown
): { success: true; data: Transaction } | { success: false; error: string } {
  const result = TransactionSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.message }
}

/**
 * Парсинг массивов
 */
export function parseUsers(data: unknown): User[] {
  return z.array(UserSchema).parse(data)
}

export function parseFamilies(data: unknown): Family[] {
  return z.array(FamilySchema).parse(data)
}

export function parseTransactions(data: unknown): Transaction[] {
  return z.array(TransactionSchema).parse(data)
}
