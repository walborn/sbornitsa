import type { User } from '@/lib/schemas'

import type { UniqueArray, UnwrapSet } from './utilities'

type UserTag = UnwrapSet<User['tags']>

export const createTags = <T extends readonly UserTag[]>(a: T & UniqueArray<T>): Set<UserTag> =>
  new Set(a)
