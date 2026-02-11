import type { User } from '@/lib/definitions'

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
    id: 'anastasia-chernaya',
    name: 'Анастасия Черная',
    avatar: '/users/anastasia.chernaya.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'svetlana-eremeeva',
    name: 'Светлана Еремеева',
    avatar: '/users/svetlana.eremeeva.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'ornella-zubkova',
    name: 'Орнелла Зубкова',
    avatar: '/users/ornella.zubkova.webp',
    birthdate: new Date(1987, 2, 16),
  },
  {
    id: 'boris-yuzhakov',
    name: 'Борис Южаков',
    avatar: '/users/boris.yuzhakov.webp',
    birthdate: new Date(1986, 9, 29),
  },
  {
    id: 'maria-legoshina',
    name: 'Мария Легошина',
    avatar: '/users/maria.legoshina.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'natasha-novitskaya',
    name: 'Наташа Новицкая',
    avatar: '/users/natasha.novitskaya.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'olga-skvortsova',
    name: 'Ольга Скворцова',
    avatar: '/users/olga.skvortsova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'sofya-gerber',
    name: 'Софья Гербер',
    avatar: '/users/sofya.gerber.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'maria-usarova',
    name: 'Мария И. Усарова',
    avatar: '/users/maria.usarova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'nadezhda-fadeeva',
    name: 'Надежда Фадеева',
    avatar: '/users/nadezhda.fadeeva.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'anastasia-marsheva',
    name: 'Анастасия Маршева',
    avatar: '/users/anastasia.marsheva.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'ksenya-petrova',
    name: 'Ксения Петрова',
    avatar: '/users/ksenya.petrova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'polina-leonenko',
    name: 'Полина Леоненко',
    avatar: '/users/polina.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'alexandra-pimenova',
    name: 'Александра Пименова',
    avatar: '/users/aleksandra.pimenova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'olga-kirillova',
    name: 'Ольга Кириллова',
    avatar: '/users/olga.kirillova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'natalya-m',
    name: 'Наталья М.',
    avatar: '/users/natalya.m.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'amira-h',
    name: 'Амира Х.',
    avatar: '/users/amira.h.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'veronika-zolotareva',
    name: 'Вероника Золотарёва',
    avatar: '/users/veronika.zolotareva.webp',
    birthdate: new Date(1900, 1, 1),
  },
]

const children: User[] = [
  {
    id: 'nina.chernaya',
    name: 'Нина',
    avatar: '/users/nina.chernaya.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'vitya.cherny',
    name: 'Витя',
    avatar: '/users/vitya.cherny.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'vanya.eremeev',
    name: 'Ваня',
    avatar: '/users/vanya.eremeev.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'vera.eremeeva',
    name: 'Вера',
    avatar: '/users/vera.eremeeva.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'meera.yuzhakova',
    name: 'Мира',
    avatar: '/users/meera.yuzhakova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'mila.legoshina',
    name: 'Мила',
    avatar: '/users/mila.legoshina.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'misha.novitskiy',
    name: 'Миша',
    avatar: '/users/misha.novitskiy.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'anna.novitskaya',
    name: 'Анна',
    avatar: '/users/anna.novitskaya.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'kirill.skvortsov',
    name: 'Кирилл',
    avatar: '/users/kirill.skvortsov.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'agata.gerber',
    name: 'Агата',
    avatar: '/users/agata.gerber.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'platon.gerber',
    name: 'Платон',
    avatar: '/users/platon.gerber.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'emik.usarov',
    name: 'Эмик',
    avatar: '/users/emik.usarov.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'avrora.fadeeva',
    name: 'Аврора',
    avatar: '/users/avrora.fadeeva.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'varya.petrova',
    name: 'Варя',
    avatar: '/users/varya.petrova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'igor.marshev',
    name: 'Игорь',
    avatar: '/users/igor.marshev.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'emma.kirillova',
    name: 'Эмма',
    avatar: '/users/emma.kirillova.webp',
    birthdate: new Date(1900, 1, 1),
  },
  {
    id: 'aellita.polina',
    name: 'Аэлита',
    avatar: '/users/aellita.polina.webp',
    birthdate: new Date(1900, 1, 1),
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
