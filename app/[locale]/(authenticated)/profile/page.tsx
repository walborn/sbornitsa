import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { SchemaScript } from '@/components/seo/schema-script'
import Profile from '@/components/shared/profile'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { absoluteUrl } from '@/lib/seo/config'
import { createMetadata } from '@/lib/seo/metadata'
import { createBreadcrumbSchema } from '@/lib/seo/schema'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.profile' })

  return createMetadata({
    title: t('title'),
    description: t('description'),
    path: `/${locale}/profile`,
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

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await fetchTranslations({
    page: 'pages.profile',
    navigation: 'navigation',
  })

  if (!t) return notFound()

  const breadcrumbSchema = createBreadcrumbSchema(locale, [
    { name: t.navigation('profile'), path: '/profile' },
  ])

  return (
    <>
      <SchemaScript
        id="breadcrumb-schema"
        schema={breadcrumbSchema}
      />
      <AppHeader>{t.navigation('profile')}</AppHeader>
      <section>
        <Profile locale={locale} />
      </section>
    </>
  )
}
