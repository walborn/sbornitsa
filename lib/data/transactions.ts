import CryptoJS from 'crypto-js'

import type { Family, FamilyTransaction, Transaction, User } from '@/lib/schemas'

import familiesData from './families-generated.json'

// семья каждого ребёнка
const familyOf = new Map(
  (familiesData as Family[]).flatMap(family =>
    family.children.map(kid => [kid, family.id] as const)
  )
)

// вес семьи по числу её детей в транзакции
const splits = {
  fade: (kids: number) => kids + 1, // 2, 3, 4, 5
  line: (kids: number) => kids * 2, // 2, 4, 6, 8
  cnst: () => 2, // 2, 2, 2, 2
}

interface Shares {
  kids?: User['id'][] // кто участвует; семья определяется по ребёнку
  half?: User['id'][] // вес их семьи делится пополам (ходят раз в две недели)
  split?: keyof typeof splits // по умолчанию fade
  families?: Transaction['families'] // веса семей вручную, когда правило не подходит
}

type Entry = {
  date: string // '2026-10-08' (занятие в 11:00) или '2026-10-08T17:42:28', время московское
  target?: Transaction['target']
  source?: Transaction['source']
} & (
  | ({ type: 'english'; value?: number } & Shares)
  | ({
      type: 'music'
      name?: string
      description?: string
      value?: number
      teacher?: User['id']
    } & Shares)
  | ({ type: 'gifts'; name: string; description: string; value?: number } & Shares)
  | ({ type: 'supermarkets' | 'events'; name: string; description: string; value: number } & Shares)
  | { type: 'transfers'; name: string; value: number; family: Family['id']; description?: string }
)

const lessons = {
  english: {
    name: 'English',
    description: 'Оплата занятий по английскому',
    value: -2000,
    target: { bank: 'Sber', name: 'Наталья М.', user: 'natalya.m' },
  },
  music: {
    name: 'Music',
    description: 'Оплата занятий по музыке',
    value: -2000,
    teacher: 'amira.h',
    target: { bank: 'Sber', name: 'Амира Х.' },
  },
} satisfies Record<string, Partial<Transaction>>

const weigh = ({ kids = [], half = [], split = 'fade', families }: Shares) => {
  const counts = new Map<Family['id'], number>()
  const halved = new Set<Family['id']>()
  for (const kid of [...kids, ...half]) {
    const family = familyOf.get(kid)
    if (!family) throw new Error(`${kid} нет среди детей в families-generated.json`)
    counts.set(family, (counts.get(family) ?? 0) + 1)
    if (half.includes(kid)) halved.add(family)
  }

  const weights: Transaction['families'] = { ...families }
  for (const [family, count] of counts) {
    weights[family] = splits[split](count) / (halved.has(family) ? 2 : 1)
  }
  return weights
}

const expand = (entry: Entry): Omit<Transaction, 'id' | 'timestamp' | 'category'> => {
  switch (entry.type) {
    case 'english':
    case 'music':
      return { ...lessons[entry.type], ...entry, families: weigh(entry) }
    case 'gifts': {
      const families = weigh(entry)
      const value = -Object.values(families).reduce((sum, weight) => sum + weight, 0)
      return { value, ...entry, families }
    }
    case 'transfers':
      return {
        description: `Пополнение кошелька: ${entry.family}`,
        ...entry,
        families: { [entry.family]: 1 },
      }
    default:
      return { ...entry, families: weigh(entry) }
  }
}

