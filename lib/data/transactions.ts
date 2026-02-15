import type {
  Category,
  Cherny,
  Eremeevs,
  Fadeevs,
  FamiliesIncomes,
  Family,
  FamilyTransaction,
  Gerbers,
  Kirillovs,
  Legoshins,
  Leonenkos,
  Marshevs,
  Novitsky,
  Petrovs,
  Pimenovs,
  Skvortsovs,
  Transaction,
  TransactionSource,
  TransactionTarget,
  Usarovs,
  User,
  Yuzhakovs,
} from '@/lib/definitions'

const cnst = <T extends string[]>(...args: T) => 2 // 2, 2, 2, 2
const fade = <T extends string[]>(...args: T) => args.length + 1 // 2, 3, 4, 5
const line = <T extends string[]>(...args: T) => args.length * 2 // 2, 4, 6, 8
const none = <T extends string[]>(...args: T) => 0

type RawTransaction = {
  name: string
  description: string
  timestamp?: number // для точного времени
  value: number
  category: Category['id']
  teacher?: User['id']
  time: string
  families: FamiliesIncomes
  children?: string[][]
  target?: TransactionTarget
  source?: TransactionSource
}

type EnglishTransaction = Omit<
  RawTransaction,
  'name' | 'description' | 'value' | 'category' | 'teacher' | 'time'
> & {
  value?: number
}
const english = (transaction: EnglishTransaction): RawTransaction => ({
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
  time: '11:00',
  category: 'english',
})

type MusicTransaction = Omit<
  RawTransaction,
  'name' | 'description' | 'value' | 'category' | 'teacher' | 'time'
> & {
  name?: string
  description?: string
  value?: number
  category?: Category['id']
  teacher?: User['id']
  time?: string
}
const music = (transaction: MusicTransaction): RawTransaction => ({
  // эти свойства можно перезаписать
  value: -2000,
  name: 'Music',
  description: 'Оплата занятий по музыке',
  teacher: 'amira.h',
  time: '11:00',
  target: {
    bank: 'Sber',
    name: 'Амира Х.',
  },
  // перезаписываем и дополняем
  ...transaction,
  // эти свойства нельзя перезаписывать
  category: 'music',
})

type TransferTransaction = Omit<RawTransaction, 'description' | 'category' | 'families'> & {
  description?: string
  family: Family['id']
}

const transfers = ({ family, ...trasaction }: TransferTransaction): RawTransaction => ({
  description: `Пополнение кошелька: ${family}`,
  families: {
    cherny: 0,
    eremeev: 0,
    fadeev: 0,
    gerber: 0,
    kirillov: 0,
    legoshin: 0,
    leonenko: 0,
    marshev: 0,
    novitskiy: 0,
    petrov: 0,
    pimenov: 0,
    skvortsov: 0,
    usarov: 0,
    yuzhakov: 0,
    [family]: 1,
  },
  ...trasaction,
  category: 'transfers',
})

type GiftsTransaction = Omit<RawTransaction, 'families' | 'category'> & {
  families?: FamiliesIncomes
}

const gifts = (trasaction: GiftsTransaction): RawTransaction => ({
  families: {
    cherny: none<Cherny>(), // ушла
    eremeev: cnst<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
    fadeev: cnst<Fadeevs>('aurora.fadeeva'),
    gerber: cnst<Gerbers>('agata.gerber', 'platon.gerber'),
    kirillov: cnst<Kirillovs>('emma.kirillova'),
    legoshin: cnst<Legoshins>('mila.legoshina'),
    leonenko: cnst<Leonenkos>('aellita.leonenko'),
    marshev: cnst<Marshevs>('igor.marshev'),
    novitskiy: cnst<Novitsky>('anna.novitskaya'),
    petrov: cnst<Petrovs>('varya.petrova'),
    pimenov: cnst<Pimenovs>('emilia.pimenova'),
    skvortsov: cnst<Skvortsovs>('kirill.skvortsov'),
    usarov: cnst<Usarovs>('emil.usarov'),
    yuzhakov: cnst<Yuzhakovs>('meera.yuzhakova'),
  },
  ...trasaction,
  category: 'gifts',
})

type SupermarketsTransaction = Omit<RawTransaction, 'category'>
const supermarkets = (trasaction: SupermarketsTransaction): RawTransaction => ({
  ...trasaction,
  category: 'supermarkets',
})

