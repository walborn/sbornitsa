import type { ZodType } from 'zod'

import { type Event, EventSchema } from './events'
import { type Family, FamilySchema } from './families'
import {
  type FamilyTransaction,
  FamilyTransactionSchema,
  type Transaction,
  TransactionSchema,
} from './transactions'
import { type User, UserSchema } from './users'

type ValidateResult<T> = { success: true; data: T } | { success: false; error: string }

export const validateSchema = <T>(schema: ZodType<T>, data: unknown): ValidateResult<T> => {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error.message }
}

export const validateUser = (data: unknown): ValidateResult<User> => {
  return validateSchema(UserSchema, data)
}

export const validateFamily = (data: unknown): ValidateResult<Family> => {
  return validateSchema(FamilySchema, data)
}

export const validateTransaction = (data: unknown): ValidateResult<Transaction> => {
  return validateSchema(TransactionSchema, data)
}

export const validateFamilyTransaction = (data: unknown): ValidateResult<FamilyTransaction> => {
  return validateSchema(FamilyTransactionSchema, data)
}

export const validateEvent = (data: unknown): ValidateResult<Event> => {
  return validateSchema(EventSchema, data)
}
