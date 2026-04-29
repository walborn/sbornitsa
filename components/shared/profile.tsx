'use client'

import FamilyCard from '@/components/shared/family-card'
import { useFamily } from '@/lib/store/auth.store'

export default function Profile({ locale }: { locale: string }) {
  const family = useFamily()

  if (!family) return null

  return (
    <FamilyCard
      locale={locale}
      familyPromise={Promise.resolve(family)}
    />
  )
}
