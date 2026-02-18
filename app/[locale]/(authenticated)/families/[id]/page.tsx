import { Suspense } from 'react'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import FamilyCard from '@/components/shared/family-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchFamilies, fetchFamilyById } from '@/lib/api'
import type { Family } from '@/lib/schemas'
import { absoluteUrl } from '@/lib/seo/config'
import { createMetadata } from '@/lib/seo/metadata'

interface Props {
  params: Promise<{ locale: string; id: Family['id'] }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.families' })

  return createMetadata({
    title: t('title'),
    description: t('description'),
    path: `/${locale}/families`,
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
  return await fetchFamilies()
}

export default async function FamilyPage({ params }: Props) {
  const props = await params
  const { locale } = await params
  setRequestLocale(locale)

  const familyPromise = fetchFamilyById(props.id as Family['id'])

  const t = await fetchTranslations({
    navigation: 'navigation',
  })

  if (!t) return notFound()

  // We don't await family here to avoid blocking
  // But we need to handle 404 if family doesn't exist?
  // UserCard pattern handled it inside component or let it render null.
  // We can also just let Suspense handle it or await it inside component.

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={`/${locale}/families`}>{t.navigation('families')}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{props.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-gray-200 rounded-lg" />
            <div className="h-40 bg-gray-200 rounded-lg" />
          </div>
        }
      >
        <FamilyCard
          locale={locale}
          familyPromise={familyPromise}
        />
      </Suspense>
    </>
  )
}
