export const FAMILY_KEY = 'sbornitsa-family'

import CryptoJS from 'crypto-js'

import { familiesDic } from '@/lib/data'

import type { Family } from './definitions'

export const login = (username: string, password: string): boolean => {
  const family: Family = familiesDic[username as Family['id']]

  const hashedPassword = CryptoJS.SHA256(password).toString()

  if (family?.password !== hashedPassword) return false

  if (typeof window !== 'undefined') {
    localStorage.setItem(FAMILY_KEY, JSON.stringify(family))
  }
  return true
}

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FAMILY_KEY)
  }
}

export const getFamily = (): Family => {
  if (typeof window === 'undefined') return {} as Family

  const familyStr = localStorage.getItem(FAMILY_KEY)
  if (typeof familyStr !== 'string') return {} as Family

  try {
    return JSON.parse(familyStr) as Family
  } catch {
    return {} as Family
  }
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false

  const familyStr = localStorage.getItem(FAMILY_KEY)
  if (typeof familyStr !== 'string') return false

  try {
    const { id, password } = JSON.parse(familyStr) as { id: Family['id']; password: string }
    return id && familiesDic[id]?.password === password
  } catch {
    return false
  }
}
