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

// 12 july
// • Платон - 15 января (25 лет)
// • Вероника - 4 мая (25 лет)
// • Левон - 10 июня (7 лет)

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
    contacts: {
      phone: '+79165320136',
      telegram: '@svetlana_vl_eremeeva',
    },
  },
  {
    id: 'ornella.zubkova',
    name: 'Орнелла Зубкова',
    family: 'yuzhakov',
    avatar: '/users/ornella.zubkova.webp',
    birthdate: new Date(1987, 2, 16),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
    contacts: {
      phone: '+79057417608',
      telegram: '@OrnellaZubkova',
    },
  },
  {
    id: 'boris.yuzhakov',
    name: 'Борис Южаков',
    family: 'yuzhakov',
    avatar: '/users/boris.yuzhakov.webp',
    birthdate: new Date(1986, 9, 29),
    role: 'admin',
    tags: createTags(['parents', 'mothers'] as const),
    contacts: {
      phone: '+79250579756',
      telegram: '@codebor',
    },
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
    birthdate: new Date(1900, 0, 1),
    role: 'user',
    tags: createTags(['parents', 'mothers'] as const),
  },
  {
    id: 'sofya.gerber',
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
    avatar: '/users/polina.leonenko.webp',
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
    birthdate: new Date(1900, 4, 4),
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
    birthdate: new Date(2020, 7, 18),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'vitya.cherny',
    name: 'Витя',
    family: 'cherny',
    avatar: '/users/vitya.cherny.webp',
    birthdate: new Date(2018, 4, 29),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'ivan.eremeev',
    name: 'Иван Еремеев', // Еремеев Иван Владиславович
    family: 'eremeev',
    avatar: '/users/ivan.eremeev.webp',
    birthdate: new Date(2018, 10, 26),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'vera.eremeeva',
    name: 'Вера Еремеева', // Еремеева Вера Владиславовна
    family: 'eremeev',
    avatar: '/users/vera.eremeeva.webp',
    birthdate: new Date(2021, 5, 5),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'meera.yuzhakova',
    name: 'Мира Южакова',
    family: 'yuzhakov',
    avatar: '/users/meera.yuzhakova.webp',
    birthdate: new Date(2020, 10, 6),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'mila.legoshina',
    name: 'Мила Легошина', // Легошина Мила Дмитриевна
    family: 'legoshin',
    avatar: '/users/mila.legoshina.webp',
    birthdate: new Date(2020, 7, 19),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'misha.novitskiy',
    name: 'Михаил Новицкий', // Новицкий Михаил Валерьевич
    family: 'novitskiy',
    avatar: '/users/misha.novitskiy.webp',
    birthdate: new Date(2020, 9, 20),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'anna.novitskaya',
    name: 'Анна Новицкая', // Новицкая Анна Валерьевна
    family: 'novitskiy',
    avatar: '/users/anna.novitskaya.webp',
    birthdate: new Date(2017, 9, 22),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'kirill.skvortsov',
    name: 'Кирилл Скворцов', // Скворцов Кирилл Алексеевич
    family: 'skvortsov',
    avatar: '/users/kirill.skvortsov.webp',
    birthdate: new Date(2021, 5, 13),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'agata.gerber',
    name: 'Агата Гербер', // Гербер Агата Денисовна
    family: 'gerber',
    avatar: '/users/agata.gerber.webp',
    birthdate: new Date(2019, 5, 20),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'platon.gerber',
    name: 'Платон Гербер', // Гербер Платон Денисович
    family: 'gerber',
    avatar: '/users/platon.gerber.webp',
    birthdate: new Date(201, 11, 2),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'emil.usarov',
    name: 'Эмиль Усаров', // Усаров Эмиль Джамалович
    family: 'usarov',
    avatar: '/users/emil.usarov.webp',
    birthdate: new Date(2018, 11, 8),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'aurora.fadeeva',
    name: 'Аврора Фадеева', // Фадеева Аврора Геннадьевна
    family: 'fadeev',
    avatar: '/users/aurora.fadeeva.webp',
    birthdate: new Date(2021, 5, 19),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'marusya.fadeeva',
    name: 'Маруся',
    family: 'fadeev',
    avatar: '/users/marusya.fadeeva.webp',
    birthdate: new Date(1900, 1, 1),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'varya.petrova',
    name: 'Варвара', // Петрова Варвара Денисовна
    family: 'petrov',
    avatar: '/users/varya.petrova.webp',
    birthdate: new Date(2019, 5, 26),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'igor.marshev',
    name: 'Игорь Маршев', // Маршев Игорь Евгеньевич
    family: 'marshev',
    avatar: '/users/igor.marshev.webp',
    birthdate: new Date(2021, 1, 2),
    role: 'user',
    tags: createTags(['children', 'sons'] as const),
  },
  {
    id: 'emilia.pimenova',
    name: 'Эмилия Пименова', // Пименова Эмилия Данииловна
    family: 'pimenov',
    avatar: '/users/emilia.pimenova.webp',
    birthdate: new Date(2020, 10, 16),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'emma.kirillova',
    name: 'Эмма Кириллова', // Кириллова Эмма Павловна
    family: 'kirillov',
    avatar: '/users/emma.kirillova.webp',
    birthdate: new Date(2021, 0, 31),
    role: 'user',
    tags: createTags(['children', 'daughters'] as const),
  },
  {
    id: 'aellita.leonenko',
    name: 'Аэлита Леоненко', // Леоненко Аэлита Вадимовна
    family: 'leonenko',
    avatar: '/users/aellita.leonenko.webp',
    birthdate: new Date(2021, 11, 31),
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
