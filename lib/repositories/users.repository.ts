/**
 * Repository Pattern для Users
 *
 * Централизованный доступ к пользователям с оптимизацией через Map
 */

import type { FamilyId, User, UserId, UserTag } from '@/lib/schemas'

export class UsersRepository {
  private readonly usersById: Map<UserId, User>
  private readonly usersByFamily: Map<FamilyId, User[]>
  private readonly usersByTag: Map<UserTag, User[]>

  constructor(users: User[]) {
    // Индексация по ID
    this.usersById = new Map(users.map(u => [u.id, u]))

    // Индексация по семьям
    this.usersByFamily = new Map()
    for (const user of users) {
      if (user.family) {
        const familyUsers = this.usersByFamily.get(user.family) ?? []
        familyUsers.push(user)
        this.usersByFamily.set(user.family, familyUsers)
      }
    }

    // Индексация по тегам
    this.usersByTag = new Map()
    for (const user of users) {
      for (const tag of user.tags) {
        const taggedUsers = this.usersByTag.get(tag) ?? []
        taggedUsers.push(user)
        this.usersByTag.set(tag, taggedUsers)
      }
    }
  }

  /**
   * Получить пользователя по ID
   * Complexity: O(1)
   */
  findById(id: UserId): User | undefined {
    return this.usersById.get(id)
  }

  /**
   * Получить всех пользователей семьи
   * Complexity: O(1)
   */
  findByFamily(familyId: FamilyId): User[] {
    return this.usersByFamily.get(familyId) ?? []
  }

  /**
   * Получить пользователей по тегу
   * Complexity: O(1)
   */
  findByTag(tag: UserTag): User[] {
    return this.usersByTag.get(tag) ?? []
  }

  /**
   * Получить всех пользователей
   */
  findAll(): User[] {
    return Array.from(this.usersById.values())
  }

  /**
   * Поиск пользователей по имени (нечувствительно к регистру)
   */
  searchByName(query: string): User[] {
    const lowerQuery = query.toLowerCase()
    return this.findAll().filter(u => u.name.toLowerCase().includes(lowerQuery))
  }

  /**
   * Получить количество пользователей
   */
  count(): number {
    return this.usersById.size
  }

  /**
   * Проверить существование пользователя
   */
  exists(id: UserId): boolean {
    return this.usersById.has(id)
  }
}
