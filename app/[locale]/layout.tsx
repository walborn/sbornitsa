import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { AuthProvider } from '@/components/providers/auth-provider'
import { SchemaScript } from '@/components/seo/schema-script'
import { routing } from '@/i18n/routing'
import { createOrganizationSchema, createWebsiteSchema } from '@/lib/seo/schema'
import { getBaseMetadata } from '@/lib/seo/shared-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return getBaseMetadata()
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
