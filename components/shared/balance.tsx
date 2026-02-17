'use client'

import { use } from 'react'

import { useTranslations } from 'next-intl'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { FamilyTransaction } from '@/lib/definitions'
import { useFamily } from '@/lib/store/auth.store'

interface Props {
  familyTransactionsPromise: Promise<FamilyTransaction[]>
}

export default function Balance({ familyTransactionsPromise }: Props) {
  const family = useFamily()
  const t = useTranslations('shared')
  const familyTransactions = use(familyTransactionsPromise)

  if (!family) return null

  const balance = familyTransactions
    .filter(({ family: familyId }) => familyId === family.id)
    .reduce((acc, { value }) => acc + value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{t('balance')}</CardTitle>
        <CardDescription className="text-2xl">{balance}</CardDescription>
      </CardHeader>
    </Card>
  )
}
