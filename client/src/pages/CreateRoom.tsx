import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom } from '../api/api'

export default function CreateRoom() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // simple validation
    if (!name.trim() || name.trim().length < 3) {
      setError('Name must be at least 3 characters')
      setLoading(false)
      return
    }
    try {
      await createRoom({ name: name.trim(), description })
      navigate('/rooms')
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create room'
      setError(msg)
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 rounded-[1.5rem] border border-white/80 bg-white/85 p-6 shadow-xl">
      <h2 className="text-2xl font-semibold">Create meeting room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
          <button type="button" onClick={() => navigate('/rooms')} className="rounded-full border px-4 py-2">Cancel</button>
        </div>
      </form>
    </div>
  )
}
