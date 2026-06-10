import type { Family, FamilyTransaction, Transaction, User } from '@/lib/schemas'
import type {
  Chernys,
  Eremeevs,
  Fadeevs,
  Gerbers,
  Kirillovs,
  Legoshins,
  Leonenkos,
  Marshevs,
  Novitskys,
  Petrovs,
  Pimenovs,
  Skvortsovs,
  Usarovs,
  Yuzhakovs,
} from '@/lib/schemas/families'

const cnst = <T extends User['id'][]>(...args: T) => 2 // 2, 2, 2, 2
const fade = <T extends User['id'][]>(...args: T) => args.length + 1 // 2, 3, 4, 5
const line = <T extends User['id'][]>(...args: T) => args.length * 2 // 2, 4, 6, 8
const none = <T extends User['id'][]>(...args: T) => 0

type RawTransaction = {
  name: string
  description: string
  timestamp: number // для точного времени
  value: number
  category: Transaction['category']
  teacher?: User['id']
  time?: string
  families: Transaction['families']
  children?: string[][]
  target?: Transaction['target']
  source?: Transaction['source']
}

type EnglishTransaction = Omit<
  RawTransaction,
  'name' | 'description' | 'value' | 'category' | 'teacher' | 'timestamp'
> & {
  value?: number
}
const english = (date: string, transaction: EnglishTransaction): RawTransaction => ({
  value: -2000,
  target: {
    bank: 'Sber',
    name: 'Наталья М.',
    user: 'natalya.m',
  },
  // верхние можно перезаписать
  ...transaction,
  // эти свойства нельзя перезаписывать
  name: 'English',
  description: 'Оплата занятий по английскому',
  timestamp: new Date(`${date}T11:00:00+03:00`).getTime(),
  category: 'english',
})

type MusicTransaction = Omit<
  RawTransaction,
  'name' | 'description' | 'value' | 'category' | 'teacher' | 'timestamp'
> & {
  name?: string
  description?: string
  value?: number
  category?: Transaction['category']
  teacher?: User['id']
  time?: string
}
const music = (date: string, transaction: MusicTransaction): RawTransaction => ({
  // эти свойства можно перезаписать
  value: -2000,
  name: 'Music',
  description: 'Оплата занятий по музыке',
  teacher: 'amira.h',
  target: {
    bank: 'Sber',
    name: 'Амира Х.',
  },
  // перезаписываем и дополняем
  ...transaction,
  // эти свойства нельзя перезаписывать
  timestamp: new Date(`${date}T11:00:00+03:00`).getTime(),
  category: 'music',
})

type TransferTransaction = Omit<RawTransaction, 'description' | 'category' | 'families'> & {
  description?: string
  family: Family['id']
}

const transfers = ({ family, ...trasaction }: TransferTransaction): RawTransaction => ({
  description: `Пополнение кошелька: ${family}`,
  families: {
    chernys: 0,
    eremeevs: 0,
    fadeevs: 0,
    gerbers: 0,
    kirillovs: 0,
    legoshins: 0,
    leonenkos: 0,
    marshevs: 0,
    novitskys: 0,
    petrovs: 0,
    pimenovs: 0,
    skvortsovs: 0,
    usarovs: 0,
    yuzhakovs: 0,
    [family]: 1,
  },
  ...trasaction,
  category: 'transfers',
})

type GiftsTransaction = Omit<RawTransaction, 'value' | 'category'> & {
  value?: Transaction['value']
}

const gifts = (trasnaction: GiftsTransaction): RawTransaction => {
  const value =
    trasnaction.value ?? -[...Object.values(trasnaction.families)].reduce((r, i) => r + i, 0)

  return {
    value,
    ...trasnaction,
    category: 'gifts',
  }
}

type SupermarketsTransaction = Omit<RawTransaction, 'category'>
const supermarkets = (trasaction: SupermarketsTransaction): RawTransaction => ({
  ...trasaction,
  category: 'supermarkets',
})

