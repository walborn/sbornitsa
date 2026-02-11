import Image from 'next/image'

import { format } from '@/lib/tools/time'
import { cn } from '@/lib/utils'

interface Props {
  icon: { src: string; alt: string }
  name: string
  description: string
  category: string
  value: number
  timestamp: Date
}

export const TransactionCard = ({ icon, name, description, category, timestamp, value }: Props) => {
  return (
    <div className="flex gap-4">
      <Image
        src={icon.src}
        className="rounded-full bg-gray-200 w-8 h-8 flex-none"
        alt={icon.alt}
        width={32}
        height={32}
      />
      <div className="flex-1">
        <div className="text-sm">{name}</div>
        <div className="text-gray-500 text-xs">{description}</div>
        <div className="text-gray-500 text-xs pb-2">{category}</div>
        <div className="text-gray-500 text-xs">{format(timestamp)}</div>
      </div>
      <div
        className={cn(
          'font-normal whitespace-nowrap',
          value > 0 && 'text-green-500',
        )}
      >
        {value > 0 ? `+${value}` : value}
      </div>
    </div>
  )
}
