import type { Category } from '@/lib/definitions'

export const categories: Category[] = [
  {
    id: 'english',
    name: 'english',
    description: 'english classes with Natalia',
    icon: '/categories/english.svg',
  },
  {
    id: 'music',
    name: 'music',
    description: 'music classes with Amira',
    icon: '/categories/music.svg',
  },
  {
    id: 'transfers',
    name: 'transfers',
    description: 'direct income/expenses',
    icon: '/categories/transfers.svg',
  },
  {
    id: 'supermarkets',
    name: 'supermarkets',
    description: 'supermarkets expenses',
    icon: '/categories/supermarkets.svg',
  },
  {
    id: 'gifts',
    name: 'gifts',
    description: 'gifts expenses',
    icon: '/categories/gifts.svg',
  },
]
