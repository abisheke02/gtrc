export interface Program {
  slug: string
  name: string
  discipline: string
  level: string
  ageGroup: string
  duration: string
  priceInr: number
  summary: string
  highlights: string[]
}

export interface Plan {
  slug: string
  name: string
  period: string
  priceInr: number
  features: string[]
  featured?: boolean
}

export interface ClubEvent {
  slug: string
  name: string
  date: string
  location: string
  priceInr: number
  summary: string
}

export interface Catalog {
  programs: Program[]
  plans: Plan[]
  events: ClubEvent[]
}

export type ItemType = 'PROGRAM' | 'PLAN' | 'EVENT'
