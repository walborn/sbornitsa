'use client'

import Link from 'next/link'

import { ChevronsUpDownIcon } from 'lucide-react'
import { useLocale } from 'next-intl'

import { useAuth } from '@/components/providers/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { usersDic } from '@/lib/data'

type Locale = 'ru' | 'en'

export function AppSidebarFooter() {
  const locale = useLocale() as Locale
  const { family, logout } = useAuth()

  if (!family) return null

  const mother = usersDic[family.mother]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
        >
          <Avatar>
            <AvatarImage
              src={family.avatar}
              alt={family.id}
            />
            <AvatarFallback className="rounded-lg">{family.id[0]}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{family.name[locale]}</span>
            <span className="truncate text-xs">{family.id}</span>
          </div>
          <ChevronsUpDownIcon />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <Item size="xs">
              <ItemMedia>
                <Avatar>
                  <AvatarImage
                    src={family.avatar}
                    alt={family.id}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{family.name[locale]}</ItemTitle>
                <ItemDescription> {family.id}</ItemDescription>
              </ItemContent>
            </Item>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/profile`}>Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
