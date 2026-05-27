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
  id: string
  roomId: string
  roomName: string
  date: string
  time: string
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  notes?: string
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
