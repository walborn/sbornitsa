'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { useLocale } from 'next-intl'

import { useAuthStore } from '@/lib/store/auth.store'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  
  // Use store directly to get both auth state and hydration status
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const hydrated = useAuthStore(state => state.hydrated)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only proceed once mounted and store is hydrated
    if (!isMounted || !hydrated) return

    const isLoginPage = pathname?.includes(`/${locale}/login`)

    if (isLoginPage) {
      if (isAuthenticated) {
        router.push(`/${locale}/profile`)
      }
      return
    }

    if (!isAuthenticated) {
      router.push(`/${locale}/login`)
    }
  }, [pathname, router, locale, isAuthenticated, hydrated, isMounted])

  // Show nothing while checking or if not authenticated (and not on login page)
  const isLoginPage = pathname?.includes(`/${locale}/login`)
  
  if (!isMounted || !hydrated) return null 
  
  if (!isAuthenticated && !isLoginPage) return null

  return <>{children}</>
}
