import { expect, test } from 'bun:test'

import { familyTransactions, transactions } from './transactions'

// Фиксируем, во что превращаются исходные данные транзакций:
// любое изменение сумм, дат, долей семей или текстов уронит снапшот.
// id генерируются случайно, поэтому доли семей привязываем к самой транзакции.
// Нулевые веса не влияют на расчёт, поэтому в снапшот не попадают.

test('транзакции и доли семей', () => {
  const shares = new Map<string, Record<string, number>>()
  for (const { transaction, family, value } of familyTransactions) {
    shares.set(transaction, { ...shares.get(transaction), [family]: value })
  }

  const snapshot = transactions.map(({ id, timestamp, families, ...transaction }) => ({
    ...transaction,
    date: new Date(timestamp).toISOString(),
    weights: Object.fromEntries(Object.entries(families).filter(([, weight]) => weight)),
    shares: shares.get(id) ?? {},
  }))

  expect(snapshot).toMatchSnapshot()
})

// по id строятся страницы транзакций
test('id транзакций уникальны', () => {
  expect(new Set(transactions.map(({ id }) => id)).size).toBe(transactions.length)
})

test('балансы семей', () => {
  const balances: Record<string, number> = {}
  for (const { family, value } of familyTransactions) {
    balances[family] = (balances[family] ?? 0) + value
  }

  expect(balances).toMatchSnapshot()
})
