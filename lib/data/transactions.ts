// Эмма Кириллова (olga.kirillova)
// появилась 17.09.2025 - до этого ее не нужно учитывать в тратах (исключать из all-users)
// ходит только на музыку

import type {
  Category,
  Family,
  FamilyTransaction,
  Transaction,
  TransactionSource,
  TransactionTarget,
  User,
} from '@/lib/definitions'
import { type CalcFn, childrenFn, familiesFn, relativeFn } from '@/lib/tools/calc'

import { Families } from './families'

const families = new Families()

type RawTransaction = {
  name: string
  description: string
  value: number
  category: Category['id']
  teacher?: User['id']
  time: string
  calc?: CalcFn
  families: Family['id'][]
  target?: TransactionTarget
  source?: TransactionSource
}

const english = (transaction: Partial<RawTransaction> = {}): RawTransaction => ({
  value: -2000,
  name: 'English',
  description: 'Оплата занятий по английскому',
  teacher: 'natalya.m',
  time: '11:00',
  families: families.all(),
  calc: relativeFn,
  target: {
    bank: 'Sber',
    name: 'Наталья М.',
  },
  // верхние можно перезаписать
  ...transaction,
  // эти свойства нельзя перезаписывать
  category: 'english',
})

const music = (transaction: Partial<RawTransaction> = {}): RawTransaction => ({
  // эти свойства можно перезаписать
  value: -2000,
  name: 'Music',
  description: 'Оплата занятий по музыке',
  teacher: 'amira.h',
  time: '11:00',
  families: families.all(),
  calc: relativeFn,
  target: {
    bank: 'Sber',
    name: 'Амира Х.',
  },
  // перезаписываем и дополняем
  ...transaction,
  // эти свойства нельзя перезаписывать
  category: 'music',
})

const transfers = (
  trasaction: Omit<RawTransaction, 'description' | 'category' | 'calc'> & {
    description?: string
    calc?: CalcFn
  }
): RawTransaction => {
  if (trasaction.families.length !== 1) {
    throw new Error('Транзакция должна быть только у одной семьи')
  }
  const family = families.getById(trasaction.families[0])
  if (!family) {
    throw new Error('Семья не найдена')
  }
  return {
    description: `Пополнение кошелька: ${family.id}`,
    calc: familiesFn,
    ...trasaction,
    category: 'transfers',
  }
}

const gifts = (
  trasaction: Omit<RawTransaction, 'category' | 'families' | 'calc'> & {
    families?: Family['id'][]
    calc?: CalcFn
  }
): RawTransaction => {
  return {
    families: families.all(),
    calc: relativeFn,
    ...trasaction,
    category: 'gifts',
  }
}

const supermarkets = (
  trasaction: Omit<RawTransaction, 'category' | 'families' | 'calc'> & {
    families?: Family['id'][]
    calc?: CalcFn
  }
): RawTransaction => {
  return {
    families: families.all(),
    calc: childrenFn,
    ...trasaction,
    category: 'supermarkets',
  }
}

