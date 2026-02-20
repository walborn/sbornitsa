import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { AuthProvider } from '@/components/providers/auth-provider'
import { SchemaScript } from '@/components/seo/schema-script'
import { routing } from '@/i18n/routing'
import { absoluteUrl } from '@/lib/seo/config'
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seo/schema'

export async function generateMetadata(): Promise<Metadata> {
  const url = absoluteUrl('')

  return {
    metadataBase: new URL(url),
    title: {
      template: 'Sbornitsa | %s',
      default: 'Sbornitsa',
    },
    description: 'application for sharing transactions',
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
      description: 'application for sharing transactions',
      images: [
        {
          url: absoluteUrl('/metadata/apple-touch-icon-180x180.png'),
          width: 180,
          height: 180,
          alt: 'Sbornitsa',
        },
      ],
    },
    icons: {
      icon: absoluteUrl('/metadata/apple-touch-icon-180x180.png'),
      shortcut: absoluteUrl('/metadata/favicon.ico'),
      apple: absoluteUrl('/metadata/apple-touch-icon.png'),
    },
    manifest: absoluteUrl('/metadata/site.webmanifest'),
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

export default async function LocaleLayout({ children, params }: Props) {
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
    <>
      <SchemaScript
        id="organization-schema"
        schema={organizationSchema}
      />
      <SchemaScript
        id="website-schema"
        schema={websiteSchema}
      />
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>{children}</AuthProvider>
      </NextIntlClientProvider>
    </>
  )
}
