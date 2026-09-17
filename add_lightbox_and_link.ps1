# Run from inside dj-timkey-experience\

# ---------- src/pages/Admin.jsx ----------
@'
import { useEffect, useState } from "react"
import { upload } from "@vercel/blob/client"

const BLANK_EVENT = { date: "", venue: "", city: "", status: "", image: "", link: "" }

export default function Admin() {
  const [password, setPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [uploadingIndex, setUploadingIndex] = useState(null)

  useEffect(() => {
    fetch("/api/events")
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

  const handleFileChange = async (i, file) => {
    if (!file) return
    setUploadingIndex(i)
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({ password }),
      })
      updateEvent(i, "image", blob.url)
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploadingIndex(null)
    }
  }

  const save = async () => {
    setSaveState("saving")
    setErrorMsg("")
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, events }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveState("error")
        setErrorMsg(data.error || "Something went wrong")
        return
      }
      setSaveState("success")
    } catch {
      setSaveState("error")
      setErrorMsg("Network error")
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
            onKeyDown={(e) => e.key === "Enter" && password && setUnlocked(true)}
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
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center">
                  <input
                    placeholder="Date (e.g. Oct 4)"
                    value={ev.date}
                    onChange={(e) => updateEvent(i, "date", e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Venue"
                    value={ev.venue}
                    onChange={(e) => updateEvent(i, "venue", e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="City"
                    value={ev.city}
                    onChange={(e) => updateEvent(i, "city", e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Status (e.g. Tickets open)"
                    value={ev.status}
                    onChange={(e) => updateEvent(i, "status", e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeEvent(i)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2"
                  >
                    Remove
                  </button>
                </div>

                <input
                  placeholder="Booking / ticket link (optional, e.g. https://wa.me/... or a ticket site URL)"
                  value={ev.link || ""}
                  onChange={(e) => updateEvent(i, "link", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />

                <div className="flex items-center gap-4">
                  {ev.image && (
                    <img src={ev.image} alt="" className="w-16 h-16 object-cover rounded-sm border border-zinc-700" />
                  )}
                  <label className="text-sm text-zinc-400">
                    <span className="inline-block bg-zinc-800 border border-zinc-700 hover:border-blue-500 text-white px-4 py-2 rounded-sm cursor-pointer transition-colors">
                      {uploadingIndex === i ? "Uploading..." : ev.image ? "Replace poster/photo" : "Add poster/photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(i, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
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
              disabled={saveState === "saving"}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50"
            >
              {saveState === "saving" ? "Saving..." : "Save Changes"}
            </button>

            {saveState === "success" && (
              <p className="text-blue-400 text-sm text-center">Saved - the live site is updated.</p>
            )}
            {saveState === "error" && (
              <p className="text-red-400 text-sm text-center">{errorMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
'@ | Set-Content -Path ".\src\pages\Admin.jsx" -Encoding UTF8

# ---------- src/chapters/Events.jsx ----------
@'
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && events.length === 0) return null

  return (
    <section id="events" className="relative bg-black py-24 md:py-36 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Catch Timkey Live
        </motion.h2>

        {loading ? (
          <p className="text-zinc-400">Loading events...</p>
        ) : (
          <div className="border-t border-zinc-800">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-[64px_110px_1fr_auto_auto] gap-3 md:gap-6 items-center py-6 border-b border-zinc-800"
              >
                {ev.image ? (
                  <button
                    onClick={() => setLightboxImage(ev.image)}
                    className="w-16 h-16 rounded-sm border border-zinc-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Enlarge photo"
                  >
                    <img src={ev.image} alt={ev.venue} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                  </button>
                ) : (
                  <div className="w-16 h-16 hidden md:block" />
                )}
                <span className="text-white font-bold text-lg uppercase">{ev.date}</span>
                <span>
                  <span className="text-white font-semibold">{ev.venue}</span>
                  {ev.city && <span className="text-zinc-400 text-sm block md:inline md:ml-2">{ev.city}</span>}
                </span>
                {ev.status && (
                  <span className="text-blue-400 text-sm font-semibold uppercase tracking-wide">{ev.status}</span>
                )}
                {ev.link && (
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="justify-self-start md:justify-self-end px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-sm transition-colors whitespace-nowrap"
                  >
                    Book / Tickets
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImage}
              alt=""
              className="max-w-full max-h-full object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white text-3xl leading-none hover:text-blue-400 transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
'@ | Set-Content -Path ".\src\chapters\Events.jsx" -Encoding UTF8

Write-Host "Added tap-to-enlarge lightbox and booking link field." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
