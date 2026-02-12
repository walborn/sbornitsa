import { families } from '@/lib/data'
import type { Family } from '@/lib/definitions'

export const fetchFamilyById = async (id: Family['id']) => families?.find(family => family.id === id)
export const fetchFamilies = async () => families