const rawTransactions: [string, RawTransaction][] = [
  [
    '04.02.2026',
    transfers({
      name: 'Софья Г.',
      value: 5000,
      families: ['gerber'],
      time: '21:34',
      source: {
        bank: 'Sber',
        name: 'Софья Г.',
      },
    }),
  ],
  ['30.01.2026', english()],
  ['28.01.2026', english()],
  [
    '27.01.2026',
    transfers({
      value: 8000,
      name: 'Светлана Е.',
      families: ['eremeev'],
      time: '11:45',
      source: {
        bank: 'Alfa',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '26.01.2026',
    transfers({
      name: 'Надежда Ф.',
      value: 5000,
      families: ['fadeev'],
      time: '14:05',
      source: {
        bank: 'Sber',
        name: 'Надежда Ф.',
        message: 'Авро',
      },
    }),
  ],
  ['23.01.2026', english()],
  ['21.01.2026', english()],
  ['16.01.2026', english()],
  [
    '16.01.2026',
    transfers({
      value: 10000,
      name: 'Ксения Д.',
      families: ['petrov'],
      time: '13:06',
      source: {
        bank: 'VTB',
        name: 'Ксения Д.',
      },
    }),
  ],
  ['14.01.2026', english()],
  ['26.12.2025', english()],
  [
    '26.12.2025',
    gifts({
      value: -9000,
      name: 'Подарки: Музыка и Английский',
      time: '21:51',
      families: families.except(['yuzhakov']),
      description: 'Новогодние подарки Амире и Наташе',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  ['23.12.2025', music()],
  [
    '23.12.2025',
    gifts({
      value: -3521,
      name: 'Новогодние расходы',
      time: '6:17',
      families: families.except(['yuzhakov']),
      description: 'Новогодние расходы (Надежда Фадеева)',
      target: {
        bank: 'Tbank',
        name: 'Надежда Ф.',
        message: 'НГ расходы',
      },
    }),
  ],
  [
    '22.12.2025',
    transfers({
      value: 5000,
      name: 'Дмитрий Л.',
      families: ['legoshin'],
      time: '23:03',
      source: {
        bank: 'Tbank',
        name: 'Дмитрий Л.',
      },
    }),
  ],
  [
    '22.12.2025',
    gifts({
      value: -2800,
      name: 'Новогодние расходы',
      time: '21:00',
      families: families.except(['yuzhakov']),
      description: 'Новогодние расходы (Наташа Новицкая)',
      target: {
        bank: 'Tbank',
        name: 'Наталья Н.',
        message: 'НГ расходы',
      },
    }),
  ],
  [
    '22.12.2025',
    gifts({
      value: -7000,
      name: 'Новогодние расходы',
      time: '20:53',
      families: families.except(['yuzhakov']),
      description: 'Новогодние расходы (Светлана Еремеева)',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
        message: 'НГ расходы',
      },
    }),
  ],
  [
    '20.12.2025',
    gifts({
      value: -7268,
      name: 'Новогодние расходы',
      time: '17:51',
      families: families.except(['yuzhakov']),
      description: 'Еда для новогоднего квеста (Софья Гербер)',
      target: {
        bank: 'Sber',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '20.12.2025',
    gifts({
      value: -1700,
      name: 'Новогодние расходы',
      time: '17:57',
      families: families.except(['yuzhakov']),
      description: 'Фотографии для НГ квеста (Софья Гербер)',
      target: {
        bank: 'Sber',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '20.12.2025',
    transfers({
      value: 5000,
      name: 'Софья Г.',
      families: ['gerber'],
      time: '17:57',
      source: {
        bank: 'Tbank',
        name: 'Софья Г.',
      },
    }),
  ],
  ['19.12.2025', english()],
  [
    '18.12.2025',
    gifts({
      value: -13000,
      name: 'Подарок Веронике',
      time: '16:15',
      description: '1к с семьи',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  ['17.12.2025', english()],
  ['15.12.2025', music()],
  [
    '14.12.2025',
    transfers({
      value: 5000,
      name: 'Ольга С.',
      families: ['skvortsov'],
      time: '14:57',
      source: {
        bank: 'Raiffeisen',
        name: 'Ольга С.',
      },
    }),
  ],
  ['12.12.2025', english()],
  ['11.12.2025', music()],
  ['10.12.2025', english()],
  [
    '08.12.2025',
    supermarkets({
      value: -1400,
      time: '13:47',
      name: 'Расходники',
      families: families.except(['yuzhakov']),
      description: 'Украшение на ёлку и в квартиру (Вероника Золотарёва)',
      target: {
        bank: 'Tbank',
        name: 'Вероника Золотарёва',
      },
    }),
  ],
  [
    '08.12.2025',
    transfers({
      value: 5000,
      name: 'Надежда Ф.',
      families: ['fadeev'],
      time: '10:30',
      source: {
        bank: 'Tbank',
        name: 'Надежда Ф.',
      },
    }),
  ],
  [
    '06.12.2025',
    transfers({
      value: 10000,
      name: 'Наталья Н.',
      families: ['novitskiy'],
      time: '13:35',
      source: {
        bank: 'Tbank',
        name: 'Наталья Н.',
      },
    }),
  ],
  [
    '06.12.2025',
    transfers({
      value: 10000,
      name: 'Анастасия М.',
      families: ['marshev'],
      time: '13:33',
      source: {
        bank: 'Tbank',
        name: 'Анастасия М.',
      },
    }),
  ],
  [
    '05.12.2025',
    transfers({
      value: 5000,
      name: 'Ольга К.',
      families: ['kirillov'],
      time: '16:02',
      source: {
        bank: 'Sber',
        name: 'Ольга К.',
      },
    }),
  ],
  [
    '05.12.2025',
    transfers({
      value: 5000,
      name: 'Денис П.',
      families: ['petrov'],
      time: '15:28',
      source: {
        bank: 'Tbank',
        name: 'Денис П.',
      },
    }),
  ],
  [
    '05.12.2025',
    transfers({
      value: 8000,
      name: 'Светлана Е.',
      families: ['eremeev'],
      time: '11:55',
      source: {
        bank: 'Sber',
        name: 'Светлана Е.',
        message: 'Ваня и Вера пополам',
      },
    }),
  ],
  [
    '04.12.2025',
    transfers({
      value: 5000,
      name: 'Мария И.',
      families: ['usarov'],
      time: '10:31',
      source: {
        bank: 'Sber',
        name: 'Мария И.',
      },
    }),
  ],
  ['04.12.2025', music()],
  ['03.12.2025', english()],
  ['02.12.2025', music()],
  ['28.11.2025', english()],
  ['26.11.2025', english()],
  ['25.11.2025', music()],
  [
    '21.11.2025',
    supermarkets({
      value: -2391,
      name: 'Праздник гномиков',
      time: '18:30',
      description: 'Еда для праздника гномиков (Софья Гербер)',
      target: {
        bank: 'Sber',
        name: 'Софья Гербер',
      },
    }),
  ],
  ['21.11.2025', english()],
  ['20.11.2025', music()],
  ['19.11.2025', english()],
  [
    '18.11.2025',
    gifts({
      value: -3635,
      name: 'Праздник гномиков',
      // tag: 'gnoms',
      time: '02:45',
      description: 'Праздник гномиков (Светлана Еремеева)',
      target: {
        bank: 'Tbank',
        name: 'Светлана Еремеева',
      },
    }),
  ],
  [
    '18.11.2025',
    gifts({
      value: -1600,
      name: 'Праздник гномиков',
      time: '02:44',
      description: 'Праздник гномиков (Вероника Золотарёва)',
      target: {
        bank: 'Alfa',
        name: 'Вероника Золотарёва',
      },
    }),
  ],
  ['14.11.2025', english()],
  ['12.11.2025', english()],
  ['11.11.2025', music()],
  ['10.11.2025', music()],
  ['07.11.2025', english()],
  ['06.11.2025', music()],
  ['05.11.2025', english()],
  [
    '25.10.2025',
    transfers({
      value: -5795,
      name: 'Анастасия Ч.',
      families: ['cherny'],
      time: '19:23',
      description: 'Возврат остатка Анастасии Черной',
    }),
  ],
  [
    '23.10.2025',
    transfers({
      value: 1555,
      name: 'Дмитрий Л.',
      families: ['legoshin'],
      time: '18:54',
      description: 'Пополнение кошелька Марии Легошиной',
      source: {
        bank: 'Tbank',
        name: 'Дмитрий Л.',
      },
    }),
  ],
  [
    '17.10.2025',
    supermarkets({
      value: -2929,
      name: 'Расходники',
      time: '20:33',
      description: 'Пирамидки для занятий и пастель (Светлана Еремеева)',
      target: {
        bank: 'Tbank',
        name: 'Светлана Еремеева',
      },
    }),
  ],
  ['17.10.2025', english()],
  ['15.10.2025', english()],
  ['09.10.2025', english()],
  ['07.10.2025', music()],
  [
    '06.10.2025',
    gifts({
      value: -5300,
      name: 'День учителя',
      time: '20:28',
      description: 'Амире М. ко Дню учителя',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '06.10.2025',
    gifts({
      value: -5300,
      name: 'День учителя',
      time: '20:28',
      description: 'Наташе М. ко Дню учителя',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '03.10.2025',
    supermarkets({
      value: -2500,
      name: 'Еда',
      time: '14:33',
      description: 'Овощи и стаканы',
      // tag: 'food',
      target: {
        bank: 'Tbank',
        name: 'Платон Г.',
      },
    }),
  ],
  ['01.10.2025', english()],
  ['30.09.2025', music()],
  [
    '27.09.2025',
    gifts({
      value: -15000,
      name: 'День воспитателя',
      time: '12:21',
      description: 'Поздравление Вероники с днем воспитателя',
      target: {
        bank: 'Alfa',
        name: 'Вероника Золотарёва',
      },
    }),
  ],
  [
    '26.09.2025',
    transfers({
      value: 5000,
      name: 'Софья Г.',
      families: ['gerber'],
      time: '14:34',
      target: {
        bank: 'Sovcombank',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '25.09.2025',
    supermarkets({
      value: -425,
      time: '12:21',
      name: 'Расходники',
      description: 'Канцелярские товары',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  ['24.09.2025', english()],
  ['22.09.2025', music()],
  ['19.09.2025', english()],
  [
    '18.09.2025',
    transfers({
      value: 2000,
      name: 'Светлана Е.',
      families: ['eremeev'],
      time: '16:55',
      source: {
        bank: 'Alfa',
        name: 'Светлана Е.',
        message: '2 на Ванин, 1 на Верин',
      },
    }),
  ],

  [
    '18.09.2025',
    transfers({
      value: 1000,
      name: 'Ольга С.',
      families: ['skvortsov'],
      time: '14:57',
      source: {
        bank: 'Alfa',
        name: 'Ольга С.',
        message: 'За Скворцова Федю (тетради)',
      },
    }),
  ],
  ['18.09.2025', english()],
  // Федя (Ольга Скворцова)
  // Ваня (Светлана Еремеева)
  // Вари (Ксения Петрова)
  // Агата (Софья Гербер)
  // Платон (Софья Гербер)
  // Аня (Наташа Новицкая)
  // Эмик (Мария И.)
  [
    '18.09.2025',
    supermarkets({
      value: -7000,
      time: '13:26',
      name: 'Расходники',
      // calc simple
      families: [
        'skvortsov', // Федя
        'eremeev', // Ваня
        'petrov', // Варя
        'gerber', // Агата
        'gerber', // Платон
        'novitskiy', // Аня
        'usarov', // Эмик
      ],
      description: '7 тетрадей по 1к',
      target: {
        category: 'Books - МСС 2741',
        name: 'ИП Кривоноженкова А. С.',
      },
    }),
  ],
  [
    '17.09.2025',
    transfers({
      value: 5000,
      name: 'Ольга К.',
      families: ['kirillov'],
      time: '21:10',
      description: 'Пополнение кошелька Ольги Кирилловой',
      source: {
        bank: 'Sber',
        name: 'Ольга К.',
        message: 'За Эмму Кириллову (дет. сад)',
      },
    }),
  ],
  ['15.09.2025', music()],
  [
    '12.09.2025',
    english({
      families: families.except(['kirillov']),
    }),
  ],
  [
    '10.09.2025',
    english({
      families: families.except(['kirillov']),
    }),
  ],
  [
    '09.09.2025',
    transfers({
      value: 10000,
      name: 'Анастасия М.',
      families: ['marshev'],
      time: '22:28',
      description: 'Пополнение кошелька Анастасии Маршевой',
      source: {
        bank: 'Tbank',
        name: 'Анастасия М.',
      },
    }),
  ],
  [
    '05.09.2025',
    english({
      families: families.except(['kirillov']),
    }),
  ],
  // - 04.09.2025: music (без olga.kirillova)
  //   - users:
  //     - natasha.novitskaya <!-- 273 -->
  //       - Миша
  //       - Аня
  //     - svetlana.eremeeva <!-- 273 -->
  //       - Вера
  //       - Ваня
  //     - sofya-gerber <!-- 182 -->
  //       - Агата
  //     - ksenya.petrova <!-- 182 -->
  //       - Варя
  //     - maria.legoshina <!-- 182 -->
  //       - Мила
  //     - maria.usarova <!-- 182 -->
  //       - Нина
  //     - olga.skvortsova <!-- 182 -->
  //       - Кирилл
  //     - ornella.zubkova <!-- 182 -->
  //       - Мира
  //     - polina.leonenko <!-- 182 -->
  //       - Аэлита
  //     - anastasia.marsheva <!-- 182 -->
  //       - Игорь
  [
    '04.09.2025',
    music({
      families: families.except(['kirillov']),
    }),
  ],
  [
    '03.09.2025',
    english({
      families: families.except(['kirillov']),
    }),
  ],
  [
    '03.09.2025',
    transfers({
      value: 6000,
      name: 'Светлана Е.',
      families: ['eremeev'],
      time: '16:40',
      description: 'Пополнение кошелька Светланы Еремеевой',
      source: {
        bank: 'Alfa',
        name: 'Светлана Е.',
      },
    }),
  ],
  // На сентябрь у нас будет так:
  // Всего детей 14

  // На музыку ходят все 14. Занятия один раз в неделю.
  // Но Мила и Эмик ходят из двух недель на одно занятие. То есть мы возьмём за период 2 недели.
  // 14 детей.
  // Из них одну неделю ходят 13 и вторую 13.
  // На английский не ходит Аэлита, но ходит Аня. Детей 14.
  // Занятия два раза в неделю.

  // Все дети ходят два раза, один ребёнок (Мила) ходит один раз.
  // Аня и Миша считаются с коэффициентом 1.5. Цена за Аню ложится на Мишу в учёте.
  [
    '01.09.2025',
    transfers({
      value: 10000,
      name: 'Дмитрий Л.',
      families: ['legoshin'],
      time: '15:00',
      description: 'Пополнение кошелька Марии Легошиной',
      source: {
        bank: 'Tbank',
        name: 'Дмитрий Л.',
      },
    }),
  ],
  [
    '31.08.2025',
    transfers({
      value: 10000,
      name: 'Ольга С.',
      families: ['skvortsov'],
      time: '15:47',
      description: 'Пополнение кошелька Ольги Скворцовой',
      source: {
        bank: 'Raiffeisen',
        name: 'Ольга С.',
        message: 'Детский сад за Кирилла Скворцова',
      },
    }),
  ],
  [
    '31.08.2025',
    transfers({
      value: 15000,
      name: 'Наталия Н.',
      families: ['novitskiy'],
      time: '13:59',
      description: 'Пополнение кошелька Наташи Новицкой',
      source: {
        bank: 'Tbank',
        name: 'Наталия Н.',
      },
    }),
  ],
  [
    '31.08.2025',
    transfers({
      value: 3000,
      name: 'Надежда Ф.',
      families: ['fadeev'],
      time: '12:30',
      description: 'Пополнение кошелька Надежды Фадеевой',
      source: {
        bank: 'Tbank',
        name: 'Надежда Ф.',
      },
    }),
  ],
  [
    '31.08.2025',
    transfers({
      value: 10000,
      name: 'Дмитрий П.',
      families: ['petrov'],
      time: '14:57',
      description: 'Пополнение кошелька Ксении Петровой',
      source: {
        bank: 'Gazprombank',
        name: 'Дмитрий П.',
      },
    }),
  ],
  [
    '31.08.2025',
    transfers({
      value: 10000,
      name: 'Анастасия Ч.',
      families: ['cherny'],
      time: '15:00',
      description: 'Пополнение кошелька Анастасии Черной',
      source: {
        bank: 'Sber',
        name: 'Анастасия Ч.',
      },
    }),
  ],
  // - 28.08.2025: music
  //   note: перевел Светлане Еремеевой 1300, так как она платила из своего кармана. Для простоты спишу со всех, кто ходит на музыку по обычному тарифу
  [
    '28.08.2025',
    music({
      families: families.except(['kirillov']),
    }),
  ],
]

export const transactions: Transaction[] = rawTransactions.map(([date, transaction]) => {
  const [day, month, year] = date.split('.').map(Number)
  const [hours, minutes] = transaction.time.split(':').map(Number)
  const timestamp = new Date(year, month - 1, day, hours ?? 12, minutes ?? 0)

  return {
    id: crypto.randomUUID(),
    name: transaction.name,
    description: transaction.description,
    value: transaction.value,
    timestamp,
    category: transaction.category,
    families: transaction.families,
    teacher: transaction.teacher,
    target: transaction.target,
    source: transaction.source,
  }
})

export const familyTransactions: FamilyTransaction[] = []

// разбиваем транзакции по юзерам
for (const transaction of transactions) {
  const transactionFamilies = transaction.families.map(f => families.getById(f)!)
  const values = (transaction.calc || relativeFn)?.(transaction.value, transactionFamilies)

  for (const family of transaction.families) {
    familyTransactions.push({
      // id: crypto.randomUUID(),
      family,
      transaction: transaction.id,
      // timestamp: transaction.timestamp,
      // description: transaction.description,
      value: values?.[family] ?? 0,
      // category: transaction.category,
      // teacher: transaction.teacher,
      // target: transaction.target,
      // source: transaction.source,
    })
  }
}
