import Link from 'next/link'
import { notFound } from 'next/navigation'

import { setRequestLocale } from 'next-intl/server'

import TransactionDetails from '@/components/shared/transaction-details'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AppHeader } from '@/components/utils/app-header'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchTransactionById, fetchTransactions } from '@/lib/api'
import { fetchFamilyTransactions } from '@/lib/api/transactions'
import type { Transaction } from '@/lib/schemas'
import { createMetadata } from '@/lib/seo/metadata'

interface Props {
  params: Promise<{ locale: 'ru' | 'en'; id: Transaction['id'] }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params
  const transaction = await fetchTransactionById(id)

  return createMetadata({
    title: transaction?.name ?? id,
    description: transaction?.description ?? id,
    path: `/transactions/${id}`,
    locale,
  })
}

export async function generateStaticParams() {
  const transactions = await fetchTransactions()
  return transactions.map(({ id }) => ({ id }))
}

export default async function TransactionPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const t = await fetchTranslations({
    navigation: 'navigation',
  })

  const transaction = await fetchTransactionById(id)

  if (!(t && transaction)) return notFound()

  const shares = (await fetchFamilyTransactions()).filter(share => share.transaction === id)

  return (
    <>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href={`/${locale}/transactions`}>{t.navigation('transactions')}</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{transaction.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <TransactionDetails
        locale={locale}
        transaction={transaction}
        shares={shares}
      />
    </>
  )
}
