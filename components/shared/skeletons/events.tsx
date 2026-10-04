import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

export const EventSkeleton = () => (
  <Card className={`relative overflow-hidden ${shimmer} border-none p-6 shadow-none`}>
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      </Avatar>
      <div className="flex-1">
        <div className="mb-2 h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mb-2 h-2 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mb-4 h-2 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-1.5 w-25 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="h-5 w-15 animate-pulse rounded bg-gray-200 font-normal whitespace-nowrap dark:bg-gray-800" />
    </div>
  </Card>
)
export const EventsSkeleton = () => (
  <div className="space-y-4">
    <EventSkeleton />
    <EventSkeleton />
    <EventSkeleton />
    <EventSkeleton />
  </div>
)
