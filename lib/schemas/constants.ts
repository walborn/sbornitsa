// все константы, которые нельзя вывести из других типов
// не зависим от других модулей
import { z } from 'zod'

// users
export const USER_IDS = [
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

export const USER_ROLES = ['user', 'manager', 'admin'] as const

export const USER_TAGS = [
  'teachers',
  'parents',
  'mothers',
  'fathers',
  'children',
  'daughters',
  'sons',
] as const

// families
export const FAMILY_IDS = [
  'pimenovs',
  'eremeevs',
  'legoshins',
  'marshevs',
  'petrovs',
  'fadeevs',
  'novitskys',
  'gerbers',
  'skvortsovs',
  'kirillovs',
  'usarovs',
  'chernys',
  'yuzhakovs',
  'leonenkos',
] as const

// users by families
export type Chernys = Extract<UserId, 'anastasia.chernaya' | 'vitya.cherny' | 'nina.chernaya'>[]
export type Eremeevs = Extract<UserId, 'ivan.eremeev' | 'vera.eremeeva'>[]
export type Pimenovs = Extract<UserId, 'alexandra.pimenova' | 'emilia.pimenova'>[]
export type Novitskys = Extract<
  UserId,
  'natasha.novitskaya' | 'misha.novitskiy' | 'anna.novitskaya'
>[]
export type Legoshins = Extract<UserId, 'maria.legoshina' | 'mila.legoshina'>[]
export type Marshevs = Extract<UserId, 'anastasia.marsheva' | 'igor.marshev'>[]
export type Petrovs = Extract<UserId, 'ksenya.petrova' | 'denis.petrov' | 'varya.petrova'>[]
export type Yuzhakovs = Extract<UserId, 'ornella.zubkova' | 'boris.yuzhakov' | 'meera.yuzhakova'>[]
export type Fadeevs = Extract<
  UserId,
  'nadezhda.fadeeva' | 'gennady.fadeev' | 'aurora.fadeeva' | 'marusya.fadeeva'
>[]
export type Gerbers = Extract<UserId, 'sofya.gerber' | 'agata.gerber' | 'platon.gerber'>[]
export type Skvortsovs = Extract<UserId, 'olga.skvortsova' | 'kirill.skvortsov'>[]
export type Kirillovs = Extract<UserId, 'olga.kirillova' | 'emma.kirillova'>[]
export type Usarovs = Extract<UserId, 'maria.usarova' | 'emil.usarov'>[]
export type Leonenkos = Extract<UserId, 'polina.leonenko' | 'aellita.leonenko'>[]

// transactions
export const TRANSACTIONS_CATEGORY_IDS = [
  'music',
  'english',
  'transfers',
  'supermarkets',
  'gifts',
] as const

// events
export const EVENTS_CATEGORY_IDS = [
  'holidays',
  'birthdays',
  'children_birthdays',
  'parents_birthdays',
  'teachers_birthdays',
  'vacations',
  'activities',

  'workshops', // мастер-классы
  // мастерклассы бывают
  'workshops, art', // изобразительное творчество
  'workshops, cooking', // кулинарный мастер-класс
  'workshops, crafts', // поделки
  'workshops, science', // научные эксперименты
  'workshops, music', // музыкальные мастер-классы
  'workshops, sports', // спортивные мастер-классы
  'math', // математический кружок
  'nature', // наблюдения за природой
  'music', // музыкальное занятие
  'sport', // спортивный праздник
  'yoga', // детская йога

  'cleaning', // генеральная уборка / субботник
  'concerts', // концерт / утренник
  'conferences', // педсовет / конференция
  'theatres', // театральная постановка
  'excursions', // экскурсия
  'walk', // тематическая прогулка
  'zoo', // посещение зоопарка
  'trip', // выездное мероприятие

  // holidays
  'family', // семейный праздник
  'fitness', // физкультурное занятие
  'graduation', // выпускной

  // days
  'health', // день здоровья
  'meeting', // родительское собрание

  'open_house', // день открытых дверей
  'parents', // родительский клуб

  'party', // день рождения / чаепитие
  'photo-sessions', // фотосессия
] as const

// entities schemas
export const UserIdSchema = z.enum(USER_IDS)
export const UserRoleSchema = z.enum(USER_ROLES)
export const UserTagSchema = z.enum(USER_TAGS)
export const FamilyIdSchema = z.enum(FAMILY_IDS)
export const TransactionsCategoryIdSchema = z.enum(TRANSACTIONS_CATEGORY_IDS)
export const TransactionIdSchema = z.uuid({ message: 'Wrong TransactionId format (must be UUID)' })
export const EventsCategoryIdSchema = z.enum(EVENTS_CATEGORY_IDS)

// others schemas
const PHONE_REGEX = /^\+7\d{10}$/
export const PhoneSchema = z.string().regex(PHONE_REGEX, {
  message: 'Phone number should be in format +7XXXXXXXXXX (10 digits after +7)',
})

const TELEGRAM_REGEX = /^@[a-zA-Z0-9_]+$/
export const TelegramSchema = z.string().regex(TELEGRAM_REGEX, {
  message: 'Telegram should start with @',
})

export const TimestampSchema = z.number().positive('Timestamp must be positive')

// Простые производные схемы
/**
 * Schema для FamiliesIncomes (распределение по семьям)
 */

/**
 * Типы, выведенные из Zod schemas
 * Это наши новые типы - single source of truth!
 */
export type Timestamp = z.infer<typeof TimestampSchema>

export type UserId = z.infer<typeof UserIdSchema>
export type FamilyId = z.infer<typeof FamilyIdSchema>
export type UserTag = z.infer<typeof UserTagSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type TransactionsCategoryId = z.infer<typeof TransactionsCategoryIdSchema>
export type EventsCategoryId = z.infer<typeof EventsCategoryIdSchema>
