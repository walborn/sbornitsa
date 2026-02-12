'use client'

import FamilyCard from '@/components/shared/family-card'
import { getFamily } from '@/lib/auth'
import type { Family } from '@/lib/definitions'

export default function Profile({ locale }: { locale: string }) {
  const family: Family = getFamily()

  return (
    <FamilyCard
      locale={locale}
      value={family}
    />
  )
}
