'use client'

import { useTranslations } from 'next-intl'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getFamily } from '@/lib/auth'
import type { Family } from '@/lib/definitions'

export default function Balance() {
  const family: Family = getFamily()
  const t = useTranslations('shared')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{t('balance')}</CardTitle>
        <CardDescription className="text-2xl">{family.value}</CardDescription>
      </CardHeader>
    </Card>
  )
}
