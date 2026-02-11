'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useLocale } from 'next-intl'

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function AppSidebarHeader() {
  const locale = useLocale()

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            asChild
          >
            <Link href={`/${locale}`}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md p-2">
                <Image
                  // className="invsert"
                  src="/metadata/apple-touch-icon.png"
                  alt="Logo image"
                  width={24}
                  height={24}
                  priority
                />
              </div>
              <div>Sbornitsa</div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}
