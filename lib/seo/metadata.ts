import type { Metadata } from 'next'

import { absoluteUrl } from './config'

type Image = {
  url: string
  width: number
  height: number
  alt: string
}
interface Props {
  title: string
  description: string
  path: string // The path segment (e.g., '/about'), without locale prefix
  locale: string
  images?: Image[]
}

export const createMetadata = ({
  title,
  description,
  path,
  locale,
  images = [
    {
      url: absoluteUrl('/sbornitsa.png'),
      width: 1200,
      height: 630,
      alt: 'Sbornitsa',
    },
  ],
}: Props): Metadata => {
  // Ensure path starts with / if not present (defensive)
  const safePath = path.startsWith('/') ? path : `/${path}`
  const pageUrl = absoluteUrl(`/${locale}${safePath}`)

  return {
    title, // Root layout template will add "Sbornitsa | "
    description,
    openGraph: {
      title: `Sbornitsa | ${title}`,
      description,
      url: pageUrl,
      siteName: 'Sbornitsa',
      images,
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Sbornitsa | ${title}`,
      description,
      images: images.map(i => i.url),
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        en: absoluteUrl(`/en${safePath}`),
        ru: absoluteUrl(`/ru${safePath}`),
      },
    },
  }
}
