/**
 * Repository Pattern для Transactions
 *
 * Централизованный доступ к транзакциям с оптимизацией
 */

import type {
  CategoryId,
  FamilyId,
  FamilyTransaction,
  Transaction,
  TransactionId,
  UserId,
} from '@/lib/schemas'

export class TransactionsRepository {
  private readonly transactionsById: Map<TransactionId, Transaction>
  private readonly transactionsByCategory: Map<CategoryId, Transaction[]>

  constructor(transactions: Transaction[]) {
    // Индексация по ID
    this.transactionsById = new Map(transactions.map(t => [t.id as TransactionId, t]))

    // Индексация по категориям
    this.transactionsByCategory = new Map()
    for (const transaction of transactions) {
      const categoryTxs = this.transactionsByCategory.get(transaction.category) ?? []
      categoryTxs.push(transaction)
      this.transactionsByCategory.set(transaction.category, categoryTxs)
    }
  }

  /**
   * Получить транзакцию по ID
   * Complexity: O(1)
   */
  findById(id: TransactionId): Transaction | undefined {
    return this.transactionsById.get(id)
  }

  /**
   * Получить все транзакции
   */
  findAll(): Transaction[] {
    return Array.from(this.transactionsById.values())
  }

  /**
   * Получить транзакции по категории
   * Complexity: O(1)
   */
  findByCategory(categoryId: CategoryId): Transaction[] {
    return this.transactionsByCategory.get(categoryId) ?? []
  }

  /**
   * Получить транзакции учителя
   */
  findByTeacher(teacherId: UserId): Transaction[] {
    return this.findAll().filter(t => t.teacher === teacherId)
  }

  /**
   * Получить транзакции за период
   */
  findByPeriod(startDate: number, endDate: number): Transaction[] {
    return this.findAll().filter(t => t.timestamp >= startDate && t.timestamp <= endDate)
  }

  /**
   * Получить доходы (value > 0)
   */
  findIncomes(): Transaction[] {
    return this.findAll().filter(t => t.value > 0)
  }

  /**
   * Получить расходы (value < 0)
   */
  findExpenses(): Transaction[] {
    return this.findAll().filter(t => t.value < 0)
  }

  /**
   * Сортировка по дате (новые первые)
   */
  sortByDateDesc(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Сортировка по сумме
   */
  sortByValue(transactions: Transaction[], order: 'asc' | 'desc' = 'desc'): Transaction[] {
    return [...transactions].sort((a, b) =>
      order === 'desc' ? b.value - a.value : a.value - b.value
    )
  }

  /**
   * Получить общую сумму транзакций
   */
  getTotalValue(transactions?: Transaction[]): number {
    const txs = transactions ?? this.findAll()
    return txs.reduce((sum, t) => sum + t.value, 0)
  }

  /**
   * Получить количество транзакций
   */
  count(): number {
    return this.transactionsById.size
  }
}

/**
 * Repository для FamilyTransactions
 */
export class FamilyTransactionsRepository {
  private readonly transactions: FamilyTransaction[]
  private readonly transactionsByFamily: Map<FamilyId, FamilyTransaction[]>

  constructor(familyTransactions: FamilyTransaction[]) {
    this.transactions = familyTransactions

    // Индексация по семьям
    this.transactionsByFamily = new Map()
    for (const tx of familyTransactions) {
      const familyTxs = this.transactionsByFamily.get(tx.family) ?? []
      familyTxs.push(tx)
      this.transactionsByFamily.set(tx.family, familyTxs)
    }
  }

  /**
   * Получить транзакции семьи
   * Complexity: O(1)
   */
  findByFamily(familyId: FamilyId): FamilyTransaction[] {
    return this.transactionsByFamily.get(familyId) ?? []
  }

  /**
   * Получить все транзакции
   */
  findAll(): FamilyTransaction[] {
    return this.transactions
  }

  /**
   * Вычислить баланс семьи
   */
  calculateBalance(familyId: FamilyId): number {
    return this.findByFamily(familyId).reduce((sum, tx) => sum + tx.value, 0)
  }

  /**
   * Вычислить балансы всех семей
   */
  calculateAllBalances(): Map<FamilyId, number> {
    const balances = new Map<FamilyId, number>()

    for (const [familyId, txs] of this.transactionsByFamily) {
      const balance = txs.reduce((sum, tx) => sum + tx.value, 0)
      balances.set(familyId, balance)
    }

    return balances
  }

  /**
   * Получить количество транзакций семьи
   */
  countByFamily(familyId: FamilyId): number {
    return this.findByFamily(familyId).length
  }
}
