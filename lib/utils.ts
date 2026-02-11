import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeHtmlTags(str: string) {
  return str?.replace(/<[^>]*>/g, '') || ''
}

type Identifiable = { id: string }

export function arrayToObjectById<const T extends Identifiable>(
  items: readonly T[]
): {
  [K in T['id']]: Extract<T, { id: K }>
} {
  const result = {} as any
  for (const item of items) {
    result[item.id] = item
  }
  return result
}
