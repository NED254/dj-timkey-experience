import { useEffect, useState } from 'react'

const BLANK_EVENT = { date: '', venue: '', city: '', status: '' }

export default function Admin() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const updateEvent = (i, field, value) => {
    setEvents((prev) => prev.map((ev, idx) => (idx === i ? { ...ev, [field]: value } : ev)))
  }

  const addEvent = () => setEvents((prev) => [...prev, { ...BLANK_EVENT }])
  const removeEvent = (i) => setEvents((prev) => prev.filter((_, idx) => idx !== i))

  const save = async () => {
    setSaveState('saving')
    setErrorMsg('')
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, events }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveState('error')
        setErrorMsg(data.error || 'Something went wrong')
        return
      }
      setSaveState('success')
    } catch {
      setSaveState('error')
      setErrorMsg('Network error')
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-sm p-8">
          <h1 className="text-white text-xl font-bold uppercase mb-6">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && password && setUnlocked(true)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-4 py-3 text-white mb-4 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => password && setUnlocked(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-sm transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-2xl font-bold uppercase mb-8">Manage Upcoming Events</h1>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((ev, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center">
                <input
                  placeholder="Date (e.g. Oct 4)"
                  value={ev.date}
                  onChange={(e) => updateEvent(i, 'date', e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  placeholder="Venue"
                  value={ev.venue}
                  onChange={(e) => updateEvent(i, 'venue', e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  placeholder="City"
                  value={ev.city}
                  onChange={(e) => updateEvent(i, 'city', e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  placeholder="Status (e.g. Tickets open)"
                  value={ev.status}
                  onChange={(e) => updateEvent(i, 'status', e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => removeEvent(i)}
                  className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={addEvent}
              className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors"
            >
              + Add Event
            </button>

            <button
              onClick={save}
              disabled={saveState === 'saving'}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50"
            >
              {saveState === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>

            {saveState === 'success' && (
              <p className="text-blue-400 text-sm text-center">Saved - the live site is updated.</p>
            )}
            {saveState === 'error' && (
              <p className="text-red-400 text-sm text-center">{errorMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
