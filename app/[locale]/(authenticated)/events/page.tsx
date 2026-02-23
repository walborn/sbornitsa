import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import EventsList from '@/components/shared/events-list'
import { EventsSkeleton } from '@/components/shared/skeletons/events'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchEvents } from '@/lib/api'
import { createMetadata } from '@/lib/seo/metadata'
import { arrayToObjectById } from '@/lib/utils'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'navigation' })

  return createMetadata({
    title: t('events'),
    description: t('events'),
    path: '/events',
    locale,
  })
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await fetchTranslations({
    events: 'pages.events',
    shared: 'shared',
    navigation: 'navigation',
  })

  if (!t) return notFound()

  const eventsPromise = fetchEvents().then(arrayToObjectById)

  return (
    <>
      <AppHeader>{t.navigation('events')}</AppHeader>

      <section className="flex flex-col gap-4 mt-4">
        <Suspense fallback={<EventsSkeleton />}>
          <EventsList eventsPromise={eventsPromise} />
        </Suspense>
      </section>
    </>
  )
}
