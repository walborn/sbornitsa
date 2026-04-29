'use client'

import { use, useMemo } from 'react'

import Image from 'next/image'

import { TransactionCard } from '@/components/shared/transaction-card'
import { Button } from '@/components/ui/button'
import type { FamilyTransaction, Transaction, TransactionCategory } from '@/lib/schemas'
import { useFamily } from '@/lib/store/auth.store'
import {
  useFilterHydrated,
  useSelectedCategoryIds,
  useToggleCategory,
} from '@/lib/store/filter.store'

interface Props {
  transactionsPromise: Promise<Record<Transaction['id'], Transaction>>
  familyTransactionsPromise: Promise<FamilyTransaction[]>
  transactionCategoriesPromise: Promise<Record<string, TransactionCategory>>
}

export default function TransactionsList({
  transactionsPromise,
  familyTransactionsPromise,
  transactionCategoriesPromise,
}: Props) {
  const family = useFamily()
  const transactions = use(transactionsPromise)
  const familyTransactions = use(familyTransactionsPromise)
  const categories = use(transactionCategoriesPromise)

  const selectedCategoryIds = useSelectedCategoryIds()
  const toggleCategory = useToggleCategory()
  const hydrated = useFilterHydrated()

  const currentFamilyTransactions = useMemo(
    () => familyTransactions.filter(({ family: familyId }) => familyId === family?.id),
    [familyTransactions, family?.id]
  )

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    for (const { transaction, value } of currentFamilyTransactions) {
      const { category } = transactions[transaction]
      totals[category] = (totals[category] || 0) + value
    }
    return totals
  }, [currentFamilyTransactions, transactions])

  if (!(family && hydrated)) return null

  const handleToggleCategory = (categoryId: string) => {
    toggleCategory(categoryId)
  }

  const selectedCategoriesSet = new Set(selectedCategoryIds)

  let values: Transaction[] = familyTransactions
    .filter(({ family: familyId }) => familyId === family.id)
    .map(({ transaction, value }) => ({ ...transactions[transaction], value }))

  if (selectedCategoriesSet.size) {
    values = values.filter(t => selectedCategoriesSet.has(t.category))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {Object.values(categories).map(category => (
          <Button
            key={category.id}
            className="flex items-center gap-2 cursor-pointer"
            variant={selectedCategoriesSet.has(category.id) ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => handleToggleCategory(category.id)}
          >
            <Image
              src={category.icon}
              alt={category.name}
              width={16}
              height={16}
            />
            {category.name}
            <div className="ml-2 text-muted-foreground">{categoryTotals[category.id] || 0}</div>
          </Button>
        ))}
      </div>
      {values.map(({ id, name, category: categoryId, description, timestamp, value }) => {
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
      })}
    </div>
  )
}
