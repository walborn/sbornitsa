import { categories } from '@/lib/data'
import { familyTransactionsRepo, transactionsRepo } from '@/lib/repositories'
import type { TransactionCategory } from '@/lib/schemas'

export async function fetchTransactions() {
  return transactionsRepo.findAll()
}

export async function fetchFamilyTransactions() {
  return familyTransactionsRepo.findAll()
}

export const fetchTransactionCategories = async (): Promise<TransactionCategory[]> => {
  return categories
}
