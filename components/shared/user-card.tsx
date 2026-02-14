import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchFamilyById } from '@/lib/api'
import type { Family, User } from '@/lib/definitions'

import { Card } from '../ui/card'
import { fetchTranslations } from '../utils/fetch-translations'
import UserContacts from './user-contacts'
import { format } from '@/lib/tools/time'

export default async function UserCard({ locale, value }: { locale: 'ru' | 'en'; value: User }) {
  const t = await fetchTranslations({
    navigation: 'navigation',
    shared: 'shared',
  })

  if (!t) return notFound()
  let family: Family | undefined
  if (value.family) family = await fetchFamilyById(value.family)

  return (
    <>
      <Card className="gap-2">
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
        <div className="mb-2 block text-center text-sm font-medium text-foreground">
          {value.name}
        </div>
        <div className="mb-2 block text-center text-sm font-medium text-muted-foreground">
          {format(value.birthdate)}
        </div>
      </Card>
      {family && (
        <div className="mb-2 block text-center text-sm font-medium text-foreground mx-auto">
          <div className="mb-2 block text-center text-xl font-medium text-foreground capitalize">
            {t.shared('family')}
          </div>

          <Link href={`/${locale}/families/${family.id}`}>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Avatar
                  size="lg"
                  className="mb-2 mx-auto"
                >
                  <AvatarImage
                    src={family.avatar}
                    alt={`Avatar of ${family.id}`}
                  />
                  <AvatarFallback>{family.name[locale][0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium whitespace-nowrap">{family.name[locale]}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
      {value.contacts && (
        <section className="mx-auto">
          <div className="mb-2 block text-center text-xl font-medium text-foreground">Контакты</div>
          <UserContacts value={value.contacts} />
        </section>
      )}
    </>
  )
}
