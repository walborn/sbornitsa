'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export type Item = {
  href: string
  children: React.ReactNode
}

interface Props {
  items: Item[]
  locale: string
}
export function AppSidebarItems({ items, locale }: Props) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map(item => {
        const href = `/${locale}${item.href}`
        const isActive = pathname === href || (item.href !== '/' && pathname.startsWith(href))

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
            >
              <Link href={href}>{item.children}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
