import type { Family } from '@/lib/definitions'

export type CalcFn = (value: number, families: Family[]) => Record<Family['id'], number>

// считаем по семьям
export const familiesFn: CalcFn = (value: number, families: Family[]) => {
  const total = families.length
  return families.reduce(
    (r, family) => {
      r[family.id] = Math.ceil(value / total)
      return r
    },
    {} as Record<Family['id'], number>
  )
}

// считаем по детям
export const childrenFn: CalcFn = (value: number, families: Family[]) => {
  const total = families.reduce((r: number, f: Family) => r + f.children.length, 0)
  return families.reduce(
    (r, family) => {
      r[family.id] = Math.ceil((value * family.children.length) / total)
      return r
    },
    {} as Record<Family['id'], number>
  )
}

// считаем по детям с учетом веса
// если детей больше одного, то за каждого дополнительного ребенка добавляем по 0.5
export const relativeFn: CalcFn = (value: number, families: Family[]) => {
  const weights = families.reduce(
    (r, f) => {
      r[f.id] = (1 + f.children.length) >> 1
      return r
    },
    {} as Record<string, number>
  )

  const total = families.reduce((r: number, f: Family) => r + weights[f.id], 0)
  return families.reduce(
    (r, family) => {
      r[family.id] = Math.ceil((value * weights[family.id]) / total)
      return r
    },
    {} as Record<Family['id'], number>
  )
}
