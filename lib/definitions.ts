/**
 * Definitions
 *
 * Re-export всех новых типов из Schemas для обратной совместимости.
 */

import type { UserId, UserTag } from '@/lib/schemas'

// Re-export всего из схем
export * from '@/lib/schemas'

/**
 * Утилита для создания Set тегов с проверкой уникальности
 */
type UniqueArray<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends Rest[number]
    ? never
    : readonly [First, ...UniqueArray<Rest>]
  : T

export const createTags = <T extends readonly UserTag[]>(a: T & UniqueArray<T>): Set<UserTag> =>
  new Set(a)

/**
 * Специфические типы семей
 * Упрощаем до UserId[] так как branded types не позволяют легко
 * использовать string literals.
 * В будущем лучше использовать repo.findByFamily('eremeev')
 */
export type Eremeevs = UserId[]
export type Pimenovs = UserId[]
export type Cherny = UserId[]
export type Novitsky = UserId[]
export type Legoshins = UserId[]
export type Marshevs = UserId[]
export type Petrovs = UserId[]
export type Yuzhakovs = UserId[]
export type Fadeevs = UserId[]
export type Gerbers = UserId[]
export type Skvortsovs = UserId[]
export type Kirillovs = UserId[]
export type Usarovs = UserId[]
export type Leonenkos = UserId[]
