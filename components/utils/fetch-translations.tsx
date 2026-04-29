import { getTranslations } from 'next-intl/server'

export const fetchTranslations = async (translations: Record<string, string>) => {
  try {
    const res = await Promise.all(Object.values(translations).map(getTranslations))
    return Object.fromEntries(Object.keys(translations).map((key, index) => [key, res[index]]))
  } catch (error) {
    console.error(error)
  }
}
