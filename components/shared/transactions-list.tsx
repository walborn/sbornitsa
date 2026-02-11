'use client'

import { TransactionCard } from '@/components/shared/transaction-card'
import { Card, CardContent } from '@/components/ui/card'
import { getFamily } from '@/lib/auth'
import type { Category, FamilyTransaction, Transaction } from '@/lib/definitions'

interface Props {
  transactions: Record<Transaction['id'], Transaction>
  familyTransactions: FamilyTransaction[]
  categories: Record<string, Category>
}

export default function TransactionsList({ transactions, familyTransactions, categories }: Props) {
  const family = getFamily()

  if (!family) return null

  const values: Transaction[] = familyTransactions
    .filter(({ family: familyId }) => familyId === family.id)
    .map(({ transaction, value }) => ({ ...transactions[transaction], value }))

  return values.map(({ id, name, category: categoryId, description, timestamp, value }) => {
    const category = categories[categoryId]
    return (
      <Card key={id}>
        <CardContent>
          <TransactionCard
            icon={{ src: category.icon, alt: category.name }}
            name={name}
            description={description}
            category={category.name}
            timestamp={timestamp}
            value={value}
          />
        </CardContent>
      </Card>
    )
  })
}
