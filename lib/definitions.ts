import type { CalcFn } from './tools/calc'

type UserId =
  // mothers
  | 'alexandra.pimenova'
  | 'svetlana.eremeeva'
  | 'maria.legoshina'
  | 'anastasia.marsheva'
  | 'ksenya.petrova'
  | 'nadezhda.fadeeva'
  | 'natasha.novitskaya'
  | 'sofya-gerber'
  | 'olga.skvortsova'
  | 'olga.kirillova'
  | 'maria.usarova'
  | 'anastasia.chernaya'
  | 'ornella.zubkova'
  | 'boris.yuzhakov'
  | 'polina.leonenko'
  // teachers
  | 'veronika.zolotareva'
  | 'amira.h'
  | 'natalya.m'
  // children
  | 'nina.chernaya'
  | 'vitya.cherny'
  | 'vanya.eremeev'
  | 'vera.eremeeva'
  | 'meera.yuzhakova'
  | 'mila.legoshina'
  | 'misha.novitskiy'
  | 'anna.novitskaya'
  | 'kirill.skvortsov'
  | 'agata.gerber'
  | 'platon.gerber'
  | 'emik.usarov'
  | 'avrora.fadeeva'
  | 'varya.petrova'
  | 'igor.marshev'
  | 'emma.pimenova'
  | 'emma.kirillova'
  | 'aellita.leonenko'

export type UserTag =
  | 'teachers'
  // parents
  | 'parents'
  | 'mothers'
  | 'fathers'
  // children
  | 'children'
  | 'daughters'
  | 'sons'

type UniqueArray<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends Rest[number]
    ? never
    : readonly [First, ...UniqueArray<Rest>]
  : T

export const createTags = <T extends readonly UserTag[]>(a: T & UniqueArray<T>): Set<UserTag> =>
  new Set(a)

export type Contacts = {
  phone: string
  telegram: string
}
export type User = {
  id: UserId // name-surname
  name: string // для отображения имени пользователя
  family?: FamilyId // для определения семьи
  birthdate: Date // для календаря дней рождения
  avatar: string // для отображения аватарки
  contacts?: Partial<Contacts>
  role: 'user' | 'manager' | 'admin'
  tags: Set<UserTag>
}

type FamilyId =
  | 'pimenov'
  | 'eremeev'
  | 'legoshin'
  | 'marshev'
  | 'petrov'
  | 'fadeev'
  | 'novitskiy'
  | 'gerber'
  | 'skvortsov'
  | 'kirillov'
  | 'usarov'
  | 'cherny'
  | 'yuzhakov'
  | 'leonenko'

export type Family = {
  id: FamilyId
  name: {
    ru: string
    en: string
  }
  mother: User['id']
  father?: User['id']
  children: User['id'][]
  value: number // баланс пользователя
  password: string // пароль для входа
  avatar?: string // для отображения аватарки
}

export type Category = {
  id: 'music' | 'english' | 'transfers' | 'supermarkets' | 'gifts'
  name: string
  description: string
  icon: string
}

export type TransactionTarget = {
  bank?: string
  name?: string
  message?: string
  category?: string
}

export type TransactionSource = {
  bank?: string
  name?: string
  message?: string
}

export type Transaction = {
  id: string
  name: string
  description: string
  value: number
  category: Category['id']
  families: Family['id'][]
  timestamp: Date
  calc?: CalcFn
  teacher?: User['id']
  target?: TransactionTarget
  source?: TransactionSource
}

export type FamilyTransaction = {
  // id: string
  family: Family['id']
  transaction: Transaction['id']
  // timestamp: Date
  // description: string
  value: number
  // category: Category['id']
  // teacher?: User['id']
  // target?: TransactionTarget
  // source?: TransactionSource
}
