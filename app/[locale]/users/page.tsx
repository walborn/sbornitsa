// import type { Metadata } from 'next'
import Link from 'next/link'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchUsers } from '@/lib/api'
import { absoluteUrl } from '@/lib/seo/config'
import { createMetadata } from '@/lib/seo/metadata'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.users' })

  return createMetadata({
    title: t('title'),
    description: t('description'),
    path: `/${locale}/users`,
    locale,
    images: [
      {
        url: absoluteUrl('/icons/metadata/apple-touch-icon.png'),
        width: 512,
        height: 512,
        alt: t('title'),
      },
    ],
  })
}

export default async function UsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await fetchTranslations({
    navigation: 'navigation',
    page: 'pages.users',
  })

  if (!t) return notFound()
  const users = await fetchUsers()

  return (
    <>
      <AppHeader>{t.navigation('users')}</AppHeader>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {users.map(user => (
          <li key={user.id}>
            <Link href={`/${locale}/users/${user.id}`}>
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Avatar
                    size="lg"
                    className="mb-2 mx-auto"
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
                  <div>
                    <p className="text-sm font-medium whitespace-nowrap">{user.name}</p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
