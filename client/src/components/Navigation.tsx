 
import { NavLink } from 'react-router-dom'

export default function Navigation() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<NavLink to="/" end className={({ isActive }) => `rounded-full px-3 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
				Overview
			</NavLink>
			<NavLink to="/rooms" className={({ isActive }) => `rounded-full px-3 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
				Rooms
			</NavLink>
			<NavLink to="/bookings" className={({ isActive }) => `rounded-full px-3 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
				Bookings
			</NavLink>
		</div>
	)
}
