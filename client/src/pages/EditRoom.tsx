import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoom, updateRoom, deleteRoom } from '../api/api'
import { useAuth } from '../context/AuthContext'
import type { Room, UserProfile } from '../types/models'

export default function EditRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getRoom(id).then((r) => {
      const room = r as Room & { members?: Array<{ id: number; role: string; user: UserProfile }> }
      const isAdmin = room.members?.some((m) => m.user?.id === user?.id && m.role === 'ADMIN')
      if (!isAdmin) {
        alert('You are not allowed to edit this room')
        navigate('/rooms')
        return
      }
      setName(room.name || '')
      setDescription(room.description || '')
    }).catch((e) => console.error(e))
  }, [id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setError(null)
    setLoading(true)
    // validation
    if (!name.trim() || name.trim().length < 3) {
      setError('Name must be at least 3 characters')
      setLoading(false)
      return
    }
    try {
      await updateRoom(id, { name: name.trim(), description })
      navigate('/rooms')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to save'
      setError(msg)
      console.error(err)
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    if (!confirm('Delete this room?')) return
    await deleteRoom(id)
    navigate('/rooms')
  }

  return (
    <div className="space-y-6 rounded-[1.5rem] border border-white/80 bg-white/85 p-6 shadow-xl">
      <h2 className="text-2xl font-semibold">Edit meeting room</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
          {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/rooms')} className="rounded-full border px-4 py-2">Cancel</button>
          <button type="button" onClick={handleDelete} className="ml-auto rounded-full border border-red-400 px-4 py-2 text-red-600">Delete</button>
        </div>
      </form>
    </div>
  )
}
