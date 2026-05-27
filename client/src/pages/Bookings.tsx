

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBookings, updateBooking, deleteBooking } from '../api/api'
import type { Booking, UserProfile } from '../types/models'

type EditValues = {
  title?: string
  description?: string
  date?: string
  startTime?: string
  endTime?: string
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { token, user } = useAuth()
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editValues, setEditValues] = useState<EditValues>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    loadBookings()
  }, [token])

  function loadBookings() {
    setLoading(true)
    getBookings()
      .then((res) => setBookings(Array.isArray(res) ? (res as Booking[]) : []))
      .catch((e: any) => setError(e?.message || `Request failed with status code ${e?.response?.status || ''}`))
      .finally(() => setLoading(false))
  }

  async function saveEdit(b: Booking) {
    setFormError(null)
    try {
      const s = new Date(`${editValues.date ?? new Date(b.start).toISOString().slice(0, 10)}T${editValues.startTime ?? new Date(b.start).toTimeString().slice(0, 5)}:00`)
      const e = new Date(`${editValues.date ?? new Date(b.start).toISOString().slice(0, 10)}T${editValues.endTime ?? new Date(b.end).toTimeString().slice(0, 5)}:00`)
      await updateBooking(b.id, { title: editValues.title, description: editValues.description, start: s.toISOString(), end: e.toISOString() })
      setEditingId(null)
      setEditValues({})
      loadBookings()
    } catch (err: any) {
      if (err?.response?.status === 409) setFormError('Time conflict — booking overlaps an existing one')
      else setFormError(err?.response?.data?.error || String(err))
    }
  }

  async function cancelBooking(b: Booking) {
    if (!confirm('Cancel this booking?')) return
    try {
      await deleteBooking(b.id)
      loadBookings()
    } catch (err: any) {
      setFormError(err?.response?.data?.error || String(err))
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">Your upcoming meetings</h2>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div>Loading bookings...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <ul className="space-y-3">
            {bookings.length === 0 && <div className="text-sm text-slate-500">No bookings</div>}
            {bookings.map((b) => {
              const isAdmin = !!b.room?.members?.some((m: { id: number; role: string; user: UserProfile }) => m.user?.id === user?.id && m.role === 'ADMIN')
              return (
                <li key={b.id} className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
                      {editingId === b.id ? (
                    <div className="space-y-2">
                      {formError && <div className="text-red-600">{formError}</div>}
                      <input value={editValues.title ?? b.title ?? ''} onChange={(e) => setEditValues((s) => ({ ...(s as EditValues), title: e.target.value }))} className="w-full rounded border px-3 py-2" />
                      <textarea value={editValues.description ?? b.description ?? ''} onChange={(e) => setEditValues((s) => ({ ...(s as EditValues), description: e.target.value }))} className="w-full rounded border px-3 py-2" />
                      <div className="flex gap-2">
                        <input type="date" value={editValues.date ?? new Date(b.start).toISOString().slice(0, 10)} onChange={(e) => setEditValues((s) => ({ ...(s as EditValues), date: e.target.value }))} className="rounded border px-3 py-2" />
                        <input type="time" value={editValues.startTime ?? new Date(b.start).toTimeString().slice(0, 5)} onChange={(e) => setEditValues((s) => ({ ...(s as EditValues), startTime: e.target.value }))} className="rounded border px-3 py-2" />
                        <input type="time" value={editValues.endTime ?? new Date(b.end).toTimeString().slice(0, 5)} onChange={(e) => setEditValues((s) => ({ ...(s as EditValues), endTime: e.target.value }))} className="rounded border px-3 py-2" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => saveEdit(b)} className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white">Save</button>
                        <button onClick={() => { setEditingId(null); setEditValues({}); setFormError(null) }} className="rounded-full border px-3 py-1 text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{b.room?.name ?? 'Room'}</p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-950">{new Date(b.start).toLocaleDateString()}</h3>
                        <p className="mt-1 text-sm text-slate-600">{new Date(b.start).toLocaleTimeString()} — {new Date(b.end).toLocaleTimeString()}{b.description ? ` · ${b.description}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingId(b.id); setEditValues({ title: b.title, description: b.description, date: new Date(b.start).toISOString().slice(0, 10), startTime: new Date(b.start).toTimeString().slice(0, 5), endTime: new Date(b.end).toTimeString().slice(0, 5) }); setFormError(null) }} className="rounded-full bg-amber-600 px-3 py-1 text-sm font-medium text-white">Edit</button>
                            <button onClick={() => cancelBooking(b)} className="rounded-full border px-3 py-1 text-sm">Cancel</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