const rawTransactions: [string, RawTransaction][] = [
  [
    '10.06.2026',
    transfers({
      value: -12000,
      name: 'Возврат за выпускной',
      family: 'gerbers',
      timestamp: new Date('2026-06-10T09:12:07+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Yuzhakov B.',
      },
    }),
  ],
  [
    '10.06.2026',
    transfers({
      value: 1500,
      name: 'Перевод на карту',
      family: 'petrovs',
      timestamp: new Date('2026-06-10T09:13:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Денис П.',
      },
    }),
  ],

  [
    '09.06.2026',
    transfers({
      value: 5000,
      name: 'Перевод на карту',
      family: 'skvortsovs',
      timestamp: new Date('2026-06-09T23:32:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Ольга С.',
      },
    }),
  ],

  [
    '09.06.2026',
    transfers({
      value: 5000,
      name: 'Перевод на карту',
      family: 'kirillovs',
      timestamp: new Date('2026-06-09T22:43:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Ольга К.',
      },
    }),
  ],
  [
    '09.06.2026',
    transfers({
      value: 3000,
      name: 'Перевод на карту',
      family: 'novitskys',
      timestamp: new Date('2026-06-09T07:39:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Наталья Н.',
      },
    }),
  ],
  [
    '08.06.2026',
    transfers({
      value: 6000,
      name: 'Перевод на карту',
      family: 'legoshins',
      timestamp: new Date('2026-06-08T18:41:10+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Дмитрий Л.',
      },
    }),
  ],
  [
    '08.06.2026',
    transfers({
      value: 4300,
      name: 'Перевод на карту',
      family: 'pimenovs',
      timestamp: new Date('2026-06-08T17:52:40+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Мария К.',
      },
    }),
  ],
  [
    '08.06.2026',
    transfers({
      value: 10000, // 5к + 5к
      name: 'Перевод на карту',
      family: 'skvortsovs',
      timestamp: new Date('2026-06-08T17:39:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Ольга С.',
      },
    }),
  ],
  [
    '05.06.2026',
    english('2026-06-05', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: none<Usarovs>('emil.usarov'), // выпустился
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '03.06.2026',
    transfers({
      value: 5000,
      name: 'Светлана Еремеева',
      family: 'eremeevs',
      timestamp: new Date('2026-06-03T15:40:00+03:00').getTime(),
      source: {
        bank: 'sber',
        name: 'Светлана Е.',
      },
    }),
  ],

  // При делении расходов учитываем только детей (второй ребёнок старше 3 с коэффициентом 0.5).
  // Старшие дети, участвовавшие в организации тоже не учитываются (приравниваются к помогающим родителям)

  // Подарки брелоки 3774, Костюм лягушки 2672, Фартук и кокошник 698
  [
    '03.06.2026',
    supermarkets({
      value: -3774,
      name: 'Расходы на выпускной (Еремеевы)',
      description: '3774: Подарки брелоки',
      families: {
        chernys: line<Chernys>(), // left the group
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), //
        fadeevs: line<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), //
        gerbers: line<Gerbers>('agata.gerber', 'platon.gerber'), //
        kirillovs: line<Kirillovs>('emma.kirillova'), //
        legoshins: line<Legoshins>('mila.legoshina'), //
        leonenkos: line<Leonenkos>('aellita.leonenko'), //
        marshevs: line<Marshevs>('igor.marshev'), //
        novitskys: line<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
        petrovs: line<Petrovs>('varya.petrova'), //
        pimenovs: none<Pimenovs>('emilia.pimenova'), //
        skvortsovs: line<Skvortsovs>('kirill.skvortsov', 'fedya.skvortsov'), //
        usarovs: line<Usarovs>('emil.usarov'), //
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'), //
      },
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
    }),
  ],
  [
    '03.06.2026',
    supermarkets({
      value: -3370,
      name: 'Расходы на выпускной (Еремеевы)',
      description: '3370: Костюм лягушки 2672, Фартук и кокошник 698',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), //
        fadeevs: fade<Fadeevs>('aurora.fadeeva'), // + marusya.fadeeva как взрослый
        gerbers: fade<Gerbers>('agata.gerber'), // + platon.gerber как взрослый
        kirillovs: fade<Kirillovs>('emma.kirillova'), //
        legoshins: fade<Legoshins>('mila.legoshina'), //
        leonenkos: fade<Leonenkos>('aellita.leonenko'), //
        marshevs: fade<Marshevs>('igor.marshev'), //
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
        petrovs: fade<Petrovs>('varya.petrova'), //
        pimenovs: fade<Pimenovs>('emilia.pimenova'), //
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov', 'fedya.skvortsov'), //
        usarovs: fade<Usarovs>('emil.usarov'), //
        yuzhakovs: none<Yuzhakovs>(), // meera.yuzhakova болела
      },
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
    }),
  ],
  [
    '03.06.2026',
    transfers({
      value: 7144,
      description: 'Подарки брелоки 3774, Костюм лягушки 2672, Фартук и кокошник 698',
      name: 'Светлана Еремеева',
      family: 'eremeevs',
      timestamp: new Date('2026-06-03T15:40:00+03:00').getTime(),
      source: {
        bank: 'inner',
        name: 'Eremeeva S.',
      },
    }),
  ],
  [
    '03.06.2026',
    supermarkets({
      value: -6191,
      name: 'Расходы на выпускной (Новицкие)',
      description:
        '6191: Флажки: 190*5=950, Посуда: 783, Земля: 100, Хлеб, сыр, колбаса, напитки: 4358',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), //
        fadeevs: fade<Fadeevs>('aurora.fadeeva'), // + marusya.fadeeva как взрослый
        gerbers: fade<Gerbers>('agata.gerber'), // + platon.gerber как взрослый
        kirillovs: fade<Kirillovs>('emma.kirillova'), //
        legoshins: fade<Legoshins>('mila.legoshina'), //
        leonenkos: fade<Leonenkos>('aellita.leonenko'), //
        marshevs: fade<Marshevs>('igor.marshev'), //
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
        petrovs: fade<Petrovs>('varya.petrova'), //
        pimenovs: fade<Pimenovs>('emilia.pimenova'), //
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov', 'fedya.skvortsov'), //
        usarovs: fade<Usarovs>('emil.usarov'), //
        yuzhakovs: none<Yuzhakovs>(), // meera.yuzhakova болела
      },
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
    }),
  ],
  [
    '03.06.2026',
    transfers({
      value: 6191,
      description: 'Флажки: 190*5=950, Посуда: 783, Земля: 100, Хлеб, сыр, колбаса, напитки: 4358',
      name: 'Новицкая Наталья',
      family: 'novitskys',
      timestamp: new Date('2026-06-03T15:40:00+03:00').getTime(),
      source: {
        bank: 'inner',
        name: 'Novitskaya N.',
      },
    }),
  ],

  [
    // Фетр для костюма черепахи 729
    // Лианы для костюма кикиморы 492
    // Костюм царя батюшка 1302 (оставили Веронике)
    '03.06.2026',
    supermarkets({
      value: -2523,
      name: 'Расходы на выпускной (Фадеевы)',
      description:
        '2523: Фетр для костюма черепахи 729, Лианы для костюма кикиморы 492, Костюм царя батюшка 1302 (оставили Веронике)',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), //
        fadeevs: fade<Fadeevs>('aurora.fadeeva'), // + marusya.fadeeva как взрослый
        gerbers: fade<Gerbers>('agata.gerber'), // + platon.gerber как взрослый
        kirillovs: fade<Kirillovs>('emma.kirillova'), //
        legoshins: fade<Legoshins>('mila.legoshina'), //
        leonenkos: fade<Leonenkos>('aellita.leonenko'), //
        marshevs: fade<Marshevs>('igor.marshev'), //
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
        petrovs: fade<Petrovs>('varya.petrova'), //
        pimenovs: fade<Pimenovs>('emilia.pimenova'), //
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov', 'fedya.skvortsov'), //
        usarovs: fade<Usarovs>('emil.usarov'), //
        yuzhakovs: none<Yuzhakovs>(), // meera.yuzhakova болела
      },
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
    }),
  ],
  [
    '03.06.2026',
    transfers({
      value: 2523,
      description:
        'Фетр для костюма черепахи 729, Лианы для костюма кикиморы 492, Костюм царя батюшка 1302 (оставили Веронике)',
      name: 'Фадеева Надежда',
      family: 'fadeevs',
      timestamp: new Date('2026-06-03T15:40:00+03:00').getTime(),
      source: {
        bank: 'inner',
        name: 'Fadeeva N.',
      },
    }),
  ],
  [
    // TODO: Перевести Веронике на sber или наличкой
    '03.06.2026',
    supermarkets({
      value: -7180,
      name: 'Расходы на выпускной (Вероника)',
      description: '7180: Пироги',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), //
        fadeevs: fade<Fadeevs>('aurora.fadeeva'), // + marusya.fadeeva как взрослый
        gerbers: fade<Gerbers>('agata.gerber'), // + platon.gerber как взрослый
        kirillovs: fade<Kirillovs>('emma.kirillova'), //
        legoshins: fade<Legoshins>('mila.legoshina'), //
        leonenkos: fade<Leonenkos>('aellita.leonenko'), //
        marshevs: fade<Marshevs>('igor.marshev'), //
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
        petrovs: fade<Petrovs>('varya.petrova'), //
        pimenovs: fade<Pimenovs>('emilia.pimenova'), //
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov', 'fedya.skvortsov'), //
        usarovs: fade<Usarovs>('emil.usarov'), //
        yuzhakovs: none<Yuzhakovs>(), // meera.yuzhakova болела
      },
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
    }),
  ],
  [
    '03.06.2026',
    transfers({
      value: 32500, // 13000 + 1500 + 7000 + 5000 + 3000 + 3000,
      description:
        'Фрукты овощи на рынке 13000, Веронике 7000 на карту, Букет 5000, Наташа сертификат 3000, Костюм Буратино 3000',
      name: 'Софья Гербер',
      family: 'gerbers',
      timestamp: new Date('2026-06-03T15:40:00+03:00').getTime(),
      source: {
        bank: 'inner',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '03.06.2026',
    supermarkets({
      value: -32500,
      name: 'Расходы на выпускной (Герберы)',
      description:
        '32500: Фрукты овощи на рынке 13000, Веронике 7000 на карту, Букет 5000, Наташа сертификат 3000, Костюм Буратино 3000',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), //
        fadeevs: fade<Fadeevs>('aurora.fadeeva'), // + marusya.fadeeva как взрослый
        gerbers: fade<Gerbers>('agata.gerber'), // + platon.gerber как взрослый
        kirillovs: fade<Kirillovs>('emma.kirillova'), //
        legoshins: fade<Legoshins>('mila.legoshina'), //
        leonenkos: fade<Leonenkos>('aellita.leonenko'), //
        marshevs: fade<Marshevs>('igor.marshev'), //
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
        petrovs: fade<Petrovs>('varya.petrova'), //
        pimenovs: fade<Pimenovs>('emilia.pimenova'), //
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov', 'fedya.skvortsov'), //
        usarovs: fade<Usarovs>('emil.usarov'), //
        yuzhakovs: none<Yuzhakovs>(), // meera.yuzhakova болела
      },
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
    }),
  ],
  [
    '03.06.2026',
    supermarkets({
      value: -3034,
      name: 'Расходы на выпускной (Петровы)',
      description:
        '3034: Фасоль 556, Бумага 213, Носки 984, Наклейки 164, Дипломы 1072, Шарики 45 ',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), //
        fadeevs: fade<Fadeevs>('aurora.fadeeva'), // + marusya.fadeeva как взрослый
        gerbers: fade<Gerbers>('agata.gerber'), // + platon.gerber как взрослый
        kirillovs: fade<Kirillovs>('emma.kirillova'), //
        legoshins: fade<Legoshins>('mila.legoshina'), //
        leonenkos: fade<Leonenkos>('aellita.leonenko'), //
        marshevs: fade<Marshevs>('igor.marshev'), //
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'), //
        petrovs: fade<Petrovs>('varya.petrova'), //
        pimenovs: fade<Pimenovs>('emilia.pimenova'), //
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov', 'fedya.skvortsov'), //
        usarovs: fade<Usarovs>('emil.usarov'), //
        yuzhakovs: none<Yuzhakovs>(), // meera.yuzhakova болела
      },
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
    }),
  ],
  [
    '03.06.2026',
    english('2026-06-03', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: none<Usarovs>('emil.usarov'), // выпустился
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '03.06.2026',
    {
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
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
      category: 'events',
    },
  ],
  [
    '03.06.2026',
    {
      value: -2550,
      target: {
        bank: 'tbank',
        name: 'Вероника З.',
        user: 'veronika.zolotareva',
      },
      families: {
        chernys: 0, // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: 0, // line<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: 0, // line<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: 0, // line<Usarovs>('emil.usarov'),
        yuzhakovs: 0, // line<Yuzhakovs>('meera.yuzhakova'),
      },
      name: 'Музей',
      description: 'Поход в музей (сопутствующие расходы)',
      timestamp: new Date('2026-06-03T12:00:00+03:00').getTime(),
      category: 'events',
    },
  ],
  [
    '27.05.2026',
    english('2026-05-27', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '22.05.2026',
    english('2026-05-22', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '20.05.2026',
    english('2026-05-20', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '15.05.2026',
    english('2026-05-15', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '13.05.2026',
    english('2026-05-13', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '12.05.2026',
    transfers({
      value: 5000,
      name: 'Денис П.',
      family: 'petrovs',
      timestamp: new Date('2026-05-12T10:54:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Денис П.',
      },
    }),
  ],
  [
    '08.05.2026',
    english('2026-05-08', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '06.05.2026',
    english('2026-05-06', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '04.05.2026',
    gifts({
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
      timestamp: new Date('2026-05-04T10:00:00+03:00').getTime(),
    }),
  ],
  [
    '04.05.2026',
    transfers({
      value: 5000,
      name: 'Ольга Скворцова',
      family: 'fadeevs',
      timestamp: new Date('2026-05-04T09:00:00+03:00').getTime(),
      source: {
        bank: 'riffisen',
        name: 'Ольга С.',
      },
    }),
  ],
  [
    '04.05.2026',
    transfers({
      value: 7000,
      name: 'Надежда Фадеева',
      family: 'fadeevs',
      timestamp: new Date('2026-05-04T09:00:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Надежда Фадеева',
      },
    }),
  ],
  [
    '04.05.2026',
    transfers({
      value: 4000,
      name: 'Софья Г.',
      family: 'fadeevs',
      timestamp: new Date('2026-05-04T09:00:00+03:00').getTime(),
      source: {
        bank: 'sber',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '02.05.2026',
    transfers({
      value: 3000,
      name: 'Мария Легошина',
      family: 'legoshins',
      timestamp: new Date('2026-05-02T11:18:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Дмитрий Л',
      },
    }),
  ],
  [
    '29.04.2026',
    transfers({
      value: 8000,
      name: 'Светлана Еремеева',
      family: 'eremeevs',
      timestamp: new Date('2026-04-29T18:58:00+03:00').getTime(),
      source: {
        bank: 'sber',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '29.04.2026',
    english('2026-04-29', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '28.04.2026',
    transfers({
      value: 6000,
      name: 'Наталья Новицкая',
      family: 'novitskys',
      timestamp: new Date('2026-04-28T18:12:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Наталья Н.',
      },
    }),
  ],
  [
    '28.04.2026',
    transfers({
      value: 10000,
      name: 'Мария Исакова',
      family: 'usarovs',
      timestamp: 1777372500000,
      source: {
        bank: 'tbank',
        name: 'Мария И.',
      },
    }),
  ],
  [
    '24.04.2026',
    english('2026-04-24', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '22.04.2026',
    english('2026-04-22', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '17.04.2026',
    english('2026-04-17', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '15.04.2026',
    english('2026-04-15', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '10.04.2026',
    english('2026-04-10', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
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
    '10.04.2026',
    supermarkets({
      value: -3600,
      timestamp: new Date('2026-04-10T12:05:00+03:00').getTime(),
      name: 'За продукты для детей',
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: none<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('misha.novitskiy'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: none<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
      description: 'За продукты для детей (Софья Г.)',
      target: {
        bank: 'Sber',
        name: 'Софья Гербер',
      },
    }),
  ],
  [
    '08.04.2026',
    english('2026-04-08', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '03.04.2026',
    english('2026-04-03', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '01.04.2026',
    english('2026-04-01', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '25.03.2026',
    english('2026-03-25', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '20.03.2026',
    english('2026-03-20', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // Переведи пожалуйста Веронике 800 рублей.
  // И спиши с Вани, Вари, Эмика и Агаты по 200.
  // Пособия по математике
  [
    '18.03.2026',
    supermarkets({
      value: -800,
      name: 'Пособия по математике',
      description: 'Пособия по математике для Вани, Вари, Эмика и Агаты по 200р',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: line<Eremeevs>('ivan.eremeev'),
        fadeevs: none<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: none<Legoshins>('mila.legoshina'),
        leonenkos: none<Leonenkos>('aellita.leonenko'),
        marshevs: none<Marshevs>('igor.marshev'),
        novitskys: none<Novitskys>('misha.novitskiy', 'anna.novitskaya'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: none<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>('meera.yuzhakova'),
      },
      timestamp: new Date('2026-03-18T11:28:00+03:00').getTime(),
    }),
  ],
  [
    '18.03.2026',
    english('2026-03-18', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '16.03.2026',
    transfers({
      value: 3500,
      name: 'Ольга Кириллова',
      family: 'kirillovs',
      timestamp: new Date('2026-03-16T12:10:00+03:00').getTime(),
      source: {
        bank: 'sber',
        name: 'Ольга К.',
        message: 'Кириллова Эмма',
      },
    }),
  ],
  [
    '13.03.2026',
    english('2026-03-13', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // Верни мне пожалуйста 4500. Вероника покупала музыкальные ложки детям.
  // И спиши с каждого лично ребёнка по 300 рублей. С Миши получается 600 тк за Аню тоже. То есть всего 15 детей = ложек.
  // Мне можешь вернуть наверное сразу 3900 лучше, и не списывать с моих
  [
    '11.03.2026',
    transfers({
      value: +600,
      name: 'За ложки',
      description: 'Это часть от 4500. Оставшиеся 3900 переведены на карту',
      family: 'eremeevs',
      timestamp: new Date('2026-03-11T11:28:00+03:00').getTime(),
      source: {
        bank: 'sbornitsa',
        name: 'Общак',
        message: 'Это часть от 4500. Оставшиеся 3900 перевёл на карту',
      },
    }),
  ],
  [
    '11.03.2026',
    supermarkets({
      value: -4500,
      name: 'Музыкальные ложки',
      description: 'Музыкальные ложки для занятий',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: line<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('misha.novitskiy', 'anna.novitskaya'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: line<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
      timestamp: new Date('2026-03-11T11:28:00+03:00').getTime(),
    }),
  ],
  [
    '11.03.2026',
    english('2026-03-11', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // Ты мне должен перевести 6110 (10094 - 3984)
  // Переведи пожалуйста 3000 (на любой банк), а остальные положи на депозит наш пожалуйста
  // (10094 (итоговая за мальчиков и девочек) - 3984 (добавлял ранее) - 3к (на карту)
  [
    '08.03.2026',
    transfers({
      value: 3110,
      name: 'Из общака',
      description: 'За счёт трат на подарки (10094  - 3984 - 3к)',
      // '10094 (итоговая за мальчиков и девочек) - 3984 (добавлял 23 фев) - 3к (на карту tbank)',
      family: 'eremeevs',
      timestamp: new Date('2026-03-08T01:26:00+03:00').getTime(),
      source: {
        bank: 'sbornitsa',
        name: 'Общак',
        message: 'Остаток от 6110 (3к перевел на карту) За подарки на 23 февраля и 8 марта',
      },
    }),
  ],
  /*
  Можешь пожалуйста со всех списать сумму 13000
  (с меня и Наташи с коэффициентом на второго ребёнка).
  И прислать 7000 - Наташе и 6000 - мне.
  Это на подарки на 8 марта Веронике и Наташе
  Перевел 8 марта в 01:37 (msk) Наташе Новицкой и Светлане Еремеевой
*/
  [
    '08.03.2026',
    gifts({
      value: -13000,
      name: 'Учителям на 8 марта',
      description: 'Подарки на 8 марта Веронике и Наташе',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'), // Наташе тоже?
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy', 'anna.novitskaya'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'), // Наташе тоже?
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
      timestamp: new Date('2026-02-24T10:00:00+03:00').getTime(),
    }),
  ],
  [
    '06.03.2026',
    english('2026-03-06', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '04.03.2026',
    english('2026-03-04', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '27.02.2026',
    english('2026-02-27', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '25.02.2026',
    transfers({
      value: 5000,
      name: 'Ольга Скворцова',
      family: 'skvortsovs',
      timestamp: new Date('2026-02-25T14:05:00+03:00').getTime(),
      source: {
        bank: 'tbank',
        name: 'Ольга С.',
        message: 'За Кирилла',
      },
    }),
  ],
  [
    '25.02.2026',
    english('2026-02-25', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '24.02.2026',
    transfers({
      value: 2877,
      name: 'За счёт трат на масленницу',
      family: 'gerbers',
      timestamp: new Date('2026-02-24T10:00:00+03:00').getTime(),
    }),
  ],
  [
    '24.02.2026',
    supermarkets({
      value: -2877,
      name: 'Масленница',
      description: 'Продукты детям на масленницу',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: none<Legoshins>('mila.legoshina'),
        leonenkos: none<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: none<Novitskys>('misha.novitskiy'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>('meera.yuzhakova'),
      },
      timestamp: new Date('2026-02-24T10:00:00+03:00').getTime(),
    }),
  ],
  // потом еще добавить, так как будут подарки на 8 марта
  [
    '23.02.2026',
    transfers({
      value: 3984,
      name: 'Из общака',
      description: 'За счёт трат на подарки 23 февраля',
      family: 'eremeevs',
      timestamp: new Date('2026-02-23T10:00:00+03:00').getTime(),
      source: {
        name: 'Общак',
        bank: 'sbornitsa',
      },
    }),
  ],
  // 10094 общая сумма всех подарков
  // Делим равные суммы по количеству детей.
  // Количество детей было 16 тк ещё Платон был.
  // То есть на Мишу получается сумма двойная и на Агату
  [
    '23.02.2026',
    gifts({
      value: -10094,
      name: 'Детям на 23 февраля и 8 марта',
      description: 'Подарки на 23 февраля и 8 марта - поделили общую сумму на 16 детей',
      // подарки Платону и другим мальчишкам
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: line<Eremeevs>('vera.eremeeva', 'ivan.eremeev'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: line<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: line<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
      timestamp: new Date('2026-02-23T10:00:00+03:00').getTime(),
    }),
  ],
  [
    '20.02.2026',
    english('2026-02-20', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '18.02.2026',
    english('2026-02-18', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '15.02.2026',
    transfers({
      value: 3000,
      name: 'Надежда Фадеева',
      family: 'fadeevs',
      timestamp: 1739605397000,
      time: '10:43:17', // msk
      source: {
        bank: 'tbank',
        name: 'Надежда Фадеева',
      },
    }),
  ],
  [
    '14.02.2026',
    transfers({
      value: 5000,
      name: 'Мария Исакова',
      family: 'usarovs',
      timestamp: 1771101780000,
      time: '23:43:47', // msk
      source: {
        bank: 'tbank',
        name: 'Мария И.',
      },
    }),
  ],
  [
    '13.02.2026',
    english('2026-02-13', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '11.02.2026',
    english('2026-02-11', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '04.02.2026',
    transfers({
      name: 'Софья Г.',
      value: 5000,
      family: 'gerbers',
      timestamp: new Date('2026-02-04T21:34:00+03:00').getTime(),
      source: {
        bank: 'Sber',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '30.01.2026',
    english('2026-01-30', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '28.01.2026',
    english('2026-01-28', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '27.01.2026',
    transfers({
      value: 8000,
      name: 'Светлана Е.',
      family: 'eremeevs',
      timestamp: new Date('2026-01-27T11:45:00+03:00').getTime(),
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
      family: 'fadeevs',
      timestamp: new Date('2026-01-26T14:05:00+03:00').getTime(),
      source: {
        bank: 'Sber',
        name: 'Надежда Ф.',
        message: 'Авро',
      },
    }),
  ],
  [
    '23.01.2026',
    english('2026-01-23', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '21.01.2026',
    english('2026-01-21', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '16.01.2026',
    english('2026-01-16', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '16.01.2026',
    transfers({
      value: 10000,
      name: 'Ксения Д.',
      family: 'petrovs',
      timestamp: new Date('2026-01-16T13:06:00+03:00').getTime(),
      source: {
        bank: 'VTB',
        name: 'Ксения Д.',
      },
    }),
  ],
  [
    '14.01.2026',
    english('2026-01-14', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '26.12.2025',
    english('2025-12-26', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],

  // Дарим подарки Наташе и Амире.
  // Распредели пожалуйста между всеми 9000.
  // Только у Вани коэффициент 1, у Веры 0.5
  // Кирилловы не ходят на Английский
  [
    '26.12.2025',
    gifts({
      value: -4500,
      name: 'Подарки: Английский',
      timestamp: new Date('2025-12-26T21:51:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>(),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
      description: 'Новогодние подарки Наташе',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '26.12.2025',
    gifts({
      value: -4500,
      name: 'Подарки: Музыка',
      timestamp: new Date('2025-12-26T21:51:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
      description: 'Новогодние подарки Амире',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '23.12.2025',
    music('2025-12-23', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],

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
  [
    '23.12.2025',
    gifts({
      value: -3521,
      name: 'Новогодние расходы',
      timestamp: new Date('2025-12-23T06:17:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>(),
      },
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
      family: 'legoshins',
      timestamp: new Date('2025-12-22T23:03:00+03:00').getTime(),
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
      timestamp: new Date('2025-12-22T21:00:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>(), // в Индии
      },
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
      timestamp: new Date('2025-12-22T20:53:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>(), // в Индии
      },
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
      timestamp: new Date('2025-12-20T17:51:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>(), // в Индии
      },
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
      timestamp: new Date('2026-12-20T17:57:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>(), // в Индии
      },
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
      family: 'gerbers',
      timestamp: new Date('2026-12-20T17:57:00+03:00').getTime(),
      source: {
        bank: 'Tbank',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '19.12.2025',
    english('2025-12-19', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '18.12.2025',
    gifts({
      value: -13000,
      name: 'Подарок Веронике',
      timestamp: new Date('2026-12-18T16:15:00+03:00').getTime(),
      description: '1к с семьи',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: cnst<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: cnst<Fadeevs>('aurora.fadeeva'),
        gerbers: cnst<Gerbers>('agata.gerber'),
        kirillovs: cnst<Kirillovs>('emma.kirillova'),
        legoshins: cnst<Legoshins>('mila.legoshina'),
        leonenkos: cnst<Leonenkos>('aellita.leonenko'),
        marshevs: cnst<Marshevs>('igor.marshev'),
        novitskys: cnst<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: cnst<Petrovs>('varya.petrova'),
        pimenovs: cnst<Pimenovs>('emilia.pimenova'),
        skvortsovs: cnst<Skvortsovs>('kirill.skvortsov'),
        usarovs: cnst<Usarovs>('emil.usarov'),
        yuzhakovs: cnst<Yuzhakovs>('meera.yuzhakova'),
      },
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '17.12.2025',
    english('2025-12-17', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '15.12.2025',
    music('2025-12-15', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '14.12.2025',
    transfers({
      value: 5000,
      name: 'Ольга С.',
      family: 'skvortsovs',
      timestamp: new Date('2026-12-14T14:57:00+03:00').getTime(),
      source: {
        bank: 'Raiffeisen',
        name: 'Ольга С.',
      },
    }),
  ],
  [
    '12.12.2025',
    english('2025-12-12', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '11.12.2025',
    music('2025-12-11', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '10.12.2025',
    english('2025-12-10', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '08.12.2025',
    supermarkets({
      value: -1400,
      timestamp: new Date('2026-12-08T13:47:00+03:00').getTime(),
      name: 'Расходники',
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: none<Yuzhakovs>(), // в Индии
      },
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
      family: 'fadeevs',
      timestamp: new Date('2025-12-08T10:30:00+03:00').getTime(),
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
      family: 'novitskys',
      timestamp: new Date('2025-12-06T13:35:00+03:00').getTime(),
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
      family: 'marshevs',
      timestamp: new Date('2025-12-06T13:33:00+03:00').getTime(),
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
      family: 'kirillovs',
      timestamp: new Date('2025-12-05T16:02:00+03:00').getTime(),
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
      family: 'petrovs',
      timestamp: new Date('2025-12-05T15:28:00+03:00').getTime(),
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
      family: 'eremeevs',
      timestamp: new Date('2025-12-05T11:55:00+03:00').getTime(),
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
      family: 'usarovs',
      timestamp: new Date('2025-12-04T10:31:00+03:00').getTime(),
      source: {
        bank: 'Sber',
        name: 'Мария И.',
      },
    }),
  ],
  [
    '04.12.2025',
    music('2025-12-04', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '03.12.2025',
    english('2025-12-03', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '02.12.2025',
    music('2025-12-02', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '28.11.2025',
    english('2025-11-28', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '26.11.2025',
    english('2025-11-26', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '25.11.2025',
    music('2025-11-25', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '21.11.2025',
    supermarkets({
      value: -2391,
      name: 'Праздник гномиков',
      families: {
        chernys: none<Chernys>(), // ушла
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: line<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('anna.novitskaya'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: line<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
      timestamp: new Date('2025-11-21T18:30:00+03:00').getTime(),
      description: 'Еда для праздника гномиков (Софья Гербер)',
      target: {
        bank: 'Sber',
        name: 'Софья Гербер',
      },
    }),
  ],
  // Привет. Вчера было занятие с Амирой. И сегодня она тоже будет на празднике, как занятие
  [
    '21.11.2025',
    music('2025-11-21', {
      description: 'Участие Амиры в празднике гномиков (музыкальное сопровождение)',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '21.11.2025',
    english('2025-11-21', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '20.11.2025',
    music('2025-11-20', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '19.11.2025',
    english('2025-11-19', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // Переведи пожалуйста Веронике 1600 рублей. Мне 3635 рублей.
  // И спиши с каждого ребёнка с депозита 349 рублей (с Миши получается 349*2 тк за Аню ещё).
  // Это за праздник гномиков за подарки детям и реквизит.
  // I have counted 243 + 107
  [
    '18.11.2025',
    gifts({
      value: -3635,
      name: 'Праздник гномиков',
      timestamp: new Date('2025-11-18T02:45:00+03:00').getTime(),
      description: 'Праздник гномиков (Светлана Еремеева)',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: line<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: line<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
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
      timestamp: new Date('2025-11-18T02:44:00+03:00').getTime(),
      description: 'Праздник гномиков (Вероника Золотарёва)',
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: line<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: line<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
      target: {
        bank: 'Alfa',
        name: 'Вероника Золотарёва',
      },
    }),
  ],
  [
    '14.11.2025',
    english('2025-11-14', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '12.11.2025',
    english('2025-11-12', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '11.11.2025',
    music('2025-11-11', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '10.11.2025',
    music('2025-11-10', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '07.11.2025',
    english('2025-11-07', {
      families: {
        chernys: none<Chernys>(), // left the group
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '06.11.2025',
    music('2025-11-06', {
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '05.11.2025',
    english('2025-11-05', {
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // https://t.me/c/1706315472/27998/29471
  // Анна Новицкая с ноября уже не будет попадать на английский в садике, исключите её из расчётов за английский с какого-нибудь ближайшего момента.
  [
    '25.10.2025',
    transfers({
      value: -5795,
      name: 'Анастасия Ч.',
      family: 'chernys',
      timestamp: new Date('2025-10-25T19:23:00+03:00').getTime(),
      description: 'Возврат остатка Анастасии Черной',
    }),
  ],
  [
    '23.10.2025',
    transfers({
      value: 1555,
      name: 'Дмитрий Л.',
      family: 'legoshins',
      timestamp: new Date('2025-10-23T18:54:00+03:00').getTime(),
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
      timestamp: new Date('2025-10-17T20:33:00+03:00').getTime(),
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
      description: 'Пирамидки для занятий и пастель (Светлана Еремеева)',
      target: {
        bank: 'Tbank',
        name: 'Светлана Еремеева',
      },
    }),
  ],
  [
    '17.10.2025',
    english('2025-10-17', {
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '15.10.2025',
    english('2025-10-15', {
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '09.10.2025',
    english('2025-10-09', {
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '07.10.2025',
    music('2025-10-07', {
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // anastasia.chernaya left the group
  [
    '06.10.2025',
    gifts({
      value: -5300,
      name: 'День учителя',
      timestamp: new Date('2025-10-06T20:28:00+03:00').getTime(),
      description: 'Амире М. ко Дню учителя',
      families: {
        chernys: fade<Chernys>('nina.chernaya', 'vitya.cherny'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
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
      timestamp: new Date('2025-10-06T20:28:00+03:00').getTime(),
      description: 'Наташе М. ко Дню учителя',
      families: {
        chernys: fade<Chernys>('nina.chernaya', 'vitya.cherny'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'),
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
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
      timestamp: new Date('2025-10-03T14:33:00+03:00').getTime(),
      description: 'Овощи и стаканы',
      families: {
        chernys: line<Chernys>('nina.chernaya', 'vitya.cherny'),
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: line<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('anna.novitskaya'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: line<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
      target: {
        bank: 'Tbank',
        name: 'Платон Г.',
      },
    }),
  ],
  [
    '01.10.2025',
    english('2025-10-01', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '30.09.2025',
    music('2025-09-30', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '27.09.2025',
    gifts({
      value: -15000,
      name: 'День воспитателя',
      timestamp: new Date('2025-09-27T12:21:00+03:00').getTime(),
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
    }),
  ],
  [
    '26.09.2025',
    transfers({
      value: 5000,
      name: 'Софья Г.',
      family: 'gerbers',
      timestamp: new Date('2025-09-26T14:34:00+03:00').getTime(),
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
      timestamp: new Date('2025-09-25T12:21:00+03:00').getTime(),
      name: 'Расходники',
      families: {
        chernys: line<Chernys>('vitya.cherny', 'nina.chernaya'),
        eremeevs: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: line<Fadeevs>('aurora.fadeeva'),
        gerbers: line<Gerbers>('agata.gerber'),
        kirillovs: line<Kirillovs>('emma.kirillova'),
        legoshins: line<Legoshins>('mila.legoshina'),
        leonenkos: line<Leonenkos>('aellita.leonenko'),
        marshevs: line<Marshevs>('igor.marshev'),
        novitskys: line<Novitskys>('anna.novitskaya'),
        petrovs: line<Petrovs>('varya.petrova'),
        pimenovs: line<Pimenovs>('emilia.pimenova'),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'),
        usarovs: line<Usarovs>('emil.usarov'),
        yuzhakovs: line<Yuzhakovs>('meera.yuzhakova'),
      },
      description: 'Канцелярские товары',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '24.09.2025',
    english('2025-09-24', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '22.09.2025',
    music('2025-09-22', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: fade<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '19.09.2025',
    english('2025-09-19', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '18.09.2025',
    transfers({
      value: 2000,
      name: 'Светлана Е.',
      family: 'eremeevs',
      timestamp: new Date('2025-09-18T16:55:00+03:00').getTime(),
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
      family: 'skvortsovs',
      timestamp: new Date('2025-09-18T14:57:00+03:00').getTime(),
      source: {
        bank: 'Alfa',
        name: 'Ольга С.',
        message: 'За Скворцова Федю (тетради)',
      },
    }),
  ],
  [
    '18.09.2025',
    english('2025-09-18', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // Федя (Ольга Скворцова)
  // Ваня (Светлана Еремеева)
  // Вари (Ксения Петрова)
  // Агата (Софья Гербер)
  // Платон (Софья Гербер)
  // Аня (Наташа Новицкая)
  // emil.usarov (Мария И.)
  [
    '18.09.2025',
    supermarkets({
      value: -7000,
      timestamp: new Date('2025-09-18T13:26:00+03:00').getTime(),
      name: 'Расходники',
      // 1. 'eremeev' -> Ваня
      // 2. 'skvortsov' -> Федя
      // 3. 'petrov' -> Варя
      // 4. 'gerber' -> Агата
      // 5. 'gerber' -> Платон
      // 6. 'novitskiy' -> Аня
      // 7. 'usarov' -> Эмик
      families: {
        chernys: none<Chernys>(),
        eremeevs: line<Eremeevs>('ivan.eremeev'), // Только Ваня
        fadeevs: none<Fadeevs>(),
        gerbers: line<Gerbers>('agata.gerber', 'platon.gerber'), // Агата, Платон
        kirillovs: none<Kirillovs>(),
        legoshins: none<Legoshins>(),
        leonenkos: none<Leonenkos>(),
        marshevs: none<Marshevs>(),
        novitskys: line<Novitskys>('anna.novitskaya'), // Только Aня
        petrovs: line<Petrovs>('varya.petrova'), // Варя
        pimenovs: none<Pimenovs>(),
        skvortsovs: line<Skvortsovs>('kirill.skvortsov'), // Федя
        usarovs: line<Usarovs>('emil.usarov'), // Эмик
        yuzhakovs: none<Yuzhakovs>(),
      },
      description: '7 тетрадей по 1к',
      target: {
        category: 'Books - МСС 2741',
        name: 'ИП Кривоноженкова А. С.',
      },
    }),
  ],

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

  [
    '17.09.2025',
    transfers({
      value: 5000,
      name: 'Ольга К.',
      family: 'kirillovs',
      timestamp: new Date('2025-09-17T21:10:00+03:00').getTime(),
      description: 'Пополнение кошелька Ольги Кирилловой',
      source: {
        bank: 'Sber',
        name: 'Ольга К.',
        message: 'За Эмму Кириллову (дет. сад)',
      },
    }),
  ],
  [
    '15.09.2025',
    music('2025-09-15', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: fade<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov') / 2,
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '12.09.2025',
    english('2025-09-12', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '10.09.2025',
    english('2025-09-10', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '09.09.2025',
    transfers({
      value: 10000,
      name: 'Анастасия М.',
      family: 'marshevs',
      timestamp: new Date('2025-09-09T22:28:00+03:00').getTime(),
      description: 'Пополнение кошелька Анастасии Маршевой',
      source: {
        bank: 'Tbank',
        name: 'Анастасия М.',
      },
    }),
  ],
  [
    '10.09.2025',
    english('2025-09-10', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '09.09.2025',
    transfers({
      value: 10000,
      name: 'Анастасия М.',
      family: 'marshevs',
      timestamp: new Date('2025-09-09T22:28:00+03:00').getTime(),
      description: 'Пополнение кошелька Анастасии Маршевой',
      source: {
        bank: 'Tbank',
        name: 'Анастасия М.',
      },
    }),
  ],
  [
    '05.09.2025',
    english('2025-09-05', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '04.09.2025',
    music('2025-09-04', {
      // Должно получиться 182
      families: {
        chernys: none<Chernys>(),
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), // 273
        fadeevs: none<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'), // 182
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina'), // 182
        leonenkos: fade<Leonenkos>('aellita.leonenko'), // 182
        marshevs: fade<Marshevs>('igor.marshev'), // 182
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'), // 273+
        petrovs: fade<Petrovs>('varya.petrova'), // 182
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'), // 182
        usarovs: fade<Usarovs>('emil.usarov'), // 182
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'), // 182
      },
    }),
  ],
  [
    '03.09.2025',
    english('2025-09-03', {
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // Ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeevs: fade<Fadeevs>('aurora.fadeeva'),
        gerbers: fade<Gerbers>('agata.gerber'),
        kirillovs: none<Kirillovs>('emma.kirillova'),
        legoshins: fade<Legoshins>('mila.legoshina') / 2,
        leonenkos: fade<Leonenkos>('aellita.leonenko'),
        marshevs: fade<Marshevs>('igor.marshev'),
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'),
        petrovs: fade<Petrovs>('varya.petrova'),
        pimenovs: none<Pimenovs>('emilia.pimenova'),
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov'),
        usarovs: fade<Usarovs>('emil.usarov'),
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'),
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
  [
    '03.09.2025',
    transfers({
      value: 6000,
      name: 'Светлана Е.',
      family: 'eremeevs',
      timestamp: new Date('2025-09-03T16:40:00+03:00').getTime(),
      description: 'Пополнение кошелька Светланы Еремеевой',
      source: {
        bank: 'Alfa',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '01.09.2025',
    transfers({
      value: 10000,
      name: 'Дмитрий Л.',
      family: 'legoshins',
      timestamp: new Date('2025-09-01T15:00:00+03:00').getTime(),
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
      family: 'skvortsovs',
      timestamp: new Date('2025-08-31T15:47:00+03:00').getTime(),
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
      family: 'novitskys',
      timestamp: new Date('2025-08-31T13:59:00+03:00').getTime(),
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
      family: 'fadeevs',
      timestamp: new Date('2025-08-31T12:30:00+03:00').getTime(),
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
      family: 'petrovs',
      timestamp: new Date('2025-08-31T14:57:00+03:00').getTime(),
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
      family: 'chernys',
      timestamp: new Date('2025-08-31T15:00:00+03:00').getTime(),
      description: 'Пополнение кошелька Анастасии Черной',
      source: {
        bank: 'Sber',
        name: 'Анастасия Ч.',
      },
    }),
  ],
  // 28.08.2025: music
  // Перевел Светлане Еремеевой 1300, так как она платила из своего кармана.
  // Должно получиться 104 (1300 / 12.5) - сумма за одного ребенка
  [
    '28.08.2025',
    music('2025-08-28', {
      value: -(1300 - 208), // еще были Евгения Т, Влада Р
      families: {
        chernys: fade<Chernys>('nina.chernaya'), // 104, ходила только Нина
        eremeevs: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), // 156
        fadeevs: none<Fadeevs>('aurora.fadeeva'), // 104, Аврора
        gerbers: fade<Gerbers>('agata.gerber'), // 104, 'platon.gerber' уже в школе
        kirillovs: none<Kirillovs>(), // еще не пришла
        legoshins: none<Legoshins>('mila.legoshina'), // 104, видимо, тут не была
        leonenkos: fade<Leonenkos>('aellita.leonenko'), // 104,
        marshevs: fade<Marshevs>('igor.marshev'), // 104
        novitskys: fade<Novitskys>('anna.novitskaya', 'misha.novitskiy'), // 156
        petrovs: fade<Petrovs>('varya.petrova'), // 104,
        pimenovs: none<Pimenovs>('emilia.pimenova'), //
        skvortsovs: fade<Skvortsovs>('kirill.skvortsov', 'kirill.skvortsov'), // 156, был еще кто-то от него
        usarovs: none<Usarovs>('emil.usarov'), // 104, видимо, тут не было
        yuzhakovs: fade<Yuzhakovs>('meera.yuzhakova'), // 104,
      },
    }),
  ],
]

export const transactions: Transaction[] = rawTransactions.map(([, transaction]) => {
  return {
    id: crypto.randomUUID(),
    name: transaction.name,
    description: transaction.description,
    value: transaction.value,
    timestamp: transaction.timestamp,
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
