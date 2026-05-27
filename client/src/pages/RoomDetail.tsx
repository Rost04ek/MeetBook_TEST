import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getRoom, createBooking, updateBooking, deleteBooking } from '../api/api'
import { useAuth } from '../context/AuthContext'
import type { Room, Booking, UserProfile } from '../types/models'

type Member = { id: number; role: string; user: UserProfile }

type RoomWithRelations = Room & { members?: Member[]; bookings?: Booking[] }

type EditValues = {
  title?: string
  description?: string
  date?: string
  startTime?: string
  endTime?: string
}

export default function RoomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [room, setRoom] = useState<RoomWithRelations | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<EditValues>({})

  useEffect(() => {
    if (!id) return
    setError(null)
    getRoom(id)
      .then((r) => setRoom(r as RoomWithRelations))
      .catch((e) => setError(e?.response?.data?.error || String(e)))
  }, [id])

  function refresh() {
    if (!id) return
    getRoom(id).then((r) => setRoom(r as RoomWithRelations)).catch((e) => setError(e?.response?.data?.error || String(e)))
  }

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-red-200 bg-white p-6">
        <div className="text-red-600">Error loading room: {error}</div>
        <div className="mt-4"><Link to="/rooms" className="text-sm text-slate-600">← Back to rooms</Link></div>
      </div>
    )
  }

  if (!room) return <div className="p-6">Loading...</div>

  const isAdmin = room.members?.some((m: Member) => m.user?.id === user?.id && m.role === 'ADMIN')

  return (
    <div className="space-y-6 rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-xl lg:p-8">
      <div className="flex items-center justify-between">
        <Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950">← Back to rooms</Link>
        {isAdmin && (
          <div className="flex gap-2">
            <Link to={`/rooms/${room.id}/edit`} className="rounded-full bg-amber-600 px-3 py-1 text-sm font-medium text-white">Edit</Link>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{room.building}</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">{room.name}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{room.description}</p>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700">Members</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {room.members?.map((m: Member) => (
                <li key={m.id} className="flex items-center justify-between">
                  <div>{m.user?.name ?? m.user?.email}</div>
                  <div className="text-xs text-slate-500">{m.role}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700">Bookings</h3>
            <div className="mt-2">
              {isAdmin && (
                <div className="mb-4">
                  <button onClick={() => { setCreating((c) => !c); setFormError(null) }} className="rounded-full bg-sky-600 px-3 py-1 text-sm font-medium text-white">{creating ? 'Close' : 'Create booking'}</button>
                  {creating && (
                    <div className="mt-3 space-y-2">
                      {formError && <div className="text-sm text-red-600">{formError}</div>}
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded border px-3 py-2" />
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full rounded border px-3 py-2" />
                      <div className="flex gap-2">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded border px-3 py-2" />
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded border px-3 py-2" />
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded border px-3 py-2" />
                      </div>
                      <div>
                        <button onClick={async () => {
                          setFormError(null)
                          if (!date) return setFormError('Select a date')
                          const s = new Date(`${date}T${startTime}:00`)
                          const e = new Date(`${date}T${endTime}:00`)
                          try {
                            await createBooking({ roomId: room.id, title, description, start: s.toISOString(), end: e.toISOString(), participants: [] })
                            setCreating(false)
                            setTitle('')
                            setDescription('')
                            setDate('')
                            setStartTime('09:00')
                            setEndTime('10:00')
                            refresh()
                          } catch (err: any) {
                            const status = err?.response?.status
                            if (status === 409) setFormError('Time conflict — booking overlaps an existing one')
                            else setFormError(err?.response?.data?.error || String(err))
                          }
                        }} className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white">Save</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <ul className="space-y-3">
                {room.bookings?.length ? (
                  room.bookings.map((b: Booking) => (
                    <li key={b.id} className="rounded-md border p-3">
                      {editingId === b.id ? (
                        <div className="space-y-2">
                          <input value={editValues.title ?? b.title} onChange={(e) => setEditValues((s) => ({ ...s, title: e.target.value }))} className="w-full rounded border px-3 py-2" />
                          <textarea value={editValues.description ?? b.description} onChange={(e) => setEditValues((s) => ({ ...s, description: e.target.value }))} className="w-full rounded border px-3 py-2" />
                          <div className="flex gap-2">
                            <input type="date" value={editValues.date ?? new Date(b.start).toISOString().slice(0,10)} onChange={(e) => setEditValues((s) => ({ ...s, date: e.target.value }))} className="rounded border px-3 py-2" />
                            <input type="time" value={editValues.startTime ?? new Date(b.start).toTimeString().slice(0,5)} onChange={(e) => setEditValues((s) => ({ ...s, startTime: e.target.value }))} className="rounded border px-3 py-2" />
                            <input type="time" value={editValues.endTime ?? new Date(b.end).toTimeString().slice(0,5)} onChange={(e) => setEditValues((s) => ({ ...s, endTime: e.target.value }))} className="rounded border px-3 py-2" />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={async () => {
                              try {
                                const s = new Date(`${editValues.date ?? new Date(b.start).toISOString().slice(0,10)}T${editValues.startTime ?? new Date(b.start).toTimeString().slice(0,5)}:00`)
                                const e = new Date(`${editValues.date ?? new Date(b.start).toISOString().slice(0,10)}T${editValues.endTime ?? new Date(b.end).toTimeString().slice(0,5)}:00`)
                                await updateBooking(b.id, { title: editValues.title, description: editValues.description, start: s.toISOString(), end: e.toISOString() })
                                setEditingId(null)
                                setEditValues({})
                                refresh()
                              } catch (err: any) {
                                const status = err?.response?.status
                                if (status === 409) setFormError('Time conflict — booking overlaps an existing one')
                                else setFormError(err?.response?.data?.error || String(err))
                              }
                            }} className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-medium text-white">Save</button>
                            <button onClick={() => { setEditingId(null); setEditValues({}); setFormError(null) }} className="rounded-full border px-3 py-1 text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{b.title || 'Booking'}</div>
                            <div className="text-sm text-slate-500">{new Date(b.start).toLocaleString()} — {new Date(b.end).toLocaleTimeString()}</div>
                          </div>
                          <div className="mt-1 text-sm text-slate-600">{b.description}</div>
                          {isAdmin && (
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => { setEditingId(b.id); setEditValues({ title: b.title, description: b.description, date: new Date(b.start).toISOString().slice(0,10), startTime: new Date(b.start).toTimeString().slice(0,5), endTime: new Date(b.end).toTimeString().slice(0,5) }); setFormError(null) }} className="rounded-full bg-amber-600 px-3 py-1 text-sm font-medium text-white">Edit</button>
                              <button onClick={async () => {
                                if (!confirm('Cancel this booking?')) return
                                try {
                                  await deleteBooking(b.id)
                                  refresh()
                                } catch (err: any) {
                                  setFormError(err?.response?.data?.error || String(err))
                                }
                              }} className="rounded-full border px-3 py-1 text-sm">Cancel</button>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">No bookings</div>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Status</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${room.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : room.status === 'Busy' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
              {room.status}
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between gap-4"><span>Floor</span><span className="font-medium">{room.floor}</span></div>
            <div className="flex justify-between gap-4"><span>Capacity</span><span className="font-medium">{room.capacity}</span></div>
          </div>

          {(!isAdmin) && (
            <button onClick={() => navigate('/login')} className="mt-6 w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white">Sign in to manage</button>
          )}
        </div>
      </div>
    </div>
  )
}
