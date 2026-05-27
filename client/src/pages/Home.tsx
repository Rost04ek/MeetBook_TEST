import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getRooms } from '../api/api'

export default function Home() {
  const [roomsCount, setRoomsCount] = useState<number | null>(null)

  useEffect(() => {
    getRooms()
      .then((res: any) => setRoomsCount(Array.isArray(res) ? res.length : 0))
      .catch(() => setRoomsCount(0))
  }, [])

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-2xl shadow-slate-950/5 backdrop-blur-xl lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              Meeting room control center
            </div>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Book the right room without slowing the rest of the team.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              MeetBook keeps discovery, reservations, and your schedule in one calm workspace. The interface is designed for fast scanning, clear status, and fewer clicks.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex gap-3">
                <Link to="/rooms" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                  Browse rooms
                </Link>
                <Link to="/bookings" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                  View bookings
                </Link>
              </div>

              <div className="ml-auto">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 w-44">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Rooms</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-950">{roomsCount ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
          </div>
        </div>
      </section>

      {/* Featured rooms removed from Overview per request */}
    </div>
  )
}
