/**
 * Initialized Repository Instances
 *
 * Singleton instances репозиториев с данными из lib/data
 */

import { families, familyTransactions, transactions, users } from '@/lib/data'
import {
  FamiliesRepository,
  FamilyTransactionsRepository,
  TransactionsRepository,
  UsersRepository,
} from '@/lib/repositories'

/**
 * Singleton instances репозиториев
 * Инициализируются один раз при импорте модуля
 */
export const usersRepo = new UsersRepository(users)
export const familiesRepo = new FamiliesRepository(families)
export const transactionsRepo = new TransactionsRepository(transactions)
export const familyTransactionsRepo = new FamilyTransactionsRepository(familyTransactions)

/**
 * Использование:
 *
 * import { usersRepo } from '@/lib/repositories.instance'
 *
 * const user = usersRepo.findById('boris.yuzhakov')
 * const familyUsers = usersRepo.findByFamily('yuzhakov')
 */