const rawTransactions: [string, RawTransaction][] = [
  [
    '15.02.2026',
    transfers({
      value: 3000,
      name: 'Надежда Фадеева',
      family: 'fadeev',
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
      family: 'usarov',
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
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '11.02.2026',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '04.02.2026',
    transfers({
      name: 'Софья Г.',
      value: 5000,
      family: 'gerber',
      time: '21:34',
      source: {
        bank: 'Sber',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '30.01.2026',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '28.01.2026',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '27.01.2026',
    transfers({
      value: 8000,
      name: 'Светлана Е.',
      family: 'eremeev',
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
      family: 'fadeev',
      time: '14:05',
      source: {
        bank: 'Sber',
        name: 'Надежда Ф.',
        message: 'Авро',
      },
    }),
  ],
  [
    '23.01.2026',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '21.01.2026',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '16.01.2026',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '16.01.2026',
    transfers({
      value: 10000,
      name: 'Ксения Д.',
      family: 'petrov',
      time: '13:06',
      source: {
        bank: 'VTB',
        name: 'Ксения Д.',
      },
    }),
  ],
  [
    '14.01.2026',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '26.12.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],

  // Дарим подарки Наташе и Амире.
  // Распредели пожалуйста между всеми 9000.
  // Только у Вани коэффициент 1, у Веры 0.5
  [
    '26.12.2025',
    gifts({
      value: -9000,
      name: 'Подарки: Музыка и Английский',
      time: '21:51',
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
      description: 'Новогодние подарки Амире и Наташе',
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '23.12.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
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
      time: '6:17',
      families: {
        cherny: none<Cherny>(), // ушла
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: none<Yuzhakovs>(),
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
      family: 'legoshin',
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
      families: {
        cherny: none<Cherny>(), // ушла
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: none<Yuzhakovs>(), // в Индии
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
      time: '20:53',
      families: {
        cherny: none<Cherny>(), // ушла
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: none<Yuzhakovs>(), // в Индии
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
      time: '17:51',
      families: {
        cherny: none<Cherny>(), // ушла
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: none<Yuzhakovs>(), // в Индии
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
      time: '17:57',
      families: {
        cherny: none<Cherny>(), // ушла
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva', 'marusya.fadeeva'), // была на празднике Маруся
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: none<Yuzhakovs>(), // в Индии
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
      family: 'gerber',
      time: '17:57',
      source: {
        bank: 'Tbank',
        name: 'Софья Г.',
      },
    }),
  ],
  [
    '19.12.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '18.12.2025',
    gifts({
      value: -13000,
      name: 'Подарок Веронике',
      time: '16:15',
      description: '1к с семьи',
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: cnst<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: cnst<Fadeevs>('aurora.fadeeva'),
        gerber: cnst<Gerbers>('agata.gerber'),
        kirillov: cnst<Kirillovs>('emma.kirillova'),
        legoshin: cnst<Legoshins>('mila.legoshina'),
        leonenko: cnst<Leonenkos>('aellita.leonenko'),
        marshev: cnst<Marshevs>('igor.marshev'),
        novitskiy: cnst<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: cnst<Petrovs>('varya.petrova'),
        pimenov: cnst<Pimenovs>('emilia.pimenova'),
        skvortsov: cnst<Skvortsovs>('kirill.skvortsov'),
        usarov: cnst<Usarovs>('emil.usarov'),
        yuzhakov: cnst<Yuzhakovs>('meera.yuzhakova'),
      },
      target: {
        bank: 'Tbank',
        name: 'Светлана Е.',
      },
    }),
  ],
  [
    '17.12.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '15.12.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '14.12.2025',
    transfers({
      value: 5000,
      name: 'Ольга С.',
      family: 'skvortsov',
      time: '14:57',
      source: {
        bank: 'Raiffeisen',
        name: 'Ольга С.',
      },
    }),
  ],
  [
    '12.12.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '11.12.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '10.12.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '08.12.2025',
    supermarkets({
      value: -1400,
      time: '13:47',
      name: 'Расходники',
      families: {
        cherny: none<Cherny>(), // ушла
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: none<Yuzhakovs>(), // в Индии
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
      family: 'fadeev',
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
      family: 'novitskiy',
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
      family: 'marshev',
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
      family: 'kirillov',
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
      family: 'petrov',
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
      family: 'eremeev',
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
      family: 'usarov',
      time: '10:31',
      source: {
        bank: 'Sber',
        name: 'Мария И.',
      },
    }),
  ],
  [
    '04.12.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '03.12.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '02.12.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '28.11.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '26.11.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '25.11.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '21.11.2025',
    supermarkets({
      value: -2391,
      name: 'Праздник гномиков',
      families: {
        cherny: none<Cherny>(), // ушла
        eremeev: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: line<Fadeevs>('aurora.fadeeva'),
        gerber: line<Gerbers>('agata.gerber'),
        kirillov: line<Kirillovs>('emma.kirillova'),
        legoshin: line<Legoshins>('mila.legoshina'),
        leonenko: line<Leonenkos>('aellita.leonenko'),
        marshev: line<Marshevs>('igor.marshev'),
        novitskiy: line<Novitsky>('anna.novitskaya'),
        petrov: line<Petrovs>('varya.petrova'),
        pimenov: line<Pimenovs>('emilia.pimenova'),
        skvortsov: line<Skvortsovs>('kirill.skvortsov'),
        usarov: line<Usarovs>('emil.usarov'),
        yuzhakov: line<Yuzhakovs>('meera.yuzhakova'),
      },
      time: '18:30',
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
    music({
      description: 'Участие Амиры в празднике гномиков (музыкальное сопровождение)',
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '21.11.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '20.11.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '19.11.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
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
      time: '02:45',
      description: 'Праздник гномиков (Светлана Еремеева)',
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: line<Fadeevs>('aurora.fadeeva'),
        gerber: line<Gerbers>('agata.gerber'),
        kirillov: line<Kirillovs>('emma.kirillova'),
        legoshin: line<Legoshins>('mila.legoshina'),
        leonenko: line<Leonenkos>('aellita.leonenko'),
        marshev: line<Marshevs>('igor.marshev'),
        novitskiy: line<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: line<Petrovs>('varya.petrova'),
        pimenov: line<Pimenovs>('emilia.pimenova'),
        skvortsov: line<Skvortsovs>('kirill.skvortsov'),
        usarov: line<Usarovs>('emil.usarov'),
        yuzhakov: line<Yuzhakovs>('meera.yuzhakova'),
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
      time: '02:44',
      description: 'Праздник гномиков (Вероника Золотарёва)',
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: line<Fadeevs>('aurora.fadeeva'),
        gerber: line<Gerbers>('agata.gerber'),
        kirillov: line<Kirillovs>('emma.kirillova'),
        legoshin: line<Legoshins>('mila.legoshina'),
        leonenko: line<Leonenkos>('aellita.leonenko'),
        marshev: line<Marshevs>('igor.marshev'),
        novitskiy: line<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: line<Petrovs>('varya.petrova'),
        pimenov: line<Pimenovs>('emilia.pimenova'),
        skvortsov: line<Skvortsovs>('kirill.skvortsov'),
        usarov: line<Usarovs>('emil.usarov'),
        yuzhakov: line<Yuzhakovs>('meera.yuzhakova'),
      },
      target: {
        bank: 'Alfa',
        name: 'Вероника Золотарёва',
      },
    }),
  ],
  [
    '14.11.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '12.11.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '11.11.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '10.11.2025',
    music({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '07.11.2025',
    english({
      families: {
        cherny: none<Cherny>(), // left the group
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '06.11.2025',
    music({
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '05.11.2025',
    english({
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '25.10.2025',
    transfers({
      value: -5795,
      name: 'Анастасия Ч.',
      family: 'cherny',
      time: '19:23',
      description: 'Возврат остатка Анастасии Черной',
    }),
  ],
  [
    '23.10.2025',
    transfers({
      value: 1555,
      name: 'Дмитрий Л.',
      family: 'legoshin',
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
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
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
    english({
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '15.10.2025',
    english({
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '09.10.2025',
    english({
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '07.10.2025',
    music({
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  // anastasia.chernaya left the group
  [
    '06.10.2025',
    gifts({
      value: -5300,
      name: 'День учителя',
      time: '20:28',
      description: 'Амире М. ко Дню учителя',
      families: {
        cherny: fade<Cherny>('nina.chernaya', 'vitya.cherny'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
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
      time: '20:28',
      description: 'Наташе М. ко Дню учителя',
      families: {
        cherny: fade<Cherny>('nina.chernaya', 'vitya.cherny'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'),
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
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
      time: '14:33',
      description: 'Овощи и стаканы',
      families: {
        cherny: line<Cherny>('nina.chernaya', 'vitya.cherny'),
        eremeev: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: line<Fadeevs>('aurora.fadeeva'),
        gerber: line<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillov: line<Kirillovs>('emma.kirillova'),
        legoshin: line<Legoshins>('mila.legoshina'),
        leonenko: line<Leonenkos>('aellita.leonenko'),
        marshev: line<Marshevs>('igor.marshev'),
        novitskiy: line<Novitsky>('anna.novitskaya'),
        petrov: line<Petrovs>('varya.petrova'),
        pimenov: line<Pimenovs>('emilia.pimenova'),
        skvortsov: line<Skvortsovs>('kirill.skvortsov'),
        usarov: line<Usarovs>('emil.usarov'),
        yuzhakov: line<Yuzhakovs>('meera.yuzhakova'),
      },
      target: {
        bank: 'Tbank',
        name: 'Платон Г.',
      },
    }),
  ],
  [
    '01.10.2025',
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '30.09.2025',
    music({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '27.09.2025',
    gifts({
      value: -15000,
      name: 'День воспитателя',
      time: '12:21',
      description: 'Поздравление Вероники с днем воспитателя',
      families: {
        cherny: 500, // fade<Cherny>('vitya.cherny', 'nina.chernaya'), // Ходила только Нина
        eremeev: 2000, // fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: 1000, // fade<Fadeevs>('aurora.fadeeva'),
        gerber: 1000, // fade<Gerbers>('agata.gerber', 'platon.gerber'),
        kirillov: 1000, // fade<Kirillovs>('emma.kirillova'),
        legoshin: 1000, // fade<Legoshins>('mila.legoshina'),
        leonenko: 1000, // fade<Leonenkos>('aellita.leonenko'),
        marshev: 2000, // fade<Marshevs>('igor.marshev'),
        novitskiy: 1000, // fade<Novitsky>('anna.novitskaya'),
        petrov: 1000, // fade<Petrovs>('varya.petrova'),
        pimenov: 1, // fade<Pimenovs>('emilia.pimenova'), - кажется она специально не скидывалась
        skvortsov: 1000, // fade<Skvortsovs>('kirill.skvortsov'),
        usarov: 1000, // fade<Usarovs>('emil.usarov'),
        yuzhakov: 1500, // fade<Yuzhakovs>('meera.yuzhakova'),
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
      family: 'gerber',
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
      families: {
        cherny: line<Cherny>('vitya.cherny', 'nina.chernaya'),
        eremeev: line<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: line<Fadeevs>('aurora.fadeeva'),
        gerber: line<Gerbers>('agata.gerber'),
        kirillov: line<Kirillovs>('emma.kirillova'),
        legoshin: line<Legoshins>('mila.legoshina'),
        leonenko: line<Leonenkos>('aellita.leonenko'),
        marshev: line<Marshevs>('igor.marshev'),
        novitskiy: line<Novitsky>('anna.novitskaya'),
        petrov: line<Petrovs>('varya.petrova'),
        pimenov: line<Pimenovs>('emilia.pimenova'),
        skvortsov: line<Skvortsovs>('kirill.skvortsov'),
        usarov: line<Usarovs>('emil.usarov'),
        yuzhakov: line<Yuzhakovs>('meera.yuzhakova'),
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
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '22.09.2025',
    music({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: fade<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '19.09.2025',
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '18.09.2025',
    transfers({
      value: 2000,
      name: 'Светлана Е.',
      family: 'eremeev',
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
      family: 'skvortsov',
      time: '14:57',
      source: {
        bank: 'Alfa',
        name: 'Ольга С.',
        message: 'За Скворцова Федю (тетради)',
      },
    }),
  ],
  [
    '18.09.2025',
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
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
      time: '13:26',
      name: 'Расходники',
      // 1. 'eremeev' -> Ваня
      // 2. 'skvortsov' -> Федя
      // 3. 'petrov' -> Варя
      // 4. 'gerber' -> Агата
      // 5. 'gerber' -> Платон
      // 6. 'novitskiy' -> Аня
      // 7. 'usarov' -> Эмик
      families: {
        cherny: none<Cherny>(),
        eremeev: line<Eremeevs>('ivan.eremeev'), // Только Ваня
        fadeev: none<Fadeevs>(),
        gerber: line<Gerbers>('agata.gerber', 'platon.gerber'), // Агата, Платон
        kirillov: none<Kirillovs>(),
        legoshin: none<Legoshins>(),
        leonenko: none<Leonenkos>(),
        marshev: none<Marshevs>(),
        novitskiy: line<Novitsky>('anna.novitskaya'), // Только Aня
        petrov: line<Petrovs>('varya.petrova'), // Варя
        pimenov: none<Pimenovs>(),
        skvortsov: line<Skvortsovs>('kirill.skvortsov'), // Федя
        usarov: line<Usarovs>('emil.usarov'), // Эмик
        yuzhakov: none<Yuzhakovs>(),
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
  // 5 Эмма К.       1           1
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
      family: 'kirillov',
      time: '21:10',
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
    music({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov') / 2,
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '12.09.2025',
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '10.09.2025',
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '09.09.2025',
    transfers({
      value: 10000,
      name: 'Анастасия М.',
      family: 'marshev',
      time: '22:28',
      description: 'Пополнение кошелька Анастасии Маршевой',
      source: {
        bank: 'Tbank',
        name: 'Анастасия М.',
      },
    }),
  ],
  [
    '10.09.2025',
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '09.09.2025',
    transfers({
      value: 10000,
      name: 'Анастасия М.',
      family: 'marshev',
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
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
      },
    }),
  ],
  [
    '04.09.2025',
    music({
      // Должно получиться 182
      families: {
        cherny: none<Cherny>(),
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), // 273
        fadeev: none<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'), // 182
        kirillov: none<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina'), // 182
        leonenko: fade<Leonenkos>('aellita.leonenko'), // 182
        marshev: fade<Marshevs>('igor.marshev'), // 182
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'), // 273+
        petrov: fade<Petrovs>('varya.petrova'), // 182
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'), // 182
        usarov: fade<Usarovs>('emil.usarov'), // 182
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'), // 182
      },
    }),
  ],
  [
    '03.09.2025',
    english({
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // Ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'),
        fadeev: fade<Fadeevs>('aurora.fadeeva'),
        gerber: fade<Gerbers>('agata.gerber'),
        kirillov: fade<Kirillovs>('emma.kirillova'),
        legoshin: fade<Legoshins>('mila.legoshina') / 2,
        leonenko: fade<Leonenkos>('aellita.leonenko'),
        marshev: fade<Marshevs>('igor.marshev'),
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'),
        petrov: fade<Petrovs>('varya.petrova'),
        pimenov: none<Pimenovs>('emilia.pimenova'),
        skvortsov: fade<Skvortsovs>('kirill.skvortsov'),
        usarov: fade<Usarovs>('emil.usarov'),
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'),
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
  // 5 Эмма К.       1           1
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
      family: 'eremeev',
      time: '16:40',
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
      family: 'legoshin',
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
      family: 'skvortsov',
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
      family: 'novitskiy',
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
      family: 'fadeev',
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
      family: 'petrov',
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
      family: 'cherny',
      time: '15:00',
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
    music({
      value: -(1300 - 208), // еще были Евгения Т, Влада Р
      families: {
        cherny: fade<Cherny>('nina.chernaya'), // 104, ходила только Нина
        eremeev: fade<Eremeevs>('ivan.eremeev', 'vera.eremeeva'), // 156
        fadeev: none<Fadeevs>('aurora.fadeeva'), // 104, Аврора
        gerber: fade<Gerbers>('agata.gerber'), // 104, 'platon.gerber' уже в школе
        kirillov: none<Kirillovs>(), // еще не пришла
        legoshin: none<Legoshins>('mila.legoshina'), // 104, видимо, тут не была
        leonenko: fade<Leonenkos>('aellita.leonenko'), // 104,
        marshev: fade<Marshevs>('igor.marshev'), // 104
        novitskiy: fade<Novitsky>('anna.novitskaya', 'misha.novitskiy'), // 156
        petrov: fade<Petrovs>('varya.petrova'), // 104,
        pimenov: none<Pimenovs>('emilia.pimenova'), //
        skvortsov: fade<Skvortsovs>('kirill.skvortsov', 'kirill.skvortsov'), // 156, был еще кто-то от него
        usarov: none<Usarovs>('emil.usarov'), // 104, видимо, тут не было
        yuzhakov: fade<Yuzhakovs>('meera.yuzhakova'), // 104,
      },
    }),
  ],
]

export const transactions: Transaction[] = rawTransactions.map(([date, transaction]) => {
  const [day, month, year] = date.split('.').map(Number)
  const [hours, minutes] = transaction.time.split(':').map(Number)
  const timestamp = new Date(year, month - 1, day, hours ?? 12, minutes ?? 0).getTime()

  return {
    id: crypto.randomUUID(),
    name: transaction.name,
    description: transaction.description,
    value: transaction.value,
    timestamp: transaction.timestamp ?? timestamp,
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
