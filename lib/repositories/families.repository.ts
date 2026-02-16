/**
 * Repository Pattern для Families
 *
 * Централизованный доступ к семьям с оптимизацией через Map
 */

import type { Family, FamilyId, UserId } from '@/lib/schemas'

export class FamiliesRepository {
  private readonly familiesById: Map<FamilyId, Family>

  constructor(families: Family[]) {
    this.familiesById = new Map(families.map(f => [f.id, f]))
  }

  /**
   * Получить семью по ID
   * Complexity: O(1)
   */
  findById(id: FamilyId): Family | undefined {
    return this.familiesById.get(id)
  }

  /**
   * Получить все семьи
   */
  findAll(): Family[] {
    return Array.from(this.familiesById.values())
  }

  /**
   * Получить семью по ID матери
   */
  findByMother(motherId: UserId): Family | undefined {
    return this.findAll().find(f => f.mother === motherId)
  }

  /**
   * Получить семью по ID отца
   */
  findByFather(fatherId: UserId): Family | undefined {
    return this.findAll().find(f => f.father === fatherId)
  }

  /**
   * Получить семью по ID ребенка
   */
  findByChild(childId: UserId): Family | undefined {
    return this.findAll().find(f => f.children.includes(childId))
  }

  /**
   * Получить семьи с положительным балансом
   */
  findWithPositiveBalance(): Family[] {
    return this.findAll().filter(f => f.value > 0)
  }

  /**
   * Получить семьи с отрицательным балансом
   */
  findWithNegativeBalance(): Family[] {
    return this.findAll().filter(f => f.value < 0)
  }

  /**
   * Получить общий баланс всех семей
   */
  getTotalBalance(): number {
    return this.findAll().reduce((sum, f) => sum + f.value, 0)
  }

  /**
   * Получить количество семей
   */
  count(): number {
    return this.familiesById.size
  }

  /**
   * Проверить существование семьи
   */
  exists(id: FamilyId): boolean {
    return this.familiesById.has(id)
  }
}
