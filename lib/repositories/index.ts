import { EventsRepository } from './events.repository'
import { FamiliesRepository } from './families.repository'
import { FamilyTransactionsRepository, TransactionsRepository } from './transactions.repository'
import { UsersRepository } from './users.repository'

/**
 * Initialized Repository Instances
 *
 * Singleton instances репозиториев с данными из lib/data
 */

import { events, families, familyTransactions, transactions, users } from '@/lib/data'

/**
 * Singleton instances репозиториев
 * Инициализируются один раз при импорте модуля
 */
export const usersRepo = new UsersRepository(users)
export const familiesRepo = new FamiliesRepository(families)
export const transactionsRepo = new TransactionsRepository(transactions)
export const familyTransactionsRepo = new FamilyTransactionsRepository(familyTransactions)
export const eventsRepo = new EventsRepository(events)
/**
 * Использование:
 *
 * import { usersRepo } from '@/lib/repositories'
 *
 * const user = usersRepo.findById('boris.yuzhakov')
 * const familyUsers = usersRepo.findByFamily('yuzhakov')
 */
