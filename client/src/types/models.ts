export type Room = {
  id: string
  name: string
  building: string
  floor: string
  capacity: number
  status: 'Available' | 'Busy' | 'Reserved'
  nextSlot: string
  description: string
  amenities: string[]
}

export type Booking = {
  id: number | string
  roomId: number | string
  room?: {
    id: number | string
    name: string
    members?: Array<{ id: number; role: string; user: UserProfile }>
  }
  title?: string
  description?: string
  start: string
  end: string
  createdById?: number | string
  participants?: Array<{ id: number; user: UserProfile }>
}

export type BookingDraft = {
  roomId: string
  date: string
  time: string
  notes: string
}

export type UserProfile = {
  id: string | number
  email: string
  name?: string | null
}
