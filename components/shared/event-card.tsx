import Image from 'next/image'

import type { Event } from '@/lib/schemas'
import { format, formatTime, formatTimeDuration } from '@/lib/tools/time'

interface Props {
  name: string
  description: string
  categories: Event['categories']
  start: Event['start']
  end: Event['end']
  icon: { src: string; alt: string }
}

// type - whole day, some days, interval
// interval: { type: 'day', }
// d
export const EventCard = ({ name, description, categories, start, end, icon }: Props) => {
  // если ровно сутки, то
  // если целое количество дней
  if ((end - start) % (24 * 60 * 60 * 1000) === 0) {
    const days = (end - start) / (24 * 60 * 60 * 1000)
    return (
      <div className="flex gap-4">
        <Image
          src={icon.src}
          className="h-8 w-8 flex-none rounded-full bg-gray-200"
          alt={icon.alt}
          width={32}
          height={32}
        />
        <div className="flex-1">
          <div className="text-sm">{name}</div>
          <div className="text-xs text-gray-500">{description}</div>
          <div className="pb-2 text-xs text-gray-500">{[...categories].join(', ')}</div>
          <div className="text-xs text-gray-500">{format(start)}</div>
          <div className="text-xs text-gray-500">{days} дн.</div>
        </div>
      </div>
    )
  }
  if (end - start < 24 * 60 * 60 * 1000) {
    return (
      <div className="flex gap-4">
        <Image
          src={icon.src}
          className="h-8 w-8 flex-none rounded-full bg-gray-200"
          alt={icon.alt}
          width={32}
          height={32}
        />
        <div className="flex-1">
          <div className="text-sm">{name}</div>
          <div className="text-xs text-gray-500">{description}</div>
          <div className="pb-2 text-xs text-gray-500">{[...categories].join(', ')}</div>
          <div className="text-xs text-gray-500">{formatTime(start)}</div>
          <div className="text-xs text-gray-500">{formatTimeDuration(end - start)}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex gap-4">
      <Image
        src={icon.src}
        className="h-8 w-8 flex-none rounded-full bg-gray-200"
        alt={icon.alt}
        width={32}
        height={32}
      />
      <div className="flex-1">
        <div className="text-sm">{name}</div>
        <div className="text-xs text-gray-500">{description}</div>
        <div className="pb-2 text-xs text-gray-500">{[...categories].join(', ')}</div>
        <div className="text-xs text-gray-500">{formatTime(start)}</div>
        <div className="text-xs text-gray-500">{formatTime(end)}</div>
      </div>
    </div>
  )
}