const entries: Entry[] = [
  {
    type: 'transfers',
    date: '2026-10-22T19:19:44',
    value: +10_000,
    name: 'Елена Гурская',
    family: 'gurskys',
    source: {
      bank: 'sber',
      name: 'Елена Г.',
    },
  },
  {
    type: 'english',
    date: '2026-10-22',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      // 'miroslava.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova', // вместо вторника
      'boris.gurskiy',
    ],
  },
  {
    type: 'english',
    date: '2026-10-20',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      // 'miroslava.gerber',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      // 'meera.yuzhakova', - поменяли на вторник няню
    ],
  },
  {
    type: 'english',
    date: '2026-10-15',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'miroslava.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-10-13',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'miroslava.gerber',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova',
    ],
  },

  // 12 Oct: Переведи мне пожалуйста 1788 рублей и распредели пожалуйста между всеми детьми (заказала карандаши, краски и листы бумаги)
  // И ещё переведи пожалуйста 5678 рублей за пособия. Но как распределить 5678 скажу позже.
  // 19 Oct: Распредели, пожалуйста, по 613 рублей за пособия с:
  // Вера, Мила, Мира, Эмма, Игорь, Миша, Аврора, Аэлита
  {
    type: 'supermarkets',
    date: '2026-10-12T10:00:00',
    value: -613 * 8,
    name: 'Пособия',
    description: 'по 613 рублей за пособия',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'mila.legoshina',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'supermarkets',
    date: '2026-10-12T10:00:00',
    value: -2564, // -776 -1788, // это остаток от второй части
    name: 'Канцелярия',
    description: 'Света Еремеева заказала карандаши, краски и листы бумаги',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'mila.legoshina',
      'meera.yuzhakova',
      'grisha.tumanyan',
      'quoc.anh.tran',
      'boris.gurskiy',
    ],
  },
  // теперь Мила ходит два раза в неделю
  // на этой неделе еще ходит племянница Сони - Мирослава
  {
    type: 'english',
    date: '2026-10-08',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'miroslava.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova', // потому что не было day-off
    ],
  },
  {
    type: 'english',
    date: '2026-10-06',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'miroslava.gerber',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-10-01',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      // 'mila.legoshina',
      'meera.yuzhakova', // потому что не было day-off
    ],
  },
  {
    type: 'english',
    date: '2026-09-29',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'gifts',
    date: '2026-09-28T10:00',
    name: 'День Воспитателя',
    description: 'Подарок на день Воспитателя по 1к',
    value: -11000,
    kids: [
      'vera.eremeeva',
      'ivan.eremeev',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova',
      'grisha.tumanyan',
    ],
  },
  {
    type: 'supermarkets',
    date: '2026-09-27T12:35:29',
    value: -843.5,
    name: 'Канцелярия',
    description:
      'Бумага А4 500л. S 339, Пакет майка мале 5, Цвет.карандаши К 99, Набор линеек (3ш) 41.50, Набор цв.акр.гел 99, Клей-карандаш Be 62, Клей-карандаш Er 198 (2 шт. по 99)',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-09-24T11:26:37',
    value: +10_000,
    name: 'Тхи Шанг Л.',
    family: 'trans',
    source: {
      bank: 'alfabank',
      name: 'Тхи Шанг Л.',
    },
  },
  // Английский: начинаиная с сентября
  // вт + чт: Вера, Аврора, Аэлита, Игорь, Миша, Эмма, Бин
  // вт: Мила, Мира
  // было предложено по 250р - но это неудобно, потому что иногда кто-то может прийти в чт
  // или заглянуть на занятия старички
  {
    type: 'english',
    date: '2026-09-24',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      // 'mila.legoshina',
      'meera.yuzhakova', // потому что не было day-off
    ],
  },
  {
    type: 'english',
    date: '2026-09-23',
    kids: [
      'vera.eremeeva',
      'aurora.fadeeva',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'emma.kirillova',
      'quoc.anh.tran',
      'mila.legoshina',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-09-20T17:42:28',
    value: +3_000,
    name: 'Мария Легошина',
    family: 'legoshins',
    source: {
      bank: 'tbank',
      name: 'Мария Легошина',
    },
  },
  {
    type: 'transfers',
    date: '2026-09-18T18:13',
    value: +5_000,
    name: 'Надежда Ф.',
    family: 'fadeevs',
    source: {
      bank: 'tbank',
      name: 'Надежда Ф.',
    },
  },
  {
    type: 'transfers',
    date: '2026-09-18T13:40:06',
    value: +5_000,
    name: 'Ольга К.',
    family: 'kirillovs',
    source: {
      bank: 'sber',
      name: 'Ольга К.',
    },
  },
  {
    type: 'transfers',
    date: '2026-09-14T19:11',
    value: +10_000,
    name: 'Наталья Н.',
    family: 'novitskys',
    source: {
      bank: 'tbank',
      name: 'Наталья Н.',
    },
  },
  {
    type: 'transfers',
    date: '2026-09-11T11:47',
    value: 16_000,
    name: 'Полина С.',
    family: 'leonenkos',
    source: {
      bank: 'tbank',
      name: 'Полина С.',
    },
  },
  {
    type: 'english',
    date: '2026-06-19',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      // 'emil.usarov', // выпустился
      'meera.yuzhakova',
    ],
  },
  // Верни мне пожалуйста 5000 рублей, я дарила Наташе сегодня от всех подарок. И распредели эту сумму на всех ребят кроме Эммы Сашиной. Без Феди, без Ани Новицкой и без Платона. Без школьников минус Эмма. На Еремеевых - с коэффициентом.
  {
    type: 'gifts',
    date: '2026-06-17T10:00',
    name: 'День Рождения Наташи',
    description: 'Подарок на день рождения Наташе от всех семей',
    value: -5000,
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy', // Без Ани Новицкой
      'varya.petrova',
      'kirill.skvortsov', // Без Феди
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-06-17',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      // 'emil.usarov', // выпустился
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-06-12T19:18',
    value: 7575,
    name: 'Мария И.',
    family: 'usarovs',
    source: {
      bank: 'tbank',
      name: 'Мария И.',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-10T15:00',
    value: 5000,
    name: 'Надежда Ф.',
    family: 'fadeevs',
    source: {
      bank: 'tbank',
      name: 'Надежда Фадеева',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-10T13:29',
    value: 15000,
    name: 'Полина С.',
    family: 'leonenkos',
    source: {
      bank: 'tbank',
      name: 'Полина С.',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-10T09:12:07',
    value: -12000,
    name: 'Возврат за выпускной',
    family: 'gerbers',
    source: {
      bank: 'tbank',
      name: 'Yuzhakov B.',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-10T09:13',
    value: 1500,
    name: 'Перевод на карту',
    family: 'petrovs',
    source: {
      bank: 'tbank',
      name: 'Денис П.',
    },
  },

  {
    type: 'transfers',
    date: '2026-06-09T23:32',
    value: 5000,
    name: 'Перевод на карту',
    family: 'skvortsovs',
    source: {
      bank: 'tbank',
      name: 'Ольга С.',
    },
  },
  {
    type: 'english',
    date: '2026-06-10',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      // 'emil.usarov', // выпустился
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-06-09T22:43',
    value: 5000,
    name: 'Перевод на карту',
    family: 'kirillovs',
    source: {
      bank: 'tbank',
      name: 'Ольга К.',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-09T07:39',
    value: 3000,
    name: 'Перевод на карту',
    family: 'novitskys',
    source: {
      bank: 'tbank',
      name: 'Наталья Н.',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-08T18:41:10',
    value: 6000,
    name: 'Перевод на карту',
    family: 'legoshins',
    source: {
      bank: 'tbank',
      name: 'Дмитрий Л.',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-08T17:52:40',
    value: 4300,
    name: 'Перевод на карту',
    family: 'pimenovs',
    source: {
      bank: 'tbank',
      name: 'Мария К.',
    },
  },
  {
    type: 'transfers',
    date: '2026-06-08T17:39',
    value: 10000, // 5к + 5к
    name: 'Перевод на карту',
    family: 'skvortsovs',
    source: {
      bank: 'tbank',
      name: 'Ольга С.',
    },
  },
  {
    type: 'english',
    date: '2026-06-05',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      // 'emil.usarov', // выпустился
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-06-03T15:40',
    value: 5000,
    name: 'Светлана Еремеева',
    family: 'eremeevs',
    source: {
      bank: 'sber',
      name: 'Светлана Е.',
    },
  },

  // При делении расходов учитываем только детей (второй ребёнок старше 3 с коэффициентом 0.5).
  // Старшие дети, участвовавшие в организации тоже не учитываются (приравниваются к помогающим родителям)

  // Подарки брелоки 3774, Костюм лягушки 2672, Фартук и кокошник 698
  {
    type: 'supermarkets',
    date: '2026-06-03T12:00',
    value: -3774,
    name: 'Расходы на выпускной (Еремеевы)',
    description: '3774: Подарки брелоки',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'marusya.fadeeva',
      'agata.gerber',
      'platon.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'kirill.skvortsov',
      'fedya.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
  },
  {
    type: 'supermarkets',
    date: '2026-06-03T12:00',
    value: -3370,
    name: 'Расходы на выпускной (Еремеевы)',
    description: '3370: Костюм лягушки 2672, Фартук и кокошник 698',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva', // + marusya.fadeeva как взрослый
      'agata.gerber', // + platon.gerber как взрослый
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'kirill.skvortsov',
      'fedya.skvortsov',
      'emil.usarov',
      // yuzhakovs: meera.yuzhakova болела
    ],
  },
  {
    type: 'transfers',
    date: '2026-06-03T15:40',
    value: 7144,
    description: 'Подарки брелоки 3774, Костюм лягушки 2672, Фартук и кокошник 698',
    name: 'Светлана Еремеева',
    family: 'eremeevs',
    source: {
      bank: 'inner',
      name: 'Eremeeva S.',
    },
  },
  {
    type: 'supermarkets',
    date: '2026-06-03T12:00',
    value: -6191,
    name: 'Расходы на выпускной (Новицкие)',
    description:
      '6191: Флажки: 190*5=950, Посуда: 783, Земля: 100, Хлеб, сыр, колбаса, напитки: 4358',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva', // + marusya.fadeeva как взрослый
      'agata.gerber', // + platon.gerber как взрослый
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'kirill.skvortsov',
      'fedya.skvortsov',
      'emil.usarov',
      // yuzhakovs: meera.yuzhakova болела
    ],
  },
  {
    type: 'transfers',
    date: '2026-06-03T15:40',
    value: 6191,
    description: 'Флажки: 190*5=950, Посуда: 783, Земля: 100, Хлеб, сыр, колбаса, напитки: 4358',
    name: 'Новицкая Наталья',
    family: 'novitskys',
    source: {
      bank: 'inner',
      name: 'Novitskaya N.',
    },
  },

  {
    // Фетр для костюма черепахи 729
    // Лианы для костюма кикиморы 492
    // Костюм царя батюшка 1302 (оставили Веронике)
    type: 'supermarkets',
    date: '2026-06-03T12:00',
    value: -2523,
    name: 'Расходы на выпускной (Фадеевы)',
    description:
      '2523: Фетр для костюма черепахи 729, Лианы для костюма кикиморы 492, Костюм царя батюшка 1302 (оставили Веронике)',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva', // + marusya.fadeeva как взрослый
      'agata.gerber', // + platon.gerber как взрослый
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'kirill.skvortsov',
      'fedya.skvortsov',
      'emil.usarov',
      // yuzhakovs: meera.yuzhakova болела
    ],
  },
  {
    type: 'transfers',
    date: '2026-06-03T15:40',
    value: 2523,
    description:
      'Фетр для костюма черепахи 729, Лианы для костюма кикиморы 492, Костюм царя батюшка 1302 (оставили Веронике)',
    name: 'Надежда Ф.',
    family: 'fadeevs',
    source: {
      bank: 'inner',
      name: 'Fadeeva N.',
    },
  },
  {
    // TODO: Перевести Веронике на sber или наличкой
    type: 'supermarkets',
    date: '2026-06-03T12:00',
    value: -7180,
    name: 'Расходы на выпускной (Вероника)',
    description: '7180: Пироги',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva', // + marusya.fadeeva как взрослый
      'agata.gerber', // + platon.gerber как взрослый
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'kirill.skvortsov',
      'fedya.skvortsov',
      'emil.usarov',
      // yuzhakovs: meera.yuzhakova болела
    ],
  },
  {
    type: 'transfers',
    date: '2026-06-03T15:40',
    value: 32500, // 13000 + 1500 + 7000 + 5000 + 3000 + 3000,
    description:
      'Фрукты овощи на рынке 13000, Веронике 7000 на карту, Букет 5000, Наташа сертификат 3000, Костюм Буратино 3000',
    name: 'Софья Гербер',
    family: 'gerbers',
    source: {
      bank: 'inner',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'supermarkets',
    date: '2026-06-03T12:00',
    value: -32500,
    name: 'Расходы на выпускной (Герберы)',
    description:
      '32500: Фрукты овощи на рынке 13000, Веронике 7000 на карту, Букет 5000, Наташа сертификат 3000, Костюм Буратино 3000',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva', // + marusya.fadeeva как взрослый
      'agata.gerber', // + platon.gerber как взрослый
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'kirill.skvortsov',
      'fedya.skvortsov',
      'emil.usarov',
      // yuzhakovs: meera.yuzhakova болела
    ],
  },
  {
    type: 'supermarkets',
    date: '2026-06-03T12:00',
    value: -3034,
    name: 'Расходы на выпускной (Петровы)',
    description: '3034: Фасоль 556, Бумага 213, Носки 984, Наклейки 164, Дипломы 1072, Шарики 45 ',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva', // + marusya.fadeeva как взрослый
      'agata.gerber', // + platon.gerber как взрослый
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'kirill.skvortsov',
      'fedya.skvortsov',
      'emil.usarov',
      // yuzhakovs: meera.yuzhakova болела
    ],
  },
  {
    type: 'english',
    date: '2026-06-03',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      // 'emil.usarov', // выпустился
      'meera.yuzhakova',
    ],
  },
  {
    type: 'events',
    date: '2026-06-03T12:00',
    value: -7400,
    target: {
      bank: 'tbank',
      name: 'Вероника З.',
      user: 'veronika.zolotareva',
    },
    families: {
      chernys: 0, // left the group
      eremeevs: 450 + 850, // line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
      fadeevs: 0, // line<Fadeevs>('aurora.fadeeva'),
      gerbers: 850 + 850, // line<Gerbers>('agata.gerber', 'platon.gerber'),
      kirillovs: 450, // line<Kirillovs>('emma.kirillova'),
      legoshins: 450, // line<Legoshins>('mila.legoshina'),
      leonenkos: 450, // line<Leonenkos>('aellita.leonenko'),
      marshevs: 0, // line<Marshevs>('igor.marshev'),
      novitskys: 450 + 850, // line<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
      petrovs: 850, // line<Petrovs>('varya.petrova'),
      pimenovs: 0, // line<Pimenovs>('emilia.pimenova'),
      skvortsovs: 450, // line<Skvortsovs>('kirill.skvortsov'),
      usarovs: 0, // line<Usarovs>('emil.usarov'),
      yuzhakovs: 450, // line<Yuzhakovs>('meera.yuzhakova'), //
    },
    name: 'Музей',
    description: 'Поход в музей (билеты)',
  },
  {
    type: 'events',
    date: '2026-06-03T12:00',
    value: -2550,
    target: {
      bank: 'tbank',
      name: 'Вероника З.',
      user: 'veronika.zolotareva',
    },
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      // fadeevs: line<Fadeevs>('aurora.fadeeva'),
      'agata.gerber',
      'platon.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      // pimenovs: line<Pimenovs>('emilia.pimenova'),
      'kirill.skvortsov',
      // usarovs: line<Usarovs>('emil.usarov'),
      // yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
    ],
    name: 'Музей',
    description: 'Поход в музей (сопутствующие расходы)',
  },
  {
    type: 'english',
    date: '2026-05-27',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-05-22',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-05-20',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-05-15',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-05-13',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-05-12T10:54',
    value: 5000,
    name: 'Денис П.',
    family: 'petrovs',
    source: {
      bank: 'tbank',
      name: 'Денис П.',
    },
  },
  {
    type: 'english',
    date: '2026-05-08',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-05-06',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'gifts',
    date: '2026-05-04T10:00',
    name: 'День Рождения Вероники',
    description: 'Подарок на день рождения Вероники от всех семей',
    families: {
      chernys: 1500, // left the group
      eremeevs: 4000, // fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
      fadeevs: 1500, // fade<Fadeevs>('aurora.fadeeva'),
      gerbers: 4000, // fade<Gerbers>('agata.gerber'),
      kirillovs: 1500, // fade<Kirillovs>('emma.kirillova'), // Наташе тоже?
      legoshins: 1500, // fade<Legoshins>('mila.legoshina'),
      leonenkos: 2500, // fade<Leonenkos>('aellita.leonenko'),
      marshevs: 2500, // fade<Marshevs>('igor.marshev'),
      novitskys: 3000, // fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'),
      petrovs: 2000, // fade<Petrovs>('varya.petrova'),
      pimenovs: 0, // не будет участвовать в подарке. fade<Pimenovs>('emilia.pimenova'), // Наташе тоже?
      skvortsovs: 1000, // fade<Skvortsovs>('kirill.skvortsov'),
      usarovs: 1500, // fade<Usarovs>('emil.usarov'),
      // От Евгении Т. 1500р
      // От Натальи П. 4000
      yuzhakovs: 2000 + 1500 + 4000,
    },
    // 1500 + 4000 + 1500 + 4000 + 1500 + 1500 + 2500 + 2500 + 3000 + 2000 + 0 + 1000 + 1500 + 7500
  },
  {
    type: 'transfers',
    date: '2026-05-04T09:00',
    value: 5000,
    name: 'Ольга Скворцова',
    family: 'skvortsovs',
    source: {
      bank: 'riffisen',
      name: 'Ольга С.',
    },
  },
  {
    type: 'transfers',
    date: '2026-05-04T09:00',
    value: 7000,
    name: 'Надежда Ф.',
    family: 'fadeevs',
    source: {
      bank: 'tbank',
      name: 'Надежда Фадеева',
    },
  },
  {
    type: 'transfers',
    date: '2026-05-04T09:00',
    value: 4000,
    name: 'Софья Г.',
    family: 'gerbers',
    source: {
      bank: 'sber',
      name: 'Софья Г.',
    },
  },
  {
    type: 'transfers',
    date: '2026-05-02T11:18',
    value: 3000,
    name: 'Мария Легошина',
    family: 'legoshins',
    source: {
      bank: 'tbank',
      name: 'Дмитрий Л',
    },
  },
  {
    type: 'transfers',
    date: '2026-04-29T18:58',
    value: 8000,
    name: 'Светлана Еремеева',
    family: 'eremeevs',
    source: {
      bank: 'sber',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'english',
    date: '2026-04-29',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-04-28T18:12',
    value: 6000,
    name: 'Наталья Новицкая',
    family: 'novitskys',
    source: {
      bank: 'tbank',
      name: 'Наталья Н.',
    },
  },
  {
    type: 'transfers',
    date: '2026-04-28T13:35',
    value: 10000,
    name: 'Мария Исакова',
    family: 'usarovs',
    source: {
      bank: 'tbank',
      name: 'Мария И.',
    },
  },
  {
    type: 'english',
    date: '2026-04-24',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-04-22',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-04-17',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-04-15',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-04-10',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    // Борис, привет, я заказала продукты для детей, вышло 3600, можешь пжл перекинуть мне на Сбер 89250481986
    // Мира
    // Агата
    // Игорь
    // Миша
    // Варя
    // Аэлита
    // Эмма2
    // Ваня + Вера
    // Аврора
    // Эмиль
    type: 'supermarkets',
    date: '2026-04-10T12:05',
    value: -3600,
    name: 'За продукты для детей',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
    description: 'За продукты для детей (Софья Г.)',
    target: {
      bank: 'Sber',
      name: 'Софья Гербер',
    },
  },
  {
    type: 'english',
    date: '2026-04-08',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-04-03',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-04-01',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-03-25',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-03-20',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  // Переведи пожалуйста Веронике 800 рублей.
  // И спиши с Вани, Вари, Эмика и Агаты по 200.
  // Пособия по математике
  {
    type: 'supermarkets',
    date: '2026-03-18T11:28',
    value: -800,
    name: 'Пособия по математике',
    description: 'Пособия по математике для Вани, Вари, Эмика и Агаты по 200р',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'agata.gerber',
      'varya.petrova',
      'emil.usarov',
    ],
    split: 'line',
  },
  {
    type: 'english',
    date: '2026-03-18',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-03-16T12:10',
    value: 3500,
    name: 'Ольга Кириллова',
    family: 'kirillovs',
    source: {
      bank: 'sber',
      name: 'Ольга К.',
      message: 'Кириллова Эмма',
    },
  },
  {
    type: 'english',
    date: '2026-03-13',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  // Верни мне пожалуйста 4500. Вероника покупала музыкальные ложки детям.
  // И спиши с каждого лично ребёнка по 300 рублей. С Миши получается 600 тк за Аню тоже. То есть всего 15 детей = ложек.
  // Мне можешь вернуть наверное сразу 3900 лучше, и не списывать с моих
  {
    type: 'transfers',
    date: '2026-03-11T11:28',
    value: +600,
    name: 'За ложки',
    description: 'Это часть от 4500. Оставшиеся 3900 переведены на карту',
    family: 'eremeevs',
    source: {
      bank: 'sbornitsa',
      name: 'Общак',
      message: 'Это часть от 4500. Оставшиеся 3900 перевёл на карту',
    },
  },
  {
    type: 'supermarkets',
    date: '2026-03-11T11:28',
    value: -4500,
    name: 'Музыкальные ложки',
    description: 'Музыкальные ложки для занятий',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
  },
  {
    type: 'english',
    date: '2026-03-11',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  // Ты мне должен перевести 6110 (10094 - 3984)
  // Переведи пожалуйста 3000 (на любой банк), а остальные положи на депозит наш пожалуйста
  // (10094 (итоговая за мальчиков и девочек) - 3984 (добавлял ранее) - 3к (на карту)
  {
    type: 'transfers',
    date: '2026-03-08T01:26',
    value: 3110,
    name: 'Из общака',
    description: 'За счёт трат на подарки (10094  - 3984 - 3к)',
    // '10094 (итоговая за мальчиков и девочек) - 3984 (добавлял 23 фев) - 3к (на карту tbank)',
    family: 'eremeevs',
    source: {
      bank: 'sbornitsa',
      name: 'Общак',
      message: 'Остаток от 6110 (3к перевел на карту) За подарки на 23 февраля и 8 марта',
    },
  },
  /*
  Можешь пожалуйста со всех списать сумму 13000
  (с меня и Наташи с коэффициентом на второго ребёнка).
  И прислать 7000 - Наташе и 6000 - мне.
  Это на подарки на 8 марта Веронике и Наташе
  Перевел 8 марта в 01:37 (msk) Наташе Новицкой и Светлане Еремеевой
*/
  {
    type: 'gifts',
    date: '2026-03-08T10:00',
    value: -13000,
    name: 'Учителям на 8 марта',
    description: 'Подарки на 8 марта Веронике и Наташе',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova', // Наташе тоже?
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova', // Наташе тоже?
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-03-06',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-03-04',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-02-27',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-02-25T14:05',
    value: 5000,
    name: 'Ольга Скворцова',
    family: 'skvortsovs',
    source: {
      bank: 'tbank',
      name: 'Ольга С.',
      message: 'За Кирилла',
    },
  },
  {
    type: 'english',
    date: '2026-02-25',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-02-24T10:00',
    value: 2877,
    name: 'За счёт трат на масленницу',
    family: 'gerbers',
  },
  {
    type: 'supermarkets',
    date: '2026-02-24T10:00',
    value: -2877,
    name: 'Масленница',
    description: 'Продукты детям на масленницу',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'platon.gerber',
      'emma.kirillova',
      'igor.marshev',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
    ],
    split: 'line',
  },
  // потом еще добавить, так как будут подарки на 8 марта
  {
    type: 'transfers',
    date: '2026-02-23T10:00',
    value: 3984,
    name: 'Из общака',
    description: 'За счёт трат на подарки 23 февраля',
    family: 'eremeevs',
    source: {
      name: 'Общак',
      bank: 'sbornitsa',
    },
  },
  // 10094 общая сумма всех подарков
  // Делим равные суммы по количеству детей.
  // Количество детей было 16 тк ещё Платон был.
  // То есть на Мишу получается сумма двойная и на Агату
  {
    type: 'gifts',
    date: '2026-02-23T10:00',
    value: -10094,
    name: 'Детям на 23 февраля и 8 марта',
    description: 'Подарки на 23 февраля и 8 марта - поделили общую сумму на 16 детей',
    // подарки Платону и другим мальчишкам
    kids: [
      // chernys: left the group
      'vera.eremeeva',
      'ivan.eremeev',
      'aurora.fadeeva',
      'agata.gerber',
      'platon.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
  },
  {
    type: 'english',
    date: '2026-02-20',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-02-18',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2025-02-15T10:43:17', // в метке было 15.02.2026
    value: 3000,
    name: 'Надежда Ф.',
    family: 'fadeevs',
    source: {
      bank: 'tbank',
      name: 'Надежда Фадеева',
    },
  },
  {
    type: 'transfers',
    date: '2026-02-14T23:43',
    value: 5000,
    name: 'Мария Исакова',
    family: 'usarovs',
    // time: '23:43:47', // msk
    source: {
      bank: 'tbank',
      name: 'Мария И.',
    },
  },
  {
    type: 'english',
    date: '2026-02-13',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-02-11',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-02-04T21:34',
    name: 'Софья Г.',
    value: 5000,
    family: 'gerbers',
    source: {
      bank: 'Sber',
      name: 'Софья Г.',
    },
  },
  {
    type: 'english',
    date: '2026-01-30',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-01-28',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-01-27T11:45',
    value: 8000,
    name: 'Светлана Е.',
    family: 'eremeevs',
    source: {
      bank: 'Alfa',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'transfers',
    date: '2026-01-26T14:05',
    name: 'Надежда Ф.',
    value: 5000,
    family: 'fadeevs',
    source: {
      bank: 'Sber',
      name: 'Надежда Ф.',
      message: 'Авро',
    },
  },
  {
    type: 'english',
    date: '2026-01-23',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-01-21',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2026-01-16',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'transfers',
    date: '2026-01-16T13:06',
    value: 10000,
    name: 'Ксения Д.',
    family: 'petrovs',
    source: {
      bank: 'VTB',
      name: 'Ксения Д.',
    },
  },
  {
    type: 'english',
    date: '2026-01-14',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
  },
  {
    type: 'english',
    date: '2025-12-26',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },

  // Дарим подарки Наташе и Амире.
  // Распредели пожалуйста между всеми 9000.
  // Только у Вани коэффициент 1, у Веры 0.5
  // Кирилловы не ходят на Английский
  {
    type: 'gifts',
    date: '2025-12-26T21:51',
    value: -4500,
    name: 'Подарки: Английский',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    description: 'Новогодние подарки Наташе',
    target: {
      bank: 'Tbank',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'gifts',
    date: '2025-12-26T21:51',
    value: -4500,
    name: 'Подарки: Музыка',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    description: 'Новогодние подарки Амире',
    target: {
      bank: 'Tbank',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'music',
    date: '2025-12-23',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },

  // Борис, привет привет. Пишу лете ещё наши расходы по новому году и кому что перевести
  // 2800 Наташе Новицкой (на Т-Банк)
  // 3521 Наде (маме Авроры) (на Т-Банк)
  // 7000 мне (на Т-Банк)

  // Как распределить между детьми напишу позже

  // Борис, распределить всё нужно так:
  // Миру не включаем
  // Между остальными распредели ровно, кроме меня Нади и Наташи
  // По нам на Ваню коэффициент 1
  // На Веру 0.5
  // На Наташу на Мишу коэффициент 1.5 (если Аня не в списке уже)
  // На Аврору коэффициент 1.5 (была на празднике Маруся)
  {
    type: 'gifts',
    date: '2025-12-23T06:17',
    value: -3521,
    name: 'Новогодние расходы',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'marusya.fadeeva', // была на празднике Маруся
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
    ],
    description: 'Новогодние расходы (Надежда Фадеева)',
    target: {
      bank: 'Tbank',
      name: 'Надежда Ф.',
      message: 'НГ расходы',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-22T23:03',
    value: 5000,
    name: 'Дмитрий Л.',
    family: 'legoshins',
    source: {
      bank: 'Tbank',
      name: 'Дмитрий Л.',
    },
  },
  {
    type: 'gifts',
    date: '2025-12-22T21:00',
    value: -2800,
    name: 'Новогодние расходы',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'marusya.fadeeva', // была на празднике Маруся
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      // yuzhakovs: в Индии
    ],
    description: 'Новогодние расходы (Наташа Новицкая)',
    target: {
      bank: 'Tbank',
      name: 'Наталья Н.',
      message: 'НГ расходы',
    },
  },
  {
    type: 'gifts',
    date: '2025-12-22T20:53',
    value: -7000,
    name: 'Новогодние расходы',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'marusya.fadeeva', // была на празднике Маруся
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      // yuzhakovs: в Индии
    ],
    description: 'Новогодние расходы (Светлана Еремеева)',
    target: {
      bank: 'Tbank',
      name: 'Светлана Е.',
      message: 'НГ расходы',
    },
  },
  {
    type: 'gifts',
    date: '2025-12-20T17:51',
    value: -7268,
    name: 'Новогодние расходы',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'marusya.fadeeva', // была на празднике Маруся
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      // yuzhakovs: в Индии
    ],
    description: 'Еда для новогоднего квеста (Софья Гербер)',
    target: {
      bank: 'Sber',
      name: 'Софья Г.',
    },
  },
  {
    type: 'gifts',
    date: '2026-12-20T17:57', // в метке было 20.12.2025
    value: -1700,
    name: 'Новогодние расходы',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'marusya.fadeeva', // была на празднике Маруся
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      // yuzhakovs: в Индии
    ],
    description: 'Фотографии для НГ квеста (Софья Гербер)',
    target: {
      bank: 'Sber',
      name: 'Софья Г.',
    },
  },
  {
    type: 'transfers',
    date: '2026-12-20T17:57', // в метке было 20.12.2025
    value: 5000,
    name: 'Софья Г.',
    family: 'gerbers',
    source: {
      bank: 'Tbank',
      name: 'Софья Г.',
    },
  },
  {
    type: 'english',
    date: '2025-12-19',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'gifts',
    date: '2026-12-18T16:15', // в метке было 18.12.2025
    value: -13000,
    name: 'Подарок Веронике',
    description: '1к с семьи',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'cnst',
    target: {
      bank: 'Tbank',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'english',
    date: '2025-12-17',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-12-15',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'transfers',
    date: '2026-12-14T14:57', // в метке было 14.12.2025
    value: 5000,
    name: 'Ольга С.',
    family: 'skvortsovs',
    source: {
      bank: 'Raiffeisen',
      name: 'Ольга С.',
    },
  },
  {
    type: 'english',
    date: '2025-12-12',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-12-11',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-12-10',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'supermarkets',
    date: '2026-12-08T13:47', // в метке было 08.12.2025
    value: -1400,
    name: 'Расходники',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      // yuzhakovs: в Индии
    ],
    description: 'Украшение на ёлку и в квартиру (Вероника Золотарёва)',
    target: {
      bank: 'Tbank',
      name: 'Вероника Золотарёва',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-08T10:30',
    value: 5000,
    name: 'Надежда Ф.',
    family: 'fadeevs',
    source: {
      bank: 'Tbank',
      name: 'Надежда Ф.',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-06T13:35',
    value: 10000,
    name: 'Наталья Н.',
    family: 'novitskys',
    source: {
      bank: 'Tbank',
      name: 'Наталья Н.',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-06T13:33',
    value: 10000,
    name: 'Анастасия М.',
    family: 'marshevs',
    source: {
      bank: 'Tbank',
      name: 'Анастасия М.',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-05T16:02',
    value: 5000,
    name: 'Ольга К.',
    family: 'kirillovs',
    source: {
      bank: 'Sber',
      name: 'Ольга К.',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-05T15:28',
    value: 5000,
    name: 'Денис П.',
    family: 'petrovs',
    source: {
      bank: 'Tbank',
      name: 'Денис П.',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-05T11:55',
    value: 8000,
    name: 'Светлана Е.',
    family: 'eremeevs',
    source: {
      bank: 'Sber',
      name: 'Светлана Е.',
      message: 'Ваня и Вера пополам',
    },
  },
  {
    type: 'transfers',
    date: '2025-12-04T10:31',
    value: 5000,
    name: 'Мария И.',
    family: 'usarovs',
    source: {
      bank: 'Sber',
      name: 'Мария И.',
    },
  },
  {
    type: 'music',
    date: '2025-12-04',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-12-03',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-12-02',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-11-28',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'english',
    date: '2025-11-26',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-11-25',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'supermarkets',
    date: '2025-11-21T18:30',
    value: -2391,
    name: 'Праздник гномиков',
    kids: [
      // chernys: ушла
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
    description: 'Еда для праздника гномиков (Софья Гербер)',
    target: {
      bank: 'Sber',
      name: 'Софья Гербер',
    },
  },
  // Привет. Вчера было занятие с Амирой. И сегодня она тоже будет на празднике, как занятие
  {
    type: 'music',
    date: '2025-11-21',
    description: 'Участие Амиры в празднике гномиков (музыкальное сопровождение)',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-11-21',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-11-20',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-11-19',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  // Переведи пожалуйста Веронике 1600 рублей. Мне 3635 рублей.
  // И спиши с каждого ребёнка с депозита 349 рублей (с Миши получается 349*2 тк за Аню ещё).
  // Это за праздник гномиков за подарки детям и реквизит.
  // I have counted 243 + 107
  {
    type: 'gifts',
    date: '2025-11-18T02:45',
    value: -3635,
    name: 'Праздник гномиков',
    description: 'Праздник гномиков (Светлана Еремеева)',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
    target: {
      bank: 'Tbank',
      name: 'Светлана Еремеева',
    },
  },
  {
    type: 'gifts',
    date: '2025-11-18T02:44',
    value: -1600,
    name: 'Праздник гномиков',
    description: 'Праздник гномиков (Вероника Золотарёва)',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
    target: {
      bank: 'Alfa',
      name: 'Вероника Золотарёва',
    },
  },
  {
    type: 'english',
    date: '2025-11-14',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'english',
    date: '2025-11-12',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-11-11',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'music',
    date: '2025-11-10',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-11-07',
    kids: [
      // chernys: left the group
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-11-06',
    kids: [
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-11-05',
    kids: [
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  // https://t.me/c/1706315472/27998/29471
  // Анна Новицкая с ноября уже не будет попадать на английский в садике, исключите её из расчётов за английский с какого-нибудь ближайшего момента.
  {
    type: 'transfers',
    date: '2025-10-25T19:23',
    value: -5795,
    name: 'Анастасия Ч.',
    family: 'chernys',
    description: 'Возврат остатка Анастасии Черной',
  },
  {
    type: 'transfers',
    date: '2025-10-23T18:54',
    value: 1555,
    name: 'Дмитрий Л.',
    family: 'legoshins',
    description: 'Пополнение кошелька Марии Легошиной',
    source: {
      bank: 'Tbank',
      name: 'Дмитрий Л.',
    },
  },
  {
    type: 'supermarkets',
    date: '2025-10-17T20:33',
    value: -2929,
    name: 'Расходники',
    kids: [
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
    description: 'Пирамидки для занятий и пастель (Светлана Еремеева)',
    target: {
      bank: 'Tbank',
      name: 'Светлана Еремеева',
    },
  },
  {
    type: 'english',
    date: '2025-10-17',
    kids: [
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'english',
    date: '2025-10-15',
    kids: [
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'english',
    date: '2025-10-09',
    kids: [
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-10-07',
    kids: [
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  // anastasia.chernaya left the group
  {
    type: 'gifts',
    date: '2025-10-06T20:28',
    value: -5300,
    name: 'День учителя',
    description: 'Амире М. ко Дню учителя',
    kids: [
      'nina.chernaya',
      'vitya.cherny', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'platon.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    target: {
      bank: 'Tbank',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'gifts',
    date: '2025-10-06T20:28',
    value: -5300,
    name: 'День учителя',
    description: 'Наташе М. ко Дню учителя',
    kids: [
      'nina.chernaya',
      'vitya.cherny', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    target: {
      bank: 'Tbank',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'supermarkets',
    date: '2025-10-03T14:33',
    value: -2500,
    name: 'Еда',
    description: 'Овощи и стаканы',
    kids: [
      'nina.chernaya',
      'vitya.cherny',
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'platon.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
    target: {
      bank: 'Tbank',
      name: 'Платон Г.',
    },
  },
  {
    type: 'english',
    date: '2025-10-01',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-09-30',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'gifts',
    date: '2025-09-27T12:21',
    value: -15000,
    name: 'День воспитателя',
    description: 'Поздравление Вероники с днем воспитателя',
    families: {
      chernys: 500, // fade<Chernys>('vitya.cherny', 'nina.chernaya'), // Ходила только Нина
      eremeevs: 2000, // fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
      fadeevs: 1000, // fade<Fadeevs>('aurora.fadeeva'),
      gerbers: 1000, // fade<Gerbers>('agata.gerber', 'platon.gerber'),
      kirillovs: 1000, // fade<Kirillovs>('emma.kirillova'),
      legoshins: 1000, // fade<Legoshins>('mila.legoshina'),
      leonenkos: 1000, // fade<Leonenkos>('aellita.leonenko'),
      marshevs: 2000, // fade<Marshevs>('igor.marshev'),
      novitskys: 1000, // fade<Novitskys>('anna.novitskaya'),
      petrovs: 1000, // fade<Petrovs>('varya.petrova'),
      pimenovs: 1, // fade<Pimenovs>('emilia.pimenova'), - кажется она специально не скидывалась
      skvortsovs: 1000, // fade<Skvortsovs>('kirill.skvortsov'),
      usarovs: 1000, // fade<Usarovs>('emil.usarov'),
      yuzhakovs: 1500, // fade<Yuzhakovs>('meera.yuzhakova'),
    },
    target: {
      bank: 'Alfa',
      name: 'Вероника Золотарёва',
    },
  },
  {
    type: 'transfers',
    date: '2025-09-26T14:34',
    value: 5000,
    name: 'Софья Г.',
    family: 'gerbers',
    target: {
      bank: 'Sovcombank',
      name: 'Софья Г.',
    },
  },
  {
    type: 'supermarkets',
    date: '2025-09-25T12:21',
    value: -425,
    name: 'Расходники',
    kids: [
      'vitya.cherny',
      'nina.chernaya',
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'mila.legoshina',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    split: 'line',
    description: 'Канцелярские товары',
    target: {
      bank: 'Tbank',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'english',
    date: '2025-09-24',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-09-22',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'emilia.pimenova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-09-19',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'transfers',
    date: '2025-09-18T16:55',
    value: 2000,
    name: 'Светлана Е.',
    family: 'eremeevs',
    source: {
      bank: 'Alfa',
      name: 'Светлана Е.',
      message: '2 на Ванин, 1 на Верин',
    },
  },

  {
    type: 'transfers',
    date: '2025-09-18T14:57',
    value: 1000,
    name: 'Ольга С.',
    family: 'skvortsovs',
    source: {
      bank: 'Alfa',
      name: 'Ольга С.',
      message: 'За Скворцова Федю (тетради)',
    },
  },
  {
    type: 'english',
    date: '2025-09-18',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  // Федя (Ольга Скворцова)
  // Ваня (Светлана Еремеева)
  // Вари (Ксения Петрова)
  // Агата (Софья Гербер)
  // Платон (Софья Гербер)
  // Аня (Наташа Новицкая)
  // emil.usarov (Мария И.)
  {
    type: 'supermarkets',
    date: '2025-09-18T13:26',
    value: -7000,
    name: 'Расходники',
    // 1. 'eremeev' -> Ваня
    // 2. 'skvortsov' -> Федя
    // 3. 'petrov' -> Варя
    // 4. 'gerber' -> Агата
    // 5. 'gerber' -> Платон
    // 6. 'novitskiy' -> Аня
    // 7. 'usarov' -> Эмик
    kids: [
      'ivan.eremeev', // Только Ваня
      'agata.gerber',
      'platon.gerber', // Агата, Платон
      'anna.novitskaya', // Только Aня
      'varya.petrova', // Варя
      'kirill.skvortsov', // Федя
      'emil.usarov', // Эмик
    ],
    split: 'line',
    description: '7 тетрадей по 1к',
    target: {
      category: 'Books - МСС 2741',
      name: 'ИП Кривоноженкова А. С.',
    },
  },

  // [+] pimenov join the group

  // Привет. Тебе сегодня должна перевести общак ещё одна мама. И добавляется в наш список детей ещё один ребёнок Эмма Климова.
  // Она будет ходить пока только на музыку

  // сентябрь
  //                 Музыка.     Английский.
  // 1 Нина          1           1
  // 2 Ваня + Вера   1.5         1.5
  // 3 Аврора        1           1
  // 4 Агата         1           1
  // 5 Эмма К.       1           0
  // 6 Мила          0.5         0.5
  // 7 Аэлита        1           0
  // 8 Игорь         1           1
  // 9 Миша + Аня    1           1.5
  // 10 Варя         1           1
  // 11 Эмма П.      1           0
  // 11 Кирилл       1           1
  // 12 Эмик         0.5         1
  // 13 Мира         1           1

  {
    type: 'transfers',
    date: '2025-09-17T21:10',
    value: 5000,
    name: 'Ольга К.',
    family: 'kirillovs',
    description: 'Пополнение кошелька Ольги Кирилловой',
    source: {
      bank: 'Sber',
      name: 'Ольга К.',
      message: 'За Эмму Кириллову (дет. сад)',
    },
  },
  {
    type: 'music',
    date: '2025-09-15',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'emma.kirillova',
      'aellita.leonenko',
      'igor.marshev',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina', 'emil.usarov'],
  },
  {
    type: 'english',
    date: '2025-09-12',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'english',
    date: '2025-09-10',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'transfers',
    date: '2025-09-09T22:28',
    value: 10000,
    name: 'Анастасия М.',
    family: 'marshevs',
    description: 'Пополнение кошелька Анастасии Маршевой',
    source: {
      bank: 'Tbank',
      name: 'Анастасия М.',
    },
  },
  {
    type: 'english',
    date: '2025-09-10',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'transfers',
    date: '2025-09-09T22:28',
    value: 10000,
    name: 'Анастасия М.',
    family: 'marshevs',
    description: 'Пополнение кошелька Анастасии Маршевой',
    source: {
      bank: 'Tbank',
      name: 'Анастасия М.',
    },
  },
  {
    type: 'english',
    date: '2025-09-05',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },
  {
    type: 'music',
    date: '2025-09-04',
    // Должно получиться 182
    kids: [
      'ivan.eremeev',
      'vera.eremeeva', // 273
      'agata.gerber', // 182
      'mila.legoshina', // 182
      'aellita.leonenko', // 182
      'igor.marshev', // 182
      'anna.novitskaya',
      'misha.novitskiy', // 273+
      'varya.petrova', // 182
      'kirill.skvortsov', // 182
      'emil.usarov', // 182
      'meera.yuzhakova', // 182
    ],
  },
  {
    type: 'english',
    date: '2025-09-03',
    kids: [
      'nina.chernaya', // Ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva',
      'aurora.fadeeva',
      'agata.gerber',
      'aellita.leonenko',
      'igor.marshev',
      'anna.novitskaya',
      'misha.novitskiy',
      'varya.petrova',
      'kirill.skvortsov',
      'emil.usarov',
      'meera.yuzhakova',
    ],
    half: ['mila.legoshina'],
  },

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

  // сентябрь
  //                 Музыка.     Английский.
  // 1 Нина          1           1
  // 2 Ваня + Вера   1.5         1.5
  // 3 Аврора        1           1
  // 4 Агата         1           1
  // 5 Эмма К.       1           0
  // 6 Мила          0.5         0.5
  // 7 Аэлита        1           0
  // 8 Игорь         1           1
  // 9 Миша + Аня    1           1.5
  // 10 Варя         1           1
  // 11 Кирилл       1           1
  // 12 Эмик         0.5         1
  // 13 Мира         1           1
  {
    type: 'transfers',
    date: '2025-09-03T16:40',
    value: 6000,
    name: 'Светлана Е.',
    family: 'eremeevs',
    description: 'Пополнение кошелька Светланы Еремеевой',
    source: {
      bank: 'Alfa',
      name: 'Светлана Е.',
    },
  },
  {
    type: 'transfers',
    date: '2025-09-01T15:00',
    value: 10000,
    name: 'Дмитрий Л.',
    family: 'legoshins',
    description: 'Пополнение кошелька Марии Легошиной',
    source: {
      bank: 'Tbank',
      name: 'Дмитрий Л.',
    },
  },
  {
    type: 'transfers',
    date: '2025-08-31T15:47',
    value: 10000,
    name: 'Ольга С.',
    family: 'skvortsovs',
    description: 'Пополнение кошелька Ольги Скворцовой',
    source: {
      bank: 'Raiffeisen',
      name: 'Ольга С.',
      message: 'Детский сад за Кирилла Скворцова',
    },
  },
  {
    type: 'transfers',
    date: '2025-08-31T13:59',
    value: 15000,
    name: 'Наталия Н.',
    family: 'novitskys',
    description: 'Пополнение кошелька Наташи Новицкой',
    source: {
      bank: 'Tbank',
      name: 'Наталия Н.',
    },
  },
  {
    type: 'transfers',
    date: '2025-08-31T12:30',
    value: 3000,
    name: 'Надежда Ф.',
    family: 'fadeevs',
    description: 'Пополнение кошелька Надежды Фадеевой',
    source: {
      bank: 'Tbank',
      name: 'Надежда Ф.',
    },
  },
  {
    type: 'transfers',
    date: '2025-08-31T14:57',
    value: 10000,
    name: 'Дмитрий П.',
    family: 'petrovs',
    description: 'Пополнение кошелька Ксении Петровой',
    source: {
      bank: 'Gazprombank',
      name: 'Дмитрий П.',
    },
  },
  {
    type: 'transfers',
    date: '2025-08-31T15:00',
    value: 10000,
    name: 'Анастасия Ч.',
    family: 'chernys',
    description: 'Пополнение кошелька Анастасии Черной',
    source: {
      bank: 'Sber',
      name: 'Анастасия Ч.',
    },
  },
  // 28.08.2025: music
  // Перевел Светлане Еремеевой 1300, так как она платила из своего кармана.
  // Должно получиться 104 (1300 / 12.5) - сумма за одного ребенка
  {
    type: 'music',
    date: '2025-08-28',
    value: -(1300 - 208), // еще были Евгения Т, Влада Р
    kids: [
      'nina.chernaya', // 104, ходила только Нина
      'ivan.eremeev',
      'vera.eremeeva', // 156
      // 'aurora.fadeeva', // 104, Аврора
      'agata.gerber', // 104, 'platon.gerber' уже в школе
      // kirillovs: еще не пришла
      // 'mila.legoshina', // 104, видимо, тут не была
      'aellita.leonenko', // 104,
      'igor.marshev', // 104
      'anna.novitskaya',
      'misha.novitskiy', // 156
      'varya.petrova', // 104,
      'kirill.skvortsov',
      'kirill.skvortsov', // 156, был еще кто-то от него
      // 'emil.usarov', // 104, видимо, тут не было
      'meera.yuzhakova', // 104,
    ],
  },
]

// id из хеша, а не случайный: одинаковый в каждой сборке, иначе ссылки на транзакции ломаются
const uuid = (key: string) => {
  const hex = CryptoJS.SHA1(key).toString()
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `5${hex.slice(13, 16)}`,
    `8${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join('-')
}

// у некоторых транзакций совпадают дата, тип и название — различаем по порядку
const occurrences = new Map<string, number>()

export const transactions: Transaction[] = entries.map(entry => {
  const transaction = expand(entry)
  const key = `${entry.date}|${entry.type}|${transaction.name}`
  const occurrence = (occurrences.get(key) ?? 0) + 1
  occurrences.set(key, occurrence)
  return {
    id: uuid(`${key}|${occurrence}`),
    name: transaction.name,
    description: transaction.description,
    value: transaction.value,
    // без времени — занятие в 11:00; время московское
    timestamp: new Date(`${entry.date}${entry.date.includes('T') ? '' : 'T11:00'}+03:00`).getTime(),
    category: entry.type,
    families: transaction.families,
    teacher: transaction.teacher,
    kids:
      entry.type === 'transfers'
        ? undefined
        : [...new Set([...(entry.kids ?? []), ...(entry.half ?? [])])],
    target: transaction.target,
    source: transaction.source,
  }
})

export const familyTransactions: FamilyTransaction[] = []

// разбиваем транзакции по юзерам
for (const transaction of transactions) {
  const totalIncome = Object.values(transaction.families).reduce((r, i) => r + i, 0)

  const families = Object.keys(transaction.families) as Family['id'][]
  for (const family of families) {
    if (transaction.families[family])
      familyTransactions.push({
        // id: crypto.randomUUID(),
        family,
        transaction: transaction.id,
        // description: transaction.description,
        value: Math.floor(transaction.value * (transaction.families[family] / totalIncome)),
        // category: transaction.category,
        // teacher: transaction.teacher,
        // target: transaction.target,
        // source: transaction.source,
      })
  }
}
