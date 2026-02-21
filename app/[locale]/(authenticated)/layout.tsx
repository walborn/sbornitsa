import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { AppHeader } from '@/components/layout/app-header'
import { AppHeaderProvider } from '@/components/layout/app-header-provider'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AuthProvider } from '@/components/providers/auth-provider'
import { LocaleToggle } from '@/components/shared/locale-toggle'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { routing } from '@/i18n/routing'
import { getBaseMetadata } from '@/lib/seo/shared-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return getBaseMetadata()
}

export const generateStaticParams = () => routing.locales.map(locale => ({ locale }))

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <AuthProvider>
      <AppHeaderProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b pl-4 pr-[10px] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4"
              />
              <AppHeader />
              <div className="flex ml-auto gap-2">
                <LocaleToggle />
                <ThemeToggle />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 w-full max-w-240 m-auto">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </AppHeaderProvider>
    </AuthProvider>
  )
}
