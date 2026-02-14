import Link from 'next/link'

import { useTranslations } from 'next-intl'

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar'
import { fetchFamilies, getUserById } from '@/lib/api/users'
import type { Family, User } from '@/lib/definitions'

export async function generateStaticParams() {
  return await fetchFamilies()
}

interface Props {
  locale: string
  value: Family
}

export default function FamilyCard({ locale, value }: Props) {
  const mother = getUserById(value.mother)
  const father = value.father && getUserById(value.father)
  const children = value.children
    .map(getUserById)
    .filter((child): child is User => child !== undefined)

  const t = useTranslations('shared')

  return (
    <>
      {mother && (
        <section className="mb-10">
          <div className="mb-4 block text-center text-xl font-medium text-foreground capitalize">
            {t('mother')}
          </div>
          <Link href={`/${locale}/users/${mother.id}`}>
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
          </Link>
        </section>
      )}
      {father && (
        <section className="mb-10">
          <div className="mb-4 block text-center text-xl font-medium text-foreground capitalize">
            {t('father')}
          </div>

          <Link href={`/${locale}/users/${father.id}`}>
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
          </Link>
        </section>
      )}
      <section className="mb-10">
        <div className="mb-4 block text-center text-xl font-medium text-foreground capitalize">
          {t('children')}
        </div>
        {/* аватарки должны отображаться по центру */}
        <div className="mb-2 mx-auto flex items-center justify-center">
          <AvatarGroup className="grayscale-25">
            {children.map(child => {
              return (
                child && (
                  <Link
                    key={child.id}
                    href={`/${locale}/users/${child.id}`}
                  >
                    <Avatar>
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
                  </Link>
                )
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
