'use client'

import { use } from 'react'

import { TransactionCard } from '@/components/shared/transaction-card'
import type { Category, FamilyTransaction, Transaction } from '@/lib/schemas'
import { useFamily } from '@/lib/store/auth.store'

interface Props {
  transactionsPromise: Promise<Record<Transaction['id'], Transaction>>
  familyTransactionsPromise: Promise<FamilyTransaction[]>
  categoriesPromise: Promise<Record<string, Category>>
}

export default function TransactionsList({
  transactionsPromise,
  familyTransactionsPromise,
  categoriesPromise,
}: Props) {
  const family = useFamily()
  const transactions = use(transactionsPromise)
  const familyTransactions = use(familyTransactionsPromise)
  const categories = use(categoriesPromise)

  if (!family) return null

  const values: Transaction[] = familyTransactions
    .filter(({ family: familyId }) => familyId === family.id)
    .map(({ transaction, value }) => ({ ...transactions[transaction], value }))

  return values.map(({ id, name, category: categoryId, description, timestamp, value }) => {
    const category = categories[categoryId]
    return (
      <TransactionCard
        key={id}
        icon={{ src: category.icon, alt: category.name }}
        name={name}
        description={description}
        category={category.name}
        timestamp={timestamp}
        value={value}
      />
    )
  })
}
