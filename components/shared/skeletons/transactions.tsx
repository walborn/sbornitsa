import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

export const TransactionSkeleton = () => (
  <Card className={`relative overflow-hidden ${shimmer} p-6 border-none shadow-none`}>
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </Avatar>
      <div className="flex-1">
        <div className="rounded mb-2 h-4 w-1/4 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="rounded mb-2 h-2 w-2/3 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="rounded mb-4 h-2 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="rounded h-1.5 w-25 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
      <div className="rounded h-5 w-15 font-normal whitespace-nowrap bg-gray-200 dark:bg-gray-800 animate-pulse" />
    </div>
  </Card>
)
export const TransactionsSkeleton = () => (
  <div className="space-y-4">
    <TransactionSkeleton />
    <TransactionSkeleton />
    <TransactionSkeleton />
    <TransactionSkeleton />
  </div>
)

export const BalanceSkeleton = () => {
  const t = useTranslations('shared')
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize mb-2">{t('balance')}</CardTitle>
        <CardDescription className="text-2xl">
          <div className="rounded h-6 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
