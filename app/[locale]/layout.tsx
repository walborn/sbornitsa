import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'

import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { AuthGuard } from '@/components/auth/auth-guard'
import { AppHeader } from '@/components/layout/app-header'
import { AppHeaderProvider } from '@/components/layout/app-header-provider'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { SchemaScript } from '@/components/seo/schema-script'
import { LocaleToggle } from '@/components/shared/locale-toggle'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/seo/config'
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seo/schema'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const url = absoluteUrl('')

  return {
    metadataBase: new URL(url),
    title: {
      template: 'Sbornitsa | %s',
      default: 'Sbornitsa',
    },
    description: 'Sbornitsa page description',
    keywords: ['Sbornitsa', 'laboratory equipment', 'scientific instruments', 'particle synthesis'],
    authors: [{ name: 'Sbornitsa' }],
    creator: 'Sbornitsa',
    publisher: 'Sbornitsa',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en',
      alternateLocale: ['ru'],
      url,
      siteName: 'Sbornitsa',
      title: 'Sbornitsa',
      description: 'Sbornitsa page description',
      images: [
        {
          url: absoluteUrl('/sbornitsa.png'),
          width: 1200,
          height: 630,
          alt: 'Sbornitsa',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sbornitsa',
      description: 'Sbornitsa page description',
      images: [absoluteUrl('/sbornitsa.png')],
    },
    icons: {
      icon: absoluteUrl('/icon.png'),
      shortcut: absoluteUrl('/favicon.ico'),
      apple: absoluteUrl('/apple-touch-icon.png'),
    },
    manifest: absoluteUrl('/site.webmanifest'),
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE || '',
      yandex: process.env.YANDEX_VERIFICATION_CODE || '',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
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

  const messages = await getMessages()

  const organizationSchema = createOrganizationSchema(locale)
  const websiteSchema = createWebsiteSchema(locale)

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <SchemaScript
          id="organization-schema"
          schema={organizationSchema}
        />
        <SchemaScript
          id="website-schema"
          schema={websiteSchema}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <AuthGuard>
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
                      <div className="flex flex-1 flex-col gap-4 p-4 w-full max-w-240 m-auto">
                        {children}
                      </div>
                    </SidebarInset>
                  </SidebarProvider>
                </AppHeaderProvider>
              </AuthGuard>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
