1. Сделать метадаты для всех страниц
2. Локализовать метадаты для всех страниц
export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
  }
}

