import type { Family } from '@/lib/definitions'
import { arrayToObjectById } from '@/lib/utils'

export class Families {
  private families: Family[] = [
    {
      id: 'cherny',
      mother: 'anastasia-chernaya',
      children: ['vitya.cherny', 'nina.chernaya'],
      password: '3c8a5f1b9d2e7f4a',
      avatar: '/avatars/anastasia.chernaya.webp',
      value: 0,
    },
    {
      id: 'eremeev',
      mother: 'svetlana-eremeeva',
      children: ['vanya.eremeev', 'vera.eremeeva'],
      password: '2f8a5c1b9d3e7f4a',
      avatar: '/avatars/svetlana.eremeeva.webp',
      value: 0,
    },
    {
      id: 'yuzhakov',
      mother: 'ornella-zubkova',
      father: 'boris-yuzhakov',
      children: ['meera.yuzhakova'],
      password: 'qweqwe', //'5c9a3f8b1d2e7f4a',
      avatar: '/avatars/ornella.zubkova.webp',
      value: 0,
    },
    {
      id: 'legoshin',
      mother: 'maria-legoshina',
      children: ['mila.legoshina'],
      password: '8c3a5f1b9d2e7f4a',
      avatar: '/avatars/maria.legoshina.webp',
      value: 0,
    },
    {
      id: 'novitskiy',
      mother: 'natasha-novitskaya',
      children: ['misha.novitskiy', 'anna.novitskaya'],
      password: '9c2a5f8b1d3e7f4a',
      avatar: '/avatars/natasha.novitskaya.webp',
      value: 0,
    },
    {
      id: 'skvortsov',
      mother: 'olga-skvortsova',
      children: ['kirill.skvortsov'],
      password: '2c8a5f1b9d3e7f4a',
      avatar: '/avatars/olga.skvortsova.webp',
      value: 0,
    },
    {
      id: 'gerber',
      mother: 'sofya-gerber',
      children: ['agata.gerber', 'platon.gerber'],
      password: '3c9a5f8b1d2e7f4a',
      avatar: '/avatars/sofya.gerber.webp',
      value: 0,
    },
    {
      id: 'usarov',
      mother: 'maria-usarova',
      children: ['emik.usarov'],
      password: '7c3a5f8b1d2e9f4a',
      avatar: '/avatars/maria.usarova.webp',
      value: 0,
    },
    {
      id: 'fadeev',
      mother: 'nadezhda-fadeeva',
      password: '8c3a5f1b9d2e7f4a',
      children: ['avrora.fadeeva'],
      avatar: '/avatars/nadezhda.fadeeva.webp',
      value: 0,
    },
    {
      id: 'marshev',
      mother: 'anastasia-marsheva',
      children: ['igor.marshev'],
      password: '5c8a3f1b9d2e7f4a',
      avatar: '/avatars/anastasia.marsheva.webp',
      value: 0,
    },
    {
      id: 'petrov',
      mother: 'ksenya-petrova',
      children: ['varya.petrova'],
      password: '2c9a5f8b1d3e7f4a',
      avatar: '/avatars/ksenya.petrova.webp',
      value: 0,
    },
    {
      id: 'polina-family',
      mother: 'polina-leonenko',
      children: ['aellita.polina'],
      password: '9c2a5f8b1d3e7f4a',
      avatar: '/avatars/polina.leonenko.webp',
      value: 0,
    },
    {
      id: 'pimenov',
      mother: 'alexandra-pimenova',
      children: ['emma.pimenova'],
      password: '3c8a5f1b9d2e7f4a',
      avatar: '/avatars/alexandra.pimenova.webp',
      value: 0,
    },
    {
      id: 'kirillov',
      mother: 'olga-kirillova',
      children: ['emma.kirillova'],
      password: 'lkaj23j46jakjc9',
      avatar: '/avatars/olga.kirillova.webp',
      value: 0,
    },
  ]

  dic(): Record<Family['id'], Family> {
    return arrayToObjectById(this.families)
  }

  update_values(values: Record<Family['id'], number>) {
    this.families = this.families.map(family => ({
      ...family,
      value: values[family.id] ?? family.value,
    }))
    return this.families
  }

  set(families: Family[]) {
    this.families = families
  }

  get(): Family[] {
    return this.families
  }

  getById(id: Family['id']): Family | undefined {
    return this.families.find(u => u.id === id)
  }

  all() {
    return this.families.map(u => u.id)
  }

  except(ids: Family['id'][]) {
    return this.all().filter((i: Family['id']) => !ids.includes(i))
  }
}
