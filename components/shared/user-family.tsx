import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchFamilyById } from '@/lib/api'
import type { Family } from '@/lib/schemas'

interface Props {
  familyId: Family['id']
  locale: 'ru' | 'en'
}

export default async function UserFamily({ familyId, locale }: Props) {
  const family = await fetchFamilyById(familyId)

  // Also fetch shared translations for "Family" label
  const t = await fetchTranslations({
    shared: 'shared',
  })

  if (!(family && t)) return null

  return (
    <div className="mx-auto mb-2 block text-center text-sm font-medium text-foreground">
      <div className="mb-2 block text-center text-xl font-medium text-foreground capitalize">
        {t.shared('family')}
      </div>

      <Link href={`/${locale}/families/${family.id}`}>
        <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <div className="mx-auto flex items-center gap-2">
            <Avatar
              size="lg"
              className="mb-2"
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
  )
}
