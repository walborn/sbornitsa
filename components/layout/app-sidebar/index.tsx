import Image from 'next/image'

import { getLocale, getTranslations } from 'next-intl/server'

import { AppSidebarHeader } from '@/components/layout/app-sidebar/header'
import { AppSidebarItems, type Item } from '@/components/layout/app-sidebar/items'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import transactionsIcon from '@/public/categories/transactions.svg'
import familiesIcon from '@/public/categories/tree3.svg'
import usersIcon from '@/public/categories/users4.svg'

import { AppSidebarFooter } from './footer'

const getItems = (t: (key: string) => string): Item[] => [
  {
    href: '/transactions',
    children: (
      <>
        <Image
          priority
          src={transactionsIcon}
          width={24}
          height={24}
          alt="transactions"
        />
        {t('transactions')}
      </>
    ),
  },
  {
    href: '/users',
    children: (
      <>
        <Image
          priority
          src={usersIcon}
          width={24}
          height={24}
          alt="users"
        />
        {t('users')}
      </>
    ),
  },
  {
    href: '/families',
    children: (
      <>
        <Image
          priority
          src={familiesIcon}
          width={24}
          height={24}
          alt="families"
        />
        {t('families')}
      </>
    ),
  },
]

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = await getLocale()
  const t = await getTranslations('navigation')
  const items = getItems(t)

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <AppSidebarItems
              items={items}
              locale={locale}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <AppSidebarFooter />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
