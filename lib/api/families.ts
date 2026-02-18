import type { Family } from '@/lib/schemas'
import { familiesRepo } from '@/lib/repositories.instance'

export const fetchFamilyById = async (id: Family['id']) => familiesRepo.findById(id)
export const fetchFamilies = async () => familiesRepo.findAll()
