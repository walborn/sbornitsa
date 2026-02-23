import z from 'zod'

import { EventsCategoryIdSchema } from './constants'

const EventIdSchema = z.uuid({
  message: 'Wrong EventId format (must be UUID)',
})

const EventsCategorySchema = z.object({
  id: EventsCategoryIdSchema,
  name: z.string().min(1),
  description: z.string(),
  icon: z.url(),
})

export const EventSchema = z.object({
  id: EventIdSchema.default(() => crypto.randomUUID()),
  name: z.string().min(1),
  description: z.string(),
  icon: z.url(),
  start: z.number(),
  end: z.number(),
  categories: z.set(EventsCategoryIdSchema),
})

export type Event = z.infer<typeof EventSchema>
export type EventCategory = z.infer<typeof EventsCategorySchema>
