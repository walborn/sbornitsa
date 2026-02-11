import { User, Wallet2 } from 'lucide-react'
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

import { AppSidebarFooter } from './footer'

const getItems = (t: (key: string) => string): Item[] => [
  {
    href: '/transactions',
    children: (
      <>
        <Wallet2 />
        {t('transactions')}
      </>
    ),
  },
  {
    href: '/users',
    children: (
      <>
        <User />
        {t('users')}
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
