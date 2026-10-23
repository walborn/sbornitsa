import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { fetchTranslations } from '@/components/utils/fetch-translations'
import { fetchFamilies, fetchTransactionCategories } from '@/lib/api'
import { getUserById } from '@/lib/api/users'
import type {
  Family,
  FamilyTransaction,
  Transaction,
  TransactionCategory,
  User,
} from '@/lib/schemas'
import { format } from '@/lib/tools/time'
import { arrayToObjectById, cn } from '@/lib/utils'

interface Props {
  locale: 'ru' | 'en'
  transaction: Transaction
  shares: FamilyTransaction[]
}

const UserLink = ({ locale, user }: { locale: string; user: User }) => (
  <Link
    href={`/${locale}/users/${user.id}`}
    className="inline-flex items-center gap-2 hover:underline"
  >
    <Avatar size="sm">
      <AvatarImage
        src={user.avatar}
        alt={`Avatar of ${user.name}`}
      />
      <AvatarFallback>
        {user.name
          .split(' ')
          .map(name => name[0].toUpperCase())
          .join('')}
      </AvatarFallback>
    </Avatar>
    {user.name}
  </Link>
)

const Party = ({
  locale,
  label,
  party,
}: {
  locale: string
  label: string
  party: NonNullable<Transaction['target']>
}) => {
  const user = party.user && getUserById(party.user)
  return (
    <>
      <dt className="text-muted-foreground capitalize">{label}</dt>
      <dd>
        {user ? (
          <UserLink
            locale={locale}
            user={user}
          />
        ) : (
          party.name
        )}
        <div className="text-xs text-muted-foreground">
          {[party.bank, party.category].filter(Boolean).join(' · ')}
        </div>
        {party.message && <div className="text-xs text-muted-foreground">{party.message}</div>}
      </dd>
    </>
  )
}

export default async function TransactionDetails({ locale, transaction, shares }: Props) {
  const [familiesList, categoriesList, t] = await Promise.all([
    fetchFamilies(),
    fetchTransactionCategories(),
    fetchTranslations({
      shared: 'shared',
      transaction: 'pages.transaction',
    }),
  ])

  if (!t) return notFound()

  const families: Record<string, Family> = arrayToObjectById(familiesList)
  const categories: Record<string, TransactionCategory> = arrayToObjectById(categoriesList)

  const { name, description, value, timestamp, target, source } = transaction
  const category = categories[transaction.category]
  const teacher = transaction.teacher && getUserById(transaction.teacher)

  return (
    <>
      <Card className="gap-4 p-4">
        <div className="flex gap-4">
          <Image
            src={category.icon}
            className="h-10 w-10 flex-none rounded-full bg-gray-200"
            alt={category.name}
            width={40}
            height={40}
          />
          <div className="flex-1">
            <div className="text-lg font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
          <div className={cn('text-lg whitespace-nowrap', value > 0 && 'text-green-500')}>
            {value > 0 ? `+${value}` : value}
          </div>
        </div>

        <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground capitalize">{t.transaction('category')}</dt>
          <dd>{category.name}</dd>
          <dt className="text-muted-foreground capitalize">{t.transaction('date')}</dt>
          <dd>{format(timestamp)}</dd>
          {teacher && (
            <>
              <dt className="text-muted-foreground capitalize">{t.shared('teacher')}</dt>
              <dd>
                <UserLink
                  locale={locale}
                  user={teacher}
                />
              </dd>
            </>
          )}
          {target && (
            <Party
              locale={locale}
              label={t.transaction('target')}
              party={target}
            />
          )}
          {source && (
            <Party
              locale={locale}
              label={t.transaction('source')}
              party={source}
            />
          )}
        </dl>
      </Card>

      <section className="mt-4">
        <div className="mb-2 text-xl font-medium text-foreground capitalize">
          {t.transaction('distribution')}
        </div>
        <ul className="flex flex-col gap-4">
          {shares.map(({ family: familyId, value }) => {
            const family = families[familyId]
            const kids = (transaction.kids ?? [])
              .filter(kid => family.children.includes(kid))
              .map(getUserById)
              .filter((kid): kid is User => kid !== undefined)

            return (
              <li
                key={family.id}
                className="flex gap-4"
              >
                <Link href={`/${locale}/families/${family.id}`}>
                  <Avatar>
                    <AvatarImage
                      src={family.avatar}
                      alt={`Avatar of ${family.id}`}
                    />
                    <AvatarFallback>{family.name[locale][0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <Link
                    href={`/${locale}/families/${family.id}`}
                    className="text-sm hover:underline"
                  >
                    {family.name[locale]}
                  </Link>
                  {kids.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                      {kids.map(kid => (
                        <UserLink
                          key={kid.id}
                          locale={locale}
                          user={kid}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className={cn('whitespace-nowrap', value > 0 && 'text-green-500')}>
                    {value > 0 ? `+${value}` : value}
                  </div>
                  <div className="text-xs whitespace-nowrap text-muted-foreground">
                    {t.transaction('weight')} {transaction.families[familyId]}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
