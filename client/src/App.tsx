 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
// Navigation component not used in layout currently
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import CreateRoom from './pages/CreateRoom'
import EditRoom from './pages/EditRoom'
import Bookings from './pages/Bookings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider, useAuth } from './context/AuthContext'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#f3f7fb_56%,_#eef4f8_100%)] text-slate-900">
          <div className="pointer-events-none absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="pointer-events-none absolute right-[-6rem] top-36 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
          <Header />

          <main className="relative px-4 py-8 lg:px-8">
            <div className="mx-auto flex max-w-7xl gap-8 lg:flex-row">
              <section className="min-w-0 flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/rooms/create" element={<ProtectedRoute><CreateRoom /></ProtectedRoute>} />
                  <Route path="/rooms/:id" element={<RoomDetail />} />
                  <Route path="/rooms/:id/edit" element={<ProtectedRoute><EditRoom /></ProtectedRoute>} />
                  <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </section>
            </div>
          </main>

        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

