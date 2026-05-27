import type { Booking, Room } from '../types/models'

export const stats = [
  { label: 'Rooms online', value: '18' },
]

export const featureCards = [
  {
    title: 'Fast room discovery',
    text: 'Filter by capacity, availability, and floor to find a room in seconds.',
  },
  {
    title: 'Booking with context',
    text: 'See the next available slot and room amenities before you reserve it.',
  },
  {
    title: 'Team-ready profile',
    text: 'Keep your profile and upcoming meetings in one simple dashboard.',
  },
]

export const featuredRooms: Room[] = [
  {
    id: '1',
    name: 'North Atrium',
    building: 'Tower A',
    floor: '12th floor',
    capacity: 12,
    status: 'Available',
    nextSlot: 'Today · 14:00',
    description: 'Bright strategy room with a wall display, speakerphone, and a skyline view.',
    amenities: ['Video wall', 'Whiteboard', 'Coffee station'],
  },
  {
    id: '2',
    name: 'Harbor Boardroom',
    building: 'Tower B',
    floor: '8th floor',
    capacity: 8,
    status: 'Reserved',
    nextSlot: 'Tomorrow · 09:30',
    description: 'Quiet executive room for focused reviews, interviews, and client calls.',
    amenities: ['Conference camera', 'HDMI dock', 'Acoustic panels'],
  },
  {
    id: '3',
    name: 'Skyline Hub',
    building: 'Tower A',
    floor: '15th floor',
    capacity: 20,
    status: 'Busy',
    nextSlot: 'Fri · 11:00',
    description: 'Large collaboration space for workshops, planning sessions, and hybrid meetings.',
    amenities: ['Projector', 'Smart board', 'Breakout zone'],
  },
]

export const defaultBookings: Booking[] = [
  {
    id: 'bk-1',
    roomId: '1',
    roomName: 'North Atrium',
    date: 'May 29, 2026',
    time: '09:30 - 10:30',
    status: 'Confirmed',
    notes: 'Weekly planning',
  },
  {
    id: 'bk-2',
    roomId: '2',
    roomName: 'Harbor Boardroom',
    date: 'May 30, 2026',
    time: '13:00 - 14:00',
    status: 'Pending',
    notes: 'Client onboarding call',
  },
]
