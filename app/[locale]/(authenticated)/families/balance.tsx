'use client'

import { useFamily } from '@/lib/store/auth.store'

interface Props {
  value: number
}

export default function Balance({ value }: Props) {
  const family = useFamily()

  if (family?.id !== 'yuzhakovs') return null

  return value
}
