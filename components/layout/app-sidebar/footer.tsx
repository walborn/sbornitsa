'use client'

import Link from 'next/link'

import { ChevronsUpDownIcon } from 'lucide-react'

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
import { useLocale } from 'next-intl'

export function AppSidebarFooter() {
  const locale = useLocale()
  const { user, logout } = useAuth()

  if (!user) return null

  const mother = usersDic[user.mother]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
        >
          <Avatar>
            <AvatarImage
              src={mother?.avatar}
              alt={mother?.id}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{mother?.name}</span>
            <span className="truncate text-xs">{user?.id}</span>
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
                    src={mother?.avatar}
                    alt={mother?.id}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{usersDic[user?.mother]?.name}</ItemTitle>
                <ItemDescription> {user?.mother}</ItemDescription>
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
