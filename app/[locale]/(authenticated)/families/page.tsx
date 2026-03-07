import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchFamilies, fetchTransactions } from '@/lib/api'
import { fetchFamilyTransactions } from '@/lib/api/transactions'
import { absoluteUrl } from '@/lib/seo/config'
import { createMetadata } from '@/lib/seo/metadata'
import Balance from './balance'
import { Families } from '@/lib/data'
import { Family } from '@/lib/schemas'

interface Props {
  params: Promise<{ locale: string }>
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

export default async function FamiliesPage({
  params,
}: {
  params: Promise<{ locale: 'ru' | 'en' }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await fetchTranslations({
    navigation: 'navigation',
  })

  if (!t) return notFound()
  const families = await fetchFamilies()
  const familyTransactions = await fetchFamilyTransactions()

  const balance: Map<Family['id'], number> = new Map(families.map(({ id }) => [id, 0]))

  for (const { family, value } of familyTransactions) {
    balance.set(family, (balance.get(family) || 0) + value)
  }

  return (
    <>
      <AppHeader>{t.navigation('families')}</AppHeader>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {families.map(family => (
          <li key={family.id}>
            <Link href={`/${locale}/families/${family.id}`}>
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Avatar
                    size="lg"
                    className="mb-2 mx-auto"
                  >
                    <AvatarImage
                      src={family.avatar}
                      alt={`Avatar of ${family.id}`}
                    />
                    <AvatarFallback>{family.name[locale][0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium whitespace-nowrap">{family.name[locale]}</p>
                    <p className="text-sm font-medium whitespace-nowrap text-gray-400">
                      <Balance value={balance.get(family.id) || 0} />
                    </p>
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
