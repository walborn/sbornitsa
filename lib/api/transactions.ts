import { familyTransactions, transactions } from '@/lib/data'

export async function fetchTransactions() {
  // try {
  //   return await sql<User[]>`SELECT * FROM users`
  // } catch (error) {
  //   console.error('Database Error:', error)
  //   throw new Error('Failed to fetch users.')
  // }
  return transactions
}

export async function fetchFamilyTransactions() {
  // try {
  //   return await sql<User[]>`SELECT * FROM users`
  // } catch (error) {
  //   console.error('Database Error:', error)
  //   throw new Error('Failed to fetch users.')
  // }
  return familyTransactions
}
