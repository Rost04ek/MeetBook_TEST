
import { useEffect, useState } from 'react'
import { getBookings } from '../api/api'
import type { Booking } from '../types/models'

export default function Bookings() {
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setLoading(true)
		getBookings()
			.then((res: any) => setBookings(Array.isArray(res) ? res : []))
			.catch((e) => setError(e?.message || 'Failed to load bookings'))
			.finally(() => setLoading(false))
	}, [])

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
				) : bookings.map((booking) => (
					<article key={booking.id} className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.22em] text-slate-500">{booking.roomName}</p>
								<h3 className="mt-2 text-xl font-semibold text-slate-950">{booking.date}</h3>
								<p className="mt-1 text-sm text-slate-600">{booking.time}{booking.notes ? ` · ${booking.notes}` : ''}</p>
							</div>
							<div className="flex items-center gap-3">
								<span className={`rounded-full px-3 py-1 text-xs font-medium ${booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : booking.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
									{booking.status}
								</span>
								<button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Open</button>
							</div>
						</div>
					</article>
				))}
			</div>
		</div>
	)
}
