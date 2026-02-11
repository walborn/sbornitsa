'use client'

import { getFamily } from '@/lib/auth'
import type { Family } from '@/lib/definitions'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export default function Balance() {
  const family: Family = getFamily()
  const t = useTranslations('shared')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='capitalize'>{t('balance')}</CardTitle>
        <CardDescription className='text-2xl'>{family.value}</CardDescription>
        <CardFooter>
          
        </CardFooter>
      </CardHeader>
    </Card>
  )
}
