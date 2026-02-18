import { categories } from '@/lib/data'
import type { Category } from '@/lib/schemas'

export const fetchCategories = async (): Promise<Category[]> => {
  return categories
}
