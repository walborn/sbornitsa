'use client'

import { useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { useLocale } from 'next-intl'

import { isAuthenticated } from '@/lib/auth'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const locale = useLocale()

  useEffect(() => {
    // Check if we are on the login page or any other public page if needed
    if (pathname?.includes(`/${locale}/login`)) {
      setAuthorized(true)
      return
    }

    if (!isAuthenticated()) {
      router.push(`/${locale}/login`)
      setAuthorized(false)
    } else {
      setAuthorized(true)
    }
  }, [pathname, router, locale])

  if (!authorized) {
    // You can return a loading spinner here
    return null
  }

  return <>{children}</>
}
