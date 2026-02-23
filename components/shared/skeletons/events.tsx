import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

export const EventSkeleton = () => (
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
export const EventsSkeleton = () => (
  <div className="space-y-4">
    <EventSkeleton />
    <EventSkeleton />
    <EventSkeleton />
    <EventSkeleton />
  </div>
)
