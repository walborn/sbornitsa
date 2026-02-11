'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

import { useLocale } from 'next-intl'

import { Button } from '@/components/ui/button'

export function LocaleToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en'
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleChange}
      className="cursor-pointer text-xl"
    >
      {locale === 'ru' ? (
        <Image
          src="/shared/ru.svg"
          alt="RU"
          width={20}
          height={20}
          priority
        />
      ) : (
        <Image
          src="/shared/us.svg"
          alt="EN"
          width={20}
          height={20}
          priority
        />
      )}
    </Button>
  )
}
