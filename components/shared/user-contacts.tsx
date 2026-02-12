import Image from 'next/image'
import Link from 'next/link'

import type { Contacts } from '@/lib/definitions'

export default async function UserContacts({ value }: { value: Partial<Contacts> }) {
  return (
    <ul>
      {value.phone && (
        <li
          key="phone"
          className="flex items-center gap-2"
        >
          <Image
            src="/categories/phone.svg"
            alt="Phone"
            width={20}
            height={20}
          />
          <Link
            href={`tel:${value.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            {value.phone}
          </Link>
        </li>
      )}
      {value.telegram && (
        <li
          key="telegram"
          className="flex items-center gap-2"
        >
          <Image
            src="/categories/telegram.svg"
            alt="Telegram"
            width={20}
            height={20}
          />
          <Link
            href={`tg://resolve?domain=${value.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            {value.telegram}
          </Link>
        </li>
      )}
    </ul>
  )
}
