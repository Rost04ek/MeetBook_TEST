import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}

export async function login(email: string, password: string): Promise<unknown> {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export async function register(name: string, email: string, password: string): Promise<unknown> {
  const res = await api.post('/auth/register', { name, email, password })
  return res.data
}

export async function getRooms(): Promise<unknown> {
  const res = await api.get('/rooms')
  return res.data
}

export async function getRoom(id: string): Promise<unknown> {
  const res = await api.get(`/rooms/${id}`)
  return res.data
}

export async function createRoom(payload: { name: string; description?: string }): Promise<unknown> {
  const res = await api.post('/rooms', payload)
  return res.data
}

export async function updateRoom(id: string | number, payload: { name?: string; description?: string }): Promise<unknown> {
  const res = await api.put(`/rooms/${id}`, payload)
  return res.data
}

export async function deleteRoom(id: string | number): Promise<unknown> {
  const res = await api.delete(`/rooms/${id}`)
  return res.data
}

export async function getBookings(): Promise<unknown> {
  const res = await api.get('/bookings')
  return res.data
}

export async function createBooking(payload: unknown): Promise<unknown> {
  const res = await api.post('/bookings', payload)
  return res.data
}

export async function updateBooking(id: string | number, payload: unknown): Promise<unknown> {
  const res = await api.put(`/bookings/${id}`, payload)
  return res.data
}

export async function deleteBooking(id: string | number): Promise<unknown> {
  const res = await api.delete(`/bookings/${id}`)
  return res.data
}

export default api
