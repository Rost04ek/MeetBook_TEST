import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const { register } = useAuth()
	const navigate = useNavigate()

  function isValidGmail(email: string) {
    return /^[a-z0-9._%+-]+@gmail\.com$/i.test(email.trim())
  }

	async function submit(e: React.FormEvent) {
		e.preventDefault()
 		if (!isValidGmail(email)) {
 			alert('Please use a valid Gmail address (example@gmail.com).')
 			return
 		}
 		try {
 			await register(name, email, password)
 			navigate('/profile')
 		} catch (error) {
 			console.error(error)
 			alert('Registration failed')
 		}
	}

	return (
		<div className="mx-auto max-w-md rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
			<p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Get started</p>
			<h2 className="mt-2 text-3xl font-semibold text-slate-950">Create account</h2>
			<p className="mt-2 text-sm leading-6 text-slate-600">Set up your workspace access and start booking rooms in minutes.</p>
			<form onSubmit={submit} className="mt-6 space-y-4">
				<input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.12)]" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<div className="flex items-center justify-between gap-4">
					<button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800" type="submit">Create account</button>
					<Link to="/login" className="text-sm font-medium text-sky-700 transition hover:text-sky-900">Sign in</Link>
				</div>
			</form>
		</div>
	)
}
