import { Suspense } from 'react'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { UserCardSkeleton } from '@/components/shared/skeletons'
import UserCard from '@/components/shared/user-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchUserById, fetchUsers } from '@/lib/api'
import type { User } from '@/lib/schemas'
import { absoluteUrl } from '@/lib/seo/config'
import { createMetadata } from '@/lib/seo/metadata'

interface Props {
  params: Promise<{ locale: 'ru' | 'en'; id: User['id'] }>
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

export async function generateStaticParams() {
  return await fetchUsers()
}

export default async function UserPage({ params }: Props) {
  const props = await params
  const { locale } = await params
  setRequestLocale(locale)

  const userPromise = fetchUserById(props.id as User['id'])

  const t = await fetchTranslations({
    navigation: 'navigation',
  })

  if (!t) return notFound()
  // User checking moved to UserCard to allow async rendering

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={`/${locale}/users`}>{t.navigation('users')}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{props.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <Suspense fallback={<UserCardSkeleton />}>
        <UserCard
          locale={locale}
          userPromise={userPromise}
        />
      </Suspense>
    </>
  )
}
