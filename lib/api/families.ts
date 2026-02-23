import { familiesRepo } from '@/lib/repositories'
import type { Family } from '@/lib/schemas'

export const fetchFamilyById = async (id: Family['id']) => familiesRepo.findById(id)
export const fetchFamilies = async () => familiesRepo.findAll()
