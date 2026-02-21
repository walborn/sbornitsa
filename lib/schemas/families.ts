import type { User } from './index'

export type Chernys = Extract<User['id'], 'anastasia.chernaya' | 'vitya.cherny' | 'nina.chernaya'>[]
export type Eremeevs = Extract<User['id'], 'ivan.eremeev' | 'vera.eremeeva'>[]
export type Pimenovs = Extract<User['id'], 'alexandra.pimenova' | 'emilia.pimenova'>[]
export type Novitskys = Extract<
  User['id'],
  'natasha.novitskaya' | 'misha.novitskiy' | 'anna.novitskaya'
>[]
export type Legoshins = Extract<User['id'], 'maria.legoshina' | 'mila.legoshina'>[]
export type Marshevs = Extract<User['id'], 'anastasia.marsheva' | 'igor.marshev'>[]
export type Petrovs = Extract<User['id'], 'ksenya.petrova' | 'denis.petrov' | 'varya.petrova'>[]
export type Yuzhakovs = Extract<
  User['id'],
  'ornella.zubkova' | 'boris.yuzhakov' | 'meera.yuzhakova'
>[]
export type Fadeevs = Extract<
  User['id'],
  'nadezhda.fadeeva' | 'gennady.fadeev' | 'aurora.fadeeva' | 'marusya.fadeeva'
>[]
export type Gerbers = Extract<User['id'], 'sofya.gerber' | 'agata.gerber' | 'platon.gerber'>[]
export type Skvortsovs = Extract<User['id'], 'olga.skvortsova' | 'kirill.skvortsov'>[]
export type Kirillovs = Extract<User['id'], 'olga.kirillova' | 'emma.kirillova'>[]
export type Usarovs = Extract<User['id'], 'maria.usarova' | 'emil.usarov'>[]
export type Leonenkos = Extract<User['id'], 'polina.leonenko' | 'aellita.leonenko'>[]
