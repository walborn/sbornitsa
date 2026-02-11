'use client'

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar'
import { getFamily } from '@/lib/auth'
import { users } from '@/lib/data'
import type { Family, User } from '@/lib/definitions'

export default function Profile() {
  const family: Family = getFamily()

  const mother = users.find(user => user.id === family.mother)
  const father = users.find(user => user.id === family.father)
  const children = family.children
    .map(childId => users.find(user => user.id === childId))
    .filter((user): user is User => !!user)

  return (
    <>
      {mother && (
        <section className="mb-10">
          <div className="mb-4 block text-center text-xl font-medium text-foreground">Мама</div>
          <Avatar
            size="lg"
            className="mb-2 mx-auto"
          >
            <AvatarImage
              src={mother.avatar}
              alt={`Avatar of ${mother.name}`}
            />
            <AvatarFallback>
              {mother.name
                .split(' ')
                .map(name => name[0].toUpperCase())
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="mb-2 block text-center text-sm font-medium text-foreground">
            {mother.name}
          </div>
        </section>
      )}
      {father && (
        <section className="mb-10">
          <div className="mb-4 block text-center text-xl font-medium text-foreground">Папа</div>
          <Avatar
            size="lg"
            className="mb-2 mx-auto"
          >
            <AvatarImage
              src={father.avatar}
              alt={`Avatar of ${father.name}`}
            />
            <AvatarFallback>
              {father.name
                .split(' ')
                .map(name => name[0].toUpperCase())
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="mb-2 block text-center text-sm font-medium text-foreground">
            {father.name}
          </div>
        </section>
      )}
      <section className="mb-10">
        <div className="mb-4 block text-center text-xl font-medium text-foreground">Дети</div>
        {/* аватарки должны отображаться по центру */}
        <div className="mb-2 mx-auto flex items-center justify-center">
          <AvatarGroup className="grayscale">
            {children.map(child => {
              return (
                <Avatar key={child.id}>
                  <AvatarImage
                    src={child.avatar}
                    alt={`Avatar of ${child.name}`}
                  />
                  <AvatarFallback>
                    {child.name
                      .split(' ')
                      .map((i: string) => i[0].toUpperCase())
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              )
            })}
          </AvatarGroup>
        </div>
        <div className="mb-2 block text-center text-sm font-medium text-foreground">
          {children.map(child => child.name).join(', ')}
        </div>
      </section>
    </>
  )
}
