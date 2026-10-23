// хеши лежат в публичном бандле, поэтому медленный PBKDF2 с солью, а не голый SHA-256
// WebCrypto: одинаково работает в браузере (логин) и в Bun (scripts/password.ts)
const ITERATIONS = 600_000

export const hashPassword = async (familyId: string, password: string) => {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: encoder.encode(`sbornitsa:${familyId}`),
      iterations: ITERATIONS,
    },
    key,
    256
  )
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('')
}
