import type { Metadata } from 'next'

import { absoluteUrl } from '@/lib/seo/config'

/**
 * Общий базовый объект метаданных для всего приложения.
 * Используется в корневом locale layout и authenticated layout.
 */
export function getBaseMetadata(): Metadata {
  const url = absoluteUrl('')

  return {
    metadataBase: new URL(url),
    title: {
      template: 'Sbornitsa | %s',
      default: 'Sbornitsa',
    },
    description: 'Application for sharing transactions',
    keywords: ['Sbornitsa', 'transactions', 'family finance'],
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
      description: 'Application for sharing transactions',
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
