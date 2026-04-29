import z from 'zod'

import { type Family, FamilySchema } from './families'
import { type Transaction, TransactionSchema } from './transactions'
import { type User, UserSchema } from './users'

export const parseArray = <T>(schema: z.ZodType<T>, data: unknown): T[] => {
  return z.array(schema).parse(data)
}

export function parseUsers(data: unknown): User[] {
  return parseArray<User>(UserSchema, data)
}

export function parseFamilies(data: unknown): Family[] {
  return parseArray<Family>(FamilySchema, data)
}

export function parseTransactions(data: unknown): Transaction[] {
  return parseArray<Transaction>(TransactionSchema, data)
}
