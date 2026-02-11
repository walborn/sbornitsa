'use client'

import { useState, useTransition } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { AtSymbolIcon, ExclamationCircleIcon, KeyIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { login } from '@/lib/auth'
import { useLocale } from 'next-intl'

export default function LoginForm() {
  const locale = useLocale()
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/profile`
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(undefined)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    startTransition(() => {
      if (login(username, password)) {
        router.push(callbackUrl)
      } else {
        setErrorMessage('Invalid username or password.')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <div className="flex-1 rounded-lg bg-zinc-50 px-6 pb-4 pt-8 dark:bg-zinc-800">
        <h1 className="mb-3 text-2xl dark:text-white">Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-900 dark:text-zinc-50"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-zinc-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500 peer-focus:text-zinc-900 dark:text-zinc-400 dark:peer-focus:text-zinc-50" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-900 dark:text-zinc-50"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-zinc-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500 peer-focus:text-zinc-900 dark:text-zinc-400 dark:peer-focus:text-zinc-50" />
            </div>
          </div>
        </div>
        <input
          type="hidden"
          name="redirectTo"
          value={callbackUrl}
        />
        <Button
          className="mt-4 w-full"
          aria-disabled={isPending}
          disabled={isPending}
        >
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-zinc-50 dark:text-zinc-900" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  )
}
