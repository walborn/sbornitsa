import z from 'zod'

import { FamilyIdSchema, UserIdSchema } from './constants'

/**
 * Schema для Family
 *
 * ВАЖНО: mother, father, children ограничены только валидными UserIds!
 */
export const FamilySchema = z.object({
  id: FamilyIdSchema,
  name: z.object({
    ru: z.string().min(1),
    en: z.string().min(1),
  }),
  mother: UserIdSchema,
  father: UserIdSchema.optional(),
  children: z.array(UserIdSchema),
  value: z.number(),
  password: z.string().min(6),
  avatar: z.url(),
})

export type {
  Chernys,
  Eremeevs,
  Fadeevs,
  Gerbers,
  Kirillovs,
  Legoshins,
  Leonenkos,
  Marshevs,
  Novitskys,
  Petrovs,
  Pimenovs,
  Skvortsovs,
  Usarovs,
  Yuzhakovs,
} from './constants'

export type Family = z.infer<typeof FamilySchema>
