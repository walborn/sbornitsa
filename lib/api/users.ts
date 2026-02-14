// import type { User } from '@/lib/definitions'
import { families, users } from '@/lib/data'
import type { User } from '@/lib/definitions'
export async function fetchUsers() {
  // try {
  //   return await sql<User[]>`SELECT * FROM users`
  // } catch (error) {
  //   console.error('Database Error:', error)
  //   throw new Error('Failed to fetch users.')
  // }
  return users
}

export async function fetchUserById(id: User['id']) {
  // try {
  //   return await sql<User[]>`SELECT * FROM users`
  // } catch (error) {
  //   console.error('Database Error:', error)
  //   throw new Error('Failed to fetch users.')
  // }
  return users?.find(user => user.id === id)
}

export function getUserById(id: User['id']) {
  return users?.find(user => user.id === id)
}

export async function fetchFamilies() {
  // try {
  //   return await sql<User[]>`SELECT * FROM users`
  // } catch (error) {
  //   console.error('Database Error:', error)
  //   throw new Error('Failed to fetch users.')
  // }
  return families
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
