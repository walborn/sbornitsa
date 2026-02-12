import { Suspense } from 'react'

import LoginForm from '@/components/ui/forms/login-form'
import { LocaleToggle } from '@/components/shared/locale-toggle'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="absolute flex top-4 right-4 gap-2">
        <LocaleToggle />
        <ThemeToggle />
      </div>
      <div className="relative mx-auto flex w-full max-w-100 flex-col space-y-2.5 p-4 md:-mt-32">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
