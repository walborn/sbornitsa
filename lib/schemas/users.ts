import z from 'zod'

import {
  FamilyIdSchema,
  PhoneSchema,
  TelegramSchema,
  UserIdSchema,
  UserRoleSchema,
  UserTagSchema,
} from './constants'

const UserContactsSchema = z.object({
  phone: PhoneSchema.optional(),
  telegram: TelegramSchema.optional(),
})

export const UserSchema = z.object({
  id: UserIdSchema,
  name: z.string().min(1, 'Name cannot be empty'),
  family: FamilyIdSchema.optional(),
  birthdate: z.date(),
  avatar: z.url('Avatar must be a valid URL'),
  contacts: UserContactsSchema.optional(),
  role: UserRoleSchema,
  tags: z.set(UserTagSchema),
})

export type User = z.infer<typeof UserSchema>
