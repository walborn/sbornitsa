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
import type { Family } from '@/lib/definitions'
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

  const family = await fetchFamilyById(props.id as Family['id'])

  const t = await fetchTranslations({
    navigation: 'navigation',
  })

  if (!t) return notFound()
  if (!family) notFound()

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
              <BreadcrumbPage>{family.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <FamilyCard
        locale={locale}
        value={family}
      />
    </>
  )
}
