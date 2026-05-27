import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRooms } from '../api/api'
import type { Room } from '../types/models'

export default function Rooms() {
	const [query, setQuery] = useState('')
	const { user, token } = useAuth()
	const [rooms, setRooms] = useState<Room[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	useEffect(() => {
		// wait until auth token is set — server requires auth
		if (!token) return
		loadRooms()
	}, [token])

	function loadRooms() {
		setLoading(true)
		getRooms()
			.then((res) => setRooms(Array.isArray(res) ? (res as Room[]) : []))
			.catch((e: any) => setError(e?.message || `Request failed with status code ${e?.response?.status || ''}`))
			.finally(() => setLoading(false))
	}

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase()
		if (!normalized) return rooms
		return rooms.filter((room) => {
			const haystack = [room.name, room.building, room.floor, room.description, ...(room.amenities || [])]
			return haystack.some((value: string) => String(value || '').toLowerCase().includes(normalized))
		})
	}, [query, rooms])

	return (
		<div className="space-y-6">
			<div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="w-full">
						<h2 className="mt-2 text-3xl font-semibold text-slate-950 text-left">Find the right room fast</h2>
					</div>
					<div className="w-full max-w-md">
						<div className="flex items-center gap-3">
							{/** Show Create only to authenticated users */}
							{user ? (
								<Link to="/rooms/create" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Create</Link>
							) : null}
							<div className="flex-1">
								<label className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Search</label>
								<input
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="North Atrium, projector, tower A..."
									className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-300 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{loading ? (
					<div>Loading rooms...</div>
				) : error ? (
					<div className="text-red-600">{error}</div>
				) : filtered.map((room) => (
					<article key={room.id} className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs uppercase tracking-[0.22em] text-slate-500">{room.building}</p>
								<h3 className="mt-2 text-xl font-semibold text-slate-950">{room.name}</h3>
							</div>
							<span className={`rounded-full px-3 py-1 text-xs font-medium ${room.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : room.status === 'Busy' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
								{room.status}
							</span>
						</div>

						<p className="mt-4 text-sm leading-6 text-slate-600">{room.description}</p>

						<div className="mt-4 flex flex-wrap gap-2">
							{(room.amenities || []).map((item: string) => (
								<span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{item}</span>
							))}
						</div>

						<div className="mt-5 flex items-center justify-between text-sm text-slate-500">
							<span>{room.floor}</span>
							<span>{room.capacity} seats</span>
						</div>

						<div className="mt-5">
							<Link to={`/rooms/${room.id}`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">View</Link>
						</div>
					</article>
				))}
			</div>
		</div>
	)
}
