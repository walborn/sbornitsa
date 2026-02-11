import { categories } from '@/lib/data'
import type { Category } from '@/lib/definitions'

export const fetchCategories = async (): Promise<Category[]> => {
  return categories
}
