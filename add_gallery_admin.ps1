# Run from inside dj-timkey-experience\

# ---------- api/gallery.js ----------
@'
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const gallery = (await kv.get("gallery")) || { photoSessions: [], videoSessions: [] };
    return res.status(200).json(gallery);
  }

  if (req.method === "POST") {
    const { password, photoSessions, videoSessions } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(photoSessions) || !Array.isArray(videoSessions)) {
      return res.status(400).json({ error: "photoSessions and videoSessions must be arrays" });
    }

    await kv.set("gallery", { photoSessions, videoSessions });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
'@ | Set-Content -Path ".\api\gallery.js" -Encoding UTF8

# ---------- src/pages/Admin.jsx ----------
@'
import { useEffect, useState } from "react"
import { upload } from "@vercel/blob/client"

const BLANK_EVENT = { date: "", venue: "", city: "", status: "", image: "", link: "" }
const MAX_CLIP_SECONDS = 30

function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    video.onerror = () => reject(new Error("Could not read video file"))
    video.src = URL.createObjectURL(file)
  })
}

function Login({ password, setPassword, onSubmit }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-sm p-8">
        <h1 className="text-white text-xl font-bold uppercase mb-6">Admin Login</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && password && onSubmit()}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-4 py-3 text-white mb-4 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={onSubmit}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-sm transition-colors"
        >
          Enter
        </button>
      </div>
    </div>
  )
}

