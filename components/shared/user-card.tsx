'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/lib/definitions'

export default function UserCard({ value }: { value: User }) {
  return (
    <>
      <Avatar
        size="lg"
        className="mx-auto"
      >
        <AvatarImage
          src={value.avatar}
          alt={`Avatar of ${value.name}`}
        />
        <AvatarFallback>
          {value.name
            .split(' ')
            .map(name => name[0].toUpperCase())
            .join('')}
        </AvatarFallback>
      </Avatar>
      <div className="mb-2 block text-center text-sm font-medium text-foreground">{value.name}</div>
    </>
  )
}
