// Новые пароли семьям: bun run password gurskys eremeevs, или bun run password --all
// Пароль печатается один раз, в репозиторий попадает только хеш.
// Забыли пароль — просто выдайте новый.
import fs from 'node:fs'
import path from 'node:path'

import { hashPassword } from '../lib/tools/password'

const LENGTH = 12
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789' // без похожих: i/l/1, o/0

const file = path.join(process.cwd(), 'lib', 'data', 'families-generated.json')
const families: { id: string; password: string }[] = JSON.parse(fs.readFileSync(file, 'utf-8'))

const args = process.argv.slice(2)
const ids = args.includes('--all') ? families.map(({ id }) => id) : args

if (!ids.length) {
  console.error('Usage: bun run password <family-id...> | --all')
  process.exit(1)
}

const unknown = ids.filter(id => !families.some(family => family.id === id))
if (unknown.length) {
  console.error(`Unknown families: ${unknown.join(', ')}`)
  process.exit(1)
}

const generate = () =>
  Array.from(
    crypto.getRandomValues(new Uint32Array(LENGTH)),
    n => ALPHABET[n % ALPHABET.length]
  ).join('')

for (const family of families) {
  if (!ids.includes(family.id)) continue
  const password = generate()
  family.password = await hashPassword(family.id, password)
  console.info(`${family.id}\t${password}`)
}

fs.writeFileSync(file, JSON.stringify(families, null, 2))
Bun.spawnSync(['bunx', 'oxfmt', file])