function EventsManager({ password }) {
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

  if (loading) return <p className="text-zinc-400">Loading...</p>

  return (
    <div className="flex flex-col gap-4">
      {events.map((ev, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center">
            <input placeholder="Date (e.g. Oct 4)" value={ev.date} onChange={(e) => updateEvent(i, "date", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input placeholder="Venue" value={ev.venue} onChange={(e) => updateEvent(i, "venue", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input placeholder="City" value={ev.city} onChange={(e) => updateEvent(i, "city", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input placeholder="Status (e.g. Tickets open)" value={ev.status} onChange={(e) => updateEvent(i, "status", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={() => removeEvent(i)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove</button>
          </div>
          <input placeholder="Booking / ticket link (optional)" value={ev.link || ""} onChange={(e) => updateEvent(i, "link", e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          <div className="flex items-center gap-4">
            {ev.image && <img src={ev.image} alt="" className="w-16 h-16 object-cover rounded-sm border border-zinc-700" />}
            <label className="text-sm text-zinc-400">
              <span className="inline-block bg-zinc-800 border border-zinc-700 hover:border-blue-500 text-white px-4 py-2 rounded-sm cursor-pointer transition-colors">
                {uploadingIndex === i ? "Uploading..." : ev.image ? "Replace poster/photo" : "Add poster/photo"}
              </span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(i, e.target.files[0])} className="hidden" />
            </label>
          </div>
        </div>
      ))}

      <button onClick={addEvent} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">+ Add Event</button>
      <button onClick={save} disabled={saveState === "saving"} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50">
        {saveState === "saving" ? "Saving..." : "Save Changes"}
      </button>
      {saveState === "success" && <p className="text-blue-400 text-sm text-center">Saved - the live site is updated.</p>}
      {saveState === "error" && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
    </div>
  )
}

function PhotoSessionEditor({ session, onChange, onRemove, password }) {
  const [uploading, setUploading] = useState(false)

  const handlePhotos = async (files) => {
    setUploading(true)
    try {
      const uploaded = []
      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: JSON.stringify({ password }),
        })
        uploaded.push(blob.url)
      }
      onChange({ ...session, photos: [...session.photos, ...uploaded] })
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (idx) => {
    onChange({ ...session, photos: session.photos.filter((_, i) => i !== idx) })
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
        <input placeholder="Session title (e.g. Live at Java)" value={session.title} onChange={(e) => onChange({ ...session, title: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        <input placeholder="Date (e.g. Sep 20)" value={session.date} onChange={(e) => onChange({ ...session, date: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        <button onClick={onRemove} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove Session</button>
      </div>

      <div className="flex flex-wrap gap-3">
        {session.photos.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} alt="" className="w-20 h-20 object-cover rounded-sm border border-zinc-700" />
            <button onClick={() => removePhoto(i)} className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs leading-none">&times;</button>
          </div>
        ))}
      </div>

      <label className="text-sm text-zinc-400 self-start">
        <span className="inline-block bg-zinc-800 border border-zinc-700 hover:border-blue-500 text-white px-4 py-2 rounded-sm cursor-pointer transition-colors">
          {uploading ? "Uploading..." : "+ Add photos"}
        </span>
        <input type="file" accept="image/*" multiple onChange={(e) => handlePhotos(Array.from(e.target.files))} className="hidden" />
      </label>
    </div>
  )
}

function VideoSessionEditor({ session, onChange, onRemove, password }) {
  const [uploading, setUploading] = useState(false)

  const handleClips = async (files) => {
    setUploading(true)
    try {
      const uploaded = []
      for (const file of files) {
        let duration
        try {
          duration = await getVideoDuration(file)
        } catch {
          alert(`Could not read "${file.name}" - skipped.`)
          continue
        }
        if (duration > MAX_CLIP_SECONDS) {
          alert(`"${file.name}" is ${duration.toFixed(1)}s long - clips must be ${MAX_CLIP_SECONDS}s or shorter. Skipped.`)
          continue
        }
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: JSON.stringify({ password }),
        })
        uploaded.push(blob.url)
      }
      onChange({ ...session, clips: [...session.clips, ...uploaded] })
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeClip = (idx) => {
    onChange({ ...session, clips: session.clips.filter((_, i) => i !== idx) })
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
        <input placeholder="Session title (e.g. Freshers Night)" value={session.title} onChange={(e) => onChange({ ...session, title: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        <input placeholder="Date (e.g. Sep 20)" value={session.date} onChange={(e) => onChange({ ...session, date: e.target.value })} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        <button onClick={onRemove} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove Session</button>
      </div>

      <div className="flex flex-wrap gap-3">
        {session.clips.map((url, i) => (
          <div key={i} className="relative">
            <video src={url} className="w-28 h-20 object-cover rounded-sm border border-zinc-700" muted />
            <button onClick={() => removeClip(i)} className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs leading-none">&times;</button>
          </div>
        ))}
      </div>

      <label className="text-sm text-zinc-400 self-start">
        <span className="inline-block bg-zinc-800 border border-zinc-700 hover:border-blue-500 text-white px-4 py-2 rounded-sm cursor-pointer transition-colors">
          {uploading ? "Checking & uploading..." : "+ Add clips (max 30s each)"}
        </span>
        <input type="file" accept="video/*" multiple onChange={(e) => handleClips(Array.from(e.target.files))} className="hidden" />
      </label>
    </div>
  )
}

function GalleryManager({ password }) {
  const [photoSessions, setPhotoSessions] = useState([])
  const [videoSessions, setVideoSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        setPhotoSessions(data.photoSessions || [])
        setVideoSessions(data.videoSessions || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addPhotoSession = () => setPhotoSessions((prev) => [...prev, { title: "", date: "", photos: [] }])
  const addVideoSession = () => setVideoSessions((prev) => [...prev, { title: "", date: "", clips: [] }])

  const save = async () => {
    setSaveState("saving")
    setErrorMsg("")
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, photoSessions, videoSessions }),
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

  if (loading) return <p className="text-zinc-400">Loading...</p>

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-white text-lg font-bold uppercase mb-4">Photo Sessions</h2>
        <div className="flex flex-col gap-4">
          {photoSessions.map((session, i) => (
            <PhotoSessionEditor
              key={i}
              session={session}
              password={password}
              onChange={(updated) => setPhotoSessions((prev) => prev.map((s, idx) => (idx === i ? updated : s)))}
              onRemove={() => setPhotoSessions((prev) => prev.filter((_, idx) => idx !== i))}
            />
          ))}
          <button onClick={addPhotoSession} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">+ Add Photo Session</button>
        </div>
      </div>

      <div>
        <h2 className="text-white text-lg font-bold uppercase mb-4">Video Sessions</h2>
        <div className="flex flex-col gap-4">
          {videoSessions.map((session, i) => (
            <VideoSessionEditor
              key={i}
              session={session}
              password={password}
              onChange={(updated) => setVideoSessions((prev) => prev.map((s, idx) => (idx === i ? updated : s)))}
              onRemove={() => setVideoSessions((prev) => prev.filter((_, idx) => idx !== i))}
            />
          ))}
          <button onClick={addVideoSession} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">+ Add Video Session</button>
        </div>
      </div>

      <button onClick={save} disabled={saveState === "saving"} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50">
        {saveState === "saving" ? "Saving..." : "Save Changes"}
      </button>
      {saveState === "success" && <p className="text-blue-400 text-sm text-center">Saved - the live site is updated.</p>}
      {saveState === "error" && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
    </div>
  )
}

export default function Admin() {
  const [password, setPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [tab, setTab] = useState("events")

  if (!unlocked) {
    return <Login password={password} setPassword={setPassword} onSubmit={() => password && setUnlocked(true)} />
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-2xl font-bold uppercase mb-6">Admin</h1>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab("events")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "events" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Events</button>
          <button onClick={() => setTab("gallery")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "gallery" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Gallery</button>
        </div>

        {tab === "events" ? <EventsManager password={password} /> : <GalleryManager password={password} />}
      </div>
    </div>
  )
}
'@ | Set-Content -Path ".\src\pages\Admin.jsx" -Encoding UTF8

Write-Host "Created api/gallery.js and rebuilt Admin.jsx with Events/Gallery tabs." -ForegroundColor Green
Write-Host "Next: run the second script (public display) before building." -ForegroundColor Cyan
