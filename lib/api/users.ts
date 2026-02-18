import type { User } from '@/lib/schemas'
import { familiesRepo, usersRepo } from '@/lib/repositories.instance'

export async function fetchUsers() {
  return usersRepo.findAll()
}

export async function fetchUserById(id: User['id']) {
  return usersRepo.findById(id)
}

export function getUserById(id: User['id']) {
  return usersRepo.findById(id)
}

export async function fetchFamilies() {
  return familiesRepo.findAll()
}

// export async function fetchUserById(id: string) {
//   try {
//     const data = await sql<User[]>`
//       SELECT
//         users.id,
//         users.name,
//         users.email,
//         users.avatar,
//         users.value,
//         users.password
//       FROM users
//       WHERE users.id = ${id};
//     `

//     const user = data.map(user => ({
//       ...user,
//     }))

//     return user[0]
//   } catch (error) {
//     console.error('Database Error:', error)
//     throw new Error(`Failed to fetch user by id "${id}"`)
//   }
// }
