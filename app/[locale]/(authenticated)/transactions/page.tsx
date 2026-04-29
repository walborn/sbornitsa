import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import Balance from '@/components/shared/balance'
import { BalanceSkeleton, TransactionsSkeleton } from '@/components/shared/skeletons/transactions'
import TransactionsList from '@/components/shared/transactions-list'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchTransactionCategories, fetchTransactions } from '@/lib/api'
import { fetchFamilyTransactions } from '@/lib/api/transactions'
import { createMetadata } from '@/lib/seo/metadata'
import { arrayToObjectById } from '@/lib/utils'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'navigation' })

  return createMetadata({
    title: t('transactions'),
    description: t('transactions'),
    path: '/transactions',
    locale,
  })
}

export default async function TransactionsPage({ params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await fetchTranslations({
    transactions: 'pages.transactions',
    shared: 'shared',
    navigation: 'navigation',
  })

  if (!t) return notFound()

  const transactionsPromise = fetchTransactions().then(arrayToObjectById)
  const familyTransactionsPromise = fetchFamilyTransactions()
  const transactionCategoriesPromise = fetchTransactionCategories().then(arrayToObjectById)

  return (
    <>
      <AppHeader>{t.navigation('transactions')}</AppHeader>

      <Suspense fallback={<BalanceSkeleton />}>
        <Balance familyTransactionsPromise={familyTransactionsPromise} />
      </Suspense>

      <section className="flex flex-col gap-4 mt-4">
        <Suspense fallback={<TransactionsSkeleton />}>
          <TransactionsList
            transactionsPromise={transactionsPromise}
            familyTransactionsPromise={familyTransactionsPromise}
            transactionCategoriesPromise={transactionCategoriesPromise}
          />
        </Suspense>
      </section>
    </>
  )
}
