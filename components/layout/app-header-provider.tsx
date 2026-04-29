'use client'

import { createContext, useContext, useState } from 'react'

interface AppHeaderContext {
  value: React.ReactNode
  setValue: (value: React.ReactNode) => void
}

const AppHeaderContext = createContext<AppHeaderContext>({ value: '', setValue: () => {} })

export function AppHeaderProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<React.ReactNode>('')

  return (
    <AppHeaderContext.Provider value={{ value, setValue }}>{children}</AppHeaderContext.Provider>
  )
}

export function useAppHeader() {
  const context = useContext(AppHeaderContext)

  if (context === undefined) {
    throw new Error('useAppHeader must be used within a AppHeaderProvider')
  }

  return context
}
