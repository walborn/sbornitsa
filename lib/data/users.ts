import type { User } from '@/lib/definitions'
import { createTags } from '@/lib/definitions'

import { Families } from './families'
import { familyTransactions } from './transactions'

// const children = [
//   'Нина', // Анастасия Черная
//   'Витя', // Анастасия Черная
//   'Ваня', // Светлана Еремеева
//   'Вера', // Светлана Еремеева
//   'Мира', // Орнелла Зубкова
//   'Мила', // Мария Легошина
//   'Миша', // Наташа Новицкая
//   'Анна', // Наташа Новицкая
//   'Кирилл', // Ольга Скворцова
//   'Агата', // Софья Гербер
//   'Эмик', // Мария И. Усарова
//   'Аврора', // Надежда Фадеева
//   'Варя', // Ксения Петрова
//   'Игорь', // Анастасия Маршева
//   'Эмма', // Александра Пименова
//   'Эмма', // Ольга Кириллова
//   'Аэлита', // Полина
// ]

// посчитаем баланс каждого пользователя, чтоб актуализировать для пользователй
const values: Record<string, number> = {}

for (const { family, value } of familyTransactions) {
  values[family] = (values[family] ?? 0) + value
}

export const users: User[] = [
  {
    id: 'anastasia.chernaya',
    name: 'Анастасия Черная',
    family: 'cherny',
    avatar: '/users/anastasia.chernaya.webp',
    birthdate: new Date(1900, 8, 14),
    contacts: {
      phone: '+79032816327',
      telegram: '@ChernayaAnastasia',
    },
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'svetlana.eremeeva',
    name: 'Светлана Еремеева',
    family: 'eremeev',
    avatar: '/users/svetlana.eremeeva.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'ornella.zubkova',
    name: 'Орнелла Зубкова',
    family: 'yuzhakov',
    avatar: '/users/ornella.zubkova.webp',
    birthdate: new Date(1987, 2, 16),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'boris.yuzhakov',
    name: 'Борис Южаков',
    family: 'yuzhakov',
    avatar: '/users/boris.yuzhakov.webp',
    birthdate: new Date(1986, 9, 29),
    role: 'admin',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'maria.legoshina',
    name: 'Мария Легошина',
    family: 'legoshin',
    avatar: '/users/maria.legoshina.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'natasha.novitskaya',
    name: 'Наташа Новицкая',
    family: 'novitskiy',
    contacts: {
      telegram: '@ergerda',
      phone: '+79163173224',
    },
    avatar: '/users/natasha.novitskaya.webp',
    birthdate: new Date(1983, 1, 22),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'olga.skvortsova',
    name: 'Ольга Скворцова',
    family: 'skvortsov',
    avatar: '/users/olga.skvortsova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'sofya-gerber',
    name: 'Софья Гербер',
    family: 'gerber',
    avatar: '/users/sofya.gerber.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'maria.usarova',
    name: 'Мария И. Усарова',
    family: 'usarov',
    avatar: '/users/maria.usarova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'nadezhda.fadeeva',
    name: 'Надежда Фадеева',
    family: 'fadeev',
    avatar: '/users/nadezhda.fadeeva.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'anastasia.marsheva',
    name: 'Анастасия Маршева',
    family: 'marshev',
    avatar: '/users/anastasia.marsheva.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'ksenya.petrova',
    name: 'Ксения Петрова',
    family: 'petrov',
    avatar: '/users/ksenya.petrova.webp',
    birthdate: new Date(1900, 1, 1),
    contacts: {
      phone: '+79104873947',
      telegram: '@Ksenya_Petrova_psy',
    },
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'polina.leonenko',
    name: 'Полина Леоненко',
    family: 'leonenko',
    avatar: '/users/polina.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'alexandra.pimenova',
    name: 'Александра Пименова',
    family: 'pimenov',
    avatar: '/users/aleksandra.pimenova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'olga.kirillova',
    name: 'Ольга Кириллова',
    family: 'kirillov',
    avatar: '/users/olga.kirillova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'natalya.m',
    name: 'Наталья М.',
    avatar: '/users/natalya.m.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'amira.h',
    name: 'Амира Х.',
    avatar: '/users/amira.h.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'veronika.zolotareva',
    name: 'Вероника Золотарёва',
    avatar: '/users/veronika.zolotareva.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
]

const children: User[] = [
  {
    id: 'nina.chernaya',
    name: 'Нина',
    family: 'cherny',
    avatar: '/users/nina.chernaya.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'vitya.cherny',
    name: 'Витя',
    family: 'cherny',
    avatar: '/users/vitya.cherny.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'vanya.eremeev',
    name: 'Ваня',
    family: 'eremeev',
    avatar: '/users/vanya.eremeev.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'vera.eremeeva',
    name: 'Вера',
    family: 'eremeev',
    avatar: '/users/vera.eremeeva.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'meera.yuzhakova',
    name: 'Мира',
    family: 'yuzhakov',
    avatar: '/users/meera.yuzhakova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'mila.legoshina',
    name: 'Мила',
    family: 'legoshin',
    avatar: '/users/mila.legoshina.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'misha.novitskiy',
    name: 'Миша',
    family: 'novitskiy',
    avatar: '/users/misha.novitskiy.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'anna.novitskaya',
    name: 'Анна',
    family: 'novitskiy',
    avatar: '/users/anna.novitskaya.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'kirill.skvortsov',
    name: 'Кирилл',
    family: 'skvortsov',
    avatar: '/users/kirill.skvortsov.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'agata.gerber',
    name: 'Агата',
    family: 'gerber',
    avatar: '/users/agata.gerber.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'platon.gerber',
    name: 'Платон',
    family: 'gerber',
    avatar: '/users/platon.gerber.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'emik.usarov',
    name: 'Эмик',
    family: 'usarov',
    avatar: '/users/emik.usarov.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'avrora.fadeeva',
    name: 'Аврора',
    family: 'fadeev',
    avatar: '/users/avrora.fadeeva.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'varya.petrova',
    name: 'Варя',
    family: 'petrov',
    avatar: '/users/varya.petrova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'igor.marshev',
    name: 'Игорь',
    family: 'marshev',
    avatar: '/users/igor.marshev.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'emma.pimenova',
    name: 'Эмма',
    family: 'pimenov',
    avatar: '/users/emma.pimenova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'emma.kirillova',
    name: 'Эмма',
    family: 'kirillov',
    avatar: '/users/emma.kirillova.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'aellita.leonenko',
    name: 'Аэлита',
    family: 'leonenko',
    avatar: '/users/aellita.leonenko.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
]

users.push(...children)

const usersDic = users.reduce(
  (acc, user) => {
    acc[user.id] = user
    return acc
  },
  {} as Record<string, User>
)

const f = new Families()
const families = f.update_values(values)
const familiesDic = f.dic()

export { families, familiesDic, usersDic }
