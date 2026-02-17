import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import type { User } from '@/lib/schemas' // Use schemas directly!
import { format } from '@/lib/tools/time'

import { Card } from '../ui/card'
import { fetchTranslations } from '../utils/fetch-translations'
import UserContacts from './user-contacts'
import UserFamily from './user-family'

export default async function UserCard({
  locale,
  userPromise,
}: {
  locale: 'ru' | 'en'
  userPromise: Promise<User | undefined>
}) {
  const user = await userPromise

  // Parallel fetch translations while waiting for user?
  // Ideally we could Promise.all() here if we want to be super fast,
  // but translations are fast usually.
  const t = await fetchTranslations({
    navigation: 'navigation',
    shared: 'shared',
  })

  if (!t) return notFound()
  if (!user) return notFound() // Handle undefined user

  return (
    <>
      <Card className="gap-2 p-4">
        <Avatar
          size="lg"
          className="mx-auto select-none pointer-events-none"
        >
          <AvatarImage
            src={user.avatar}
            alt={`Avatar of ${user.name}`}
          />
          <AvatarFallback>
            {user.name
              .split(' ')
              .map(name => name[0].toUpperCase())
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className="mb-2 block text-center text-sm font-medium text-foreground">
          {user.name}
        </div>
        <div className="mb-2 block text-center text-sm font-medium text-muted-foreground">
          {format(user.birthdate.getTime())}
        </div>
      </Card>

      {user.family && (
        <Suspense fallback={<Skeleton className="h-16 w-full rounded-lg my-2" />}>
          <UserFamily
            familyId={user.family}
            locale={locale}
          />
        </Suspense>
      )}

      {user.contacts && (
        <section className="mx-auto mt-4">
          <div className="mb-2 block text-center text-xl font-medium text-foreground">Контакты</div>
          <UserContacts value={user.contacts} />
        </section>
      )}
    </>
  )
}
