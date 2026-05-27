import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navigation from './Navigation'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Navigation />
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-semibold text-white">
                {user.name?.slice(0, 1).toUpperCase() ?? user.email.slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-slate-900">{user.name ?? 'Booked in'}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
              <button className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700" onClick={() => { logout(); navigate('/') }}>
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200/70 px-4 py-3 lg:hidden">
        <Navigation />
      </div>
    </header>
  )
}
