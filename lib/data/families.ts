import type { Family } from '@/lib/definitions'
import { arrayToObjectById } from '@/lib/utils'

import familiesData from './families-generated.json'

export class Families {
  private families: Family[] = familiesData as Family[]

  dic(): Record<Family['id'], Family> {
    return arrayToObjectById(this.families)
  }

  update_values(values: Record<Family['id'], number>) {
    this.families = this.families.map(family => ({
      ...family,
      value: values[family.id] ?? family.value,
    }))
    return this.families
  }

  set(families: Family[]) {
    this.families = families
  }

  get(): Family[] {
    return this.families
  }

  getById(id: Family['id']): Family | undefined {
    return this.families.find(u => u.id === id)
  }

  all() {
    return this.families.map(u => u.id)
  }

  except(ids: Family['id'][]) {
    return this.all().filter((i: Family['id']) => !ids.includes(i))
  }
}
