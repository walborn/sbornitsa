/**
 * Repository Pattern для Events
 *
 * Централизованный доступ к транзакциям с оптимизацией
 */

import type { Event, EventCategory } from '@/lib/schemas'

export class EventsRepository {
  private readonly eventsById: Map<Event['id'], Event>
  private readonly eventsByCategory: Map<EventCategory['id'], Event[]>
  private readonly allEvents: Event[]

  constructor(events: Event[]) {
    this.allEvents = events

    // Индексация по ID
    this.eventsById = new Map(events.map(t => [t.id as Event['id'], t]))

    // Индексация по категориям
    this.eventsByCategory = new Map()
    for (const event of events) {
      for (const category of event.categories) {
        const categoryEvents = this.eventsByCategory.get(category) ?? []
        categoryEvents.push(event)
        this.eventsByCategory.set(category, categoryEvents)
      }
    }
  }

  /**
   * Получить событие по ID
   * Complexity: O(1)
   */
  findById(id: Event['id']): Event | undefined {
    return this.eventsById.get(id)
  }

  /**
   * Получить все события
   * Complexity: O(1)
   */
  findAll(): Event[] {
    return this.allEvents
  }

  /**
   * Получить события по категории
   * Complexity: O(1)
   */
  findByCategory(categoryId: EventCategory['id']): Event[] {
    return this.eventsByCategory.get(categoryId) ?? []
  }

  /**
   * Получить события за период
   */
  findByPeriod(startDate: number, endDate: number): Event[] {
    return this.findAll().filter(
      t => (t.start >= startDate && t.start <= endDate) || (t.end >= startDate && t.end <= endDate)
    )
  }

  /**
   * Сортировка по дате (новые первые)
   */
  sortByStartTimeDesc(events: Event[]): Event[] {
    return [...events].sort((a, b) => b.start - a.start)
  }

  /**
   * Сортировка по дате (старые первые)
   */
  sortByStartTimeAsc(events: Event[]): Event[] {
    return [...events].sort((a, b) => a.start - b.start)
  }

  /**
   * Сортировка по дате (старые первые)
   */
  sortByFinishTimeAsc(events: Event[]): Event[] {
    return [...events].sort((a, b) => a.end - b.end)
  }

  /**
   * Сортировка по дате (старые первые)
   */
  sortByFinishTimeDesc(events: Event[]): Event[] {
    return [...events].sort((a, b) => b.end - a.end)
  }

  /**
   * Получить количество событий
   */
  count(): number {
    return this.eventsById.size
  }
}
