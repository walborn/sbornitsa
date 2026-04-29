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
          className="rounded-full bg-gray-200 w-8 h-8 flex-none"
          alt={icon.alt}
          width={32}
          height={32}
        />
        <div className="flex-1">
          <div className="text-sm">{name}</div>
          <div className="text-gray-500 text-xs">{description}</div>
          <div className="text-gray-500 text-xs pb-2">{[...categories].join(', ')}</div>
          <div className="text-gray-500 text-xs">{format(start)}</div>
          <div className="text-gray-500 text-xs">{days} дн.</div>
        </div>
      </div>
    )
  }
  if (end - start < 24 * 60 * 60 * 1000) {
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
          <div className="text-gray-500 text-xs pb-2">{[...categories].join(', ')}</div>
          <div className="text-gray-500 text-xs">{formatTime(start)}</div>
          <div className="text-gray-500 text-xs">{formatTimeDuration(end - start)}</div>
        </div>
      </div>
    )
  }
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
        <div className="text-gray-500 text-xs pb-2">{[...categories].join(', ')}</div>
        <div className="text-gray-500 text-xs">{formatTime(start)}</div>
        <div className="text-gray-500 text-xs">{formatTime(end)}</div>
      </div>
    </div>
  )
}
