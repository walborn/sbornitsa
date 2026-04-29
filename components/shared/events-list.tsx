'use client'

import { use } from 'react'

import { EventCard } from '@/components/shared/event-card'
import type { Event } from '@/lib/schemas'

interface Props {
  eventsPromise: Promise<Record<Event['id'], Event>>
}

export default function EventsList({ eventsPromise }: Props) {
  const events = use(eventsPromise)

  return (
    <div className="flex flex-col gap-4">
      {Object.values(events).map(({ id, name, categories, description, start, end, icon }) => {
        return (
          <EventCard
            key={id}
            name={name}
            description={description}
            categories={categories}
            start={start}
            end={end}
            icon={{ src: icon, alt: name }}
          />
        )
      })}
    </div>
  )
}
