import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getRoom } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function RoomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [room, setRoom] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setError(null)
    getRoom(id)
      .then((r: any) => setRoom(r))
      .catch((e) => setError(e?.response?.data?.error || String(e)))
  }, [id])

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-red-200 bg-white p-6">
        <div className="text-red-600">Error loading room: {error}</div>
        <div className="mt-4"><Link to="/rooms" className="text-sm text-slate-600">← Back to rooms</Link></div>
      </div>
    )
  }

  if (!room) return <div className="p-6">Loading...</div>

  const isAdmin = room.members?.some((m: any) => m.user?.id === user?.id && m.role === 'ADMIN')

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
              {room.members?.map((m: any) => (
                <li key={m.id} className="flex items-center justify-between">
                  <div>{m.user?.name ?? m.user?.email}</div>
                  <div className="text-xs text-slate-500">{m.role}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700">Bookings</h3>
            <ul className="mt-2 space-y-3">
              {room.bookings?.length ? (
                room.bookings.map((b: any) => (
                  <li key={b.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{b.title || 'Booking'}</div>
                      <div className="text-sm text-slate-500">{new Date(b.start).toLocaleString()} — {new Date(b.end).toLocaleTimeString()}</div>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{b.description}</div>
                  </li>
                ))
              ) : (
                <div className="text-sm text-slate-500">No bookings</div>
              )}
            </ul>
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
