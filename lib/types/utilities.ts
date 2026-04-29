/**
 * Утилита для создания Set тегов с проверкой уникальности
 */
export type UniqueArray<T extends readonly unknown[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends Rest[number]
    ? never
    : readonly [First, ...UniqueArray<Rest>]
  : T

export type UnwrapSet<T> = T extends Set<infer U> ? U : never
