import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const UserCardSkeleton = () => (
  <Card className="gap-2 animate-pulse p-4">
    <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
    <Skeleton className="h-4 w-32 mx-auto mb-2" />
    <Skeleton className="h-3 w-24 mx-auto" />
  </Card>
)
