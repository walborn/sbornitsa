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
  | 'sofya.gerber'
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
  | 'ivan.eremeev'
  | 'vera.eremeeva'
  | 'meera.yuzhakova'
  | 'mila.legoshina'
  | 'misha.novitskiy'
  | 'anna.novitskaya'
  | 'kirill.skvortsov'
  | 'agata.gerber'
  | 'platon.gerber'
  | 'emil.usarov'
  | 'aurora.fadeeva'
  | 'marusya.fadeeva'
  | 'varya.petrova'
  | 'igor.marshev'
  | 'emilia.pimenova'
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

export type Eremeevs = Extract<User['id'], 'ivan.eremeev' | 'vera.eremeeva'>[]
export type Pimenovs = Extract<User['id'], 'emilia.pimenova'>[]
export type Cherny = Extract<User['id'], 'nina.chernaya' | 'vitya.cherny'>[]
export type Novitsky = Extract<User['id'], 'anna.novitskaya' | 'misha.novitskiy'>[]
export type Legoshins = Extract<User['id'], 'mila.legoshina'>[]
export type Marshevs = Extract<User['id'], 'igor.marshev'>[]
export type Petrovs = Extract<User['id'], 'varya.petrova'>[]
export type Yuzhakovs = Extract<User['id'], 'meera.yuzhakova'>[]
export type Fadeevs = Extract<User['id'], 'aurora.fadeeva' | 'marusya.fadeeva'>[]
export type Gerbers = Extract<User['id'], 'agata.gerber' | 'platon.gerber'>[]
export type Skvortsovs = Extract<User['id'], 'kirill.skvortsov'>[]
export type Kirillovs = Extract<User['id'], 'emma.kirillova'>[]
export type Usarovs = Extract<User['id'], 'emil.usarov'>[]
export type Leonenkos = Extract<User['id'], 'aellita.leonenko'>[]

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
  user?: User['id']
}

export type TransactionSource = {
  bank?: string
  name?: string
  message?: string
}

export type FamiliesIncomes = Record<Family['id'], number>

export type Transaction = {
  id: string
  name: string
  description: string
  value: number
  category: Category['id']
  families: FamiliesIncomes
  timestamp: number // ms from 1900
  teacher?: User['id']
  target?: TransactionTarget
  source?: TransactionSource
}

export type FamilyTransaction = {
  // id: string
  family: Family['id']
  transaction: Transaction['id']
  // description: string
  value: number
  // category: Category['id']
  // teacher?: User['id']
  // target?: TransactionTarget
  // source?: TransactionSource
}
