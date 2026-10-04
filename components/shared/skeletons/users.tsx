import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const UserCardSkeleton = () => (
  <Card className="animate-pulse gap-2 p-4">
    <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full" />
    <Skeleton className="mx-auto mb-2 h-4 w-32" />
    <Skeleton className="mx-auto h-3 w-24" />
  </Card>
)
