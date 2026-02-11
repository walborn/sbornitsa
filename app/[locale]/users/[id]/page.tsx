import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AppHeader } from '@/components/utils/app-header'

import UserCard from '@/components/shared/user-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchUserById, fetchUsers } from '@/lib/api'
import type { User } from '@/lib/definitions'
import { absoluteUrl } from '@/lib/seo/config'
import { createMetadata } from '@/lib/seo/metadata'
import { createBreadcrumbSchema } from '@/lib/seo/schema'
import Link from 'next/link'

interface Props {
  params: Promise<{ locale: string; id: User['id'] }>
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

  const user = await fetchUserById(props.id as User['id'])

  const t = await fetchTranslations({
    navigation: 'navigation',
  })

  if (!t) return notFound()
  if (!user) notFound()

  return (
    <>
     {/* <AppHeader>asdfsd</AppHeader> */}
      <AppHeader>
       <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/users`}>
                <Link href={`/${locale}/users`}>{t.navigation('users')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <UserCard value={user} />
    </>
  )
}
