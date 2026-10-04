'use client'

import { useAppHeader } from '@/components/layout/app-header-provider'

export function AppHeader() {
  const { value } = useAppHeader()

  if (!value) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-4">
      <span className="truncate text-foreground">{value}</span>
    </div>
  )
}
