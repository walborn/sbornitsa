'use client'

import * as React from 'react'

import { useAppHeader } from '@/components/layout/app-header-provider'

interface Props {
  children: React.ReactNode
}

export function AppHeader({ children }: Props) {
  const { setValue } = useAppHeader()

  React.useEffect(() => {
    setValue(children)
  }, [children, setValue])

  return null
}
