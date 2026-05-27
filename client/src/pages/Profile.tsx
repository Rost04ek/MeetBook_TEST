import { useAuth } from '../context/AuthContext'

export default function Profile() {
	const { user } = useAuth()

	return (
		<div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
			<h2 className="mt-2 text-3xl font-semibold text-slate-950">My profile</h2>
			<div className="mt-6 rounded-2xl bg-slate-50 p-5">
				<div className="text-sm uppercase tracking-[0.22em] text-slate-500">Account</div>
				<div className="mt-2 text-lg font-medium text-slate-950">{user?.name ?? 'No user name yet'}</div>
				<div className="mt-1 text-sm text-slate-600">{user?.email ?? 'No user email yet'}</div>
			</div>
		</div>
	)
}
