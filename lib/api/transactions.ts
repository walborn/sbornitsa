import { familyTransactionsRepo, transactionsRepo } from '@/lib/repositories.instance'

export async function fetchTransactions() {
  return transactionsRepo.findAll()
}

export async function fetchFamilyTransactions() {
  return familyTransactionsRepo.findAll()
}
