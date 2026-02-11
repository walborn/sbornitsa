import type { CalcFn } from './tools/calc'

type UserId =
  // mothers
  | 'alexandra-pimenova'
  | 'svetlana-eremeeva'
  | 'maria-legoshina'
  | 'anastasia-marsheva'
  | 'ksenya-petrova'
  | 'nadezhda-fadeeva'
  | 'natasha-novitskaya'
  | 'sofya-gerber'
  | 'olga-skvortsova'
  | 'olga-kirillova'
  | 'maria-usarova'
  | 'anastasia-chernaya'
  | 'ornella-zubkova'
  | 'boris-yuzhakov'
  | 'polina-leonenko'
  // teachers
  | 'amira-h'
  | 'veronika-zolotareva'
  | 'natalya-m'
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
  | 'emma.kirillova'
  | 'aellita.polina'

export type User = {
  id: UserId // name-surname
  name: string // для отображения имени пользователя
  birthdate: Date // для календаря дней рождения
  avatar: string // для отображения аватарки
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
  | 'polina-family'

export type Family = {
  id: FamilyId
  mother: User['id']
  father?: User['id']
  children: string[]
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

// export type UserTransaction = {
//   id: string // transaction.id + user.id
//   transaction: string // transaction.id
//   user: string // user.id
//   value: number // изменение баланса пользователя в рамках этой транзакции
// }

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
