'use client'

import { useTranslations } from 'next-intl'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getFamily } from '@/lib/auth'
import type { Family, FamilyTransaction } from '@/lib/definitions'

interface Props {
  familyTransactions: FamilyTransaction[]
}

export default function Balance({ familyTransactions }: Props) {
  const family: Family = getFamily()
  const balance = familyTransactions
    .filter(({ family: familyId }) => familyId === family.id)
    .reduce((acc, { value }) => acc + value, 0)
  const t = useTranslations('shared')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{t('balance')}</CardTitle>
        <CardDescription className="text-2xl">{balance}</CardDescription>
      </CardHeader>
    </Card>
  )
}
