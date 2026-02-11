import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  output: 'export', // Enables static export
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
  trailingSlash: true, // Optional: Adds trailing slashes for cleaner URLs
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)

