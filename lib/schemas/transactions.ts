import { z } from 'zod'

import {
  FamilyIdSchema,
  TimestampSchema,
  TransactionsCategoryIdSchema,
  UserIdSchema,
} from './constants'

const TransactionsCategorySchema = z.object({
  id: TransactionsCategoryIdSchema,
  name: z.string().min(1),
  description: z.string(),
  icon: z.url(),
})

const TransactionIdSchema = z.uuid({
  message: 'Wrong TransactionId format (must be UUID)',
})

const FamiliesIncomesSchema = z.record(FamilyIdSchema, z.number())

const TargetSchema = z.object({
  bank: z.string().optional(), // tbank, sber, ...
  name: z.string().optional(),
  message: z.string().optional(),
  category: z.string().optional(),
  user: UserIdSchema.optional(),
})

const SourceSchema = z.object({
  bank: z.string().optional(),
  name: z.string().optional(),
  message: z.string().optional(),
})

export const TransactionSchema = z.object({
  id: TransactionIdSchema.default(() => crypto.randomUUID()),
  name: z.string().min(1),
  description: z.string(),
  value: z.number(),
  category: TransactionsCategoryIdSchema,
  families: FamiliesIncomesSchema,
  timestamp: TimestampSchema,
  teacher: UserIdSchema.optional(),
  target: TargetSchema.optional(),
  source: SourceSchema.optional(),
})

export const FamilyTransactionSchema = z.object({
  family: FamilyIdSchema,
  transaction: TransactionIdSchema,
  value: z.number(),
})

export type Transaction = z.infer<typeof TransactionSchema>
export type FamilyTransaction = z.infer<typeof FamilyTransactionSchema>
export type TransactionCategory = z.infer<typeof TransactionsCategorySchema>
