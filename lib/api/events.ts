import { eventsRepo } from '@/lib/repositories'
import type { Event } from '@/lib/schemas'

export async function fetchEvents() {
  return eventsRepo.findAll()
}

export async function fetchEventById(id: Event['id']) {
  return eventsRepo.findById(id)
}
