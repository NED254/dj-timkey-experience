import { useEffect, useState } from "react"
import { upload } from "@vercel/blob/client"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"

const BLANK_EVENT = { date: "", venue: "", city: "", status: "", image: "", link: "" }
const MAX_CLIP_SECONDS = 30
const MAX_IMAGE_DIMENSION = 1920
const IMAGE_QUALITY = 0.85

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

let ffmpegInstance = null
async function getFFmpeg(onLog) {
  if (ffmpegInstance) return ffmpegInstance
  const ffmpeg = new FFmpeg()
  if (onLog) ffmpeg.on("log", ({ message }) => onLog(message))
  const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd"
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  })
  ffmpegInstance = ffmpeg
  return ffmpeg
}

async function trimVideo(file, seconds, onStatus) {
  onStatus("Loading trimmer...")
  const ffmpeg = await getFFmpeg()
  const ext = (file.name.match(/\.[^.]+$/) || [".mp4"])[0]
  const inputName = "input" + ext
  const outputName = "output.mp4"
  onStatus("Trimming...")
  await ffmpeg.writeFile(inputName, await fetchFile(file))
  await ffmpeg.exec(["-i", inputName, "-t", String(seconds), "-c", "copy", outputName])
  const data = await ffmpeg.readFile(outputName)
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)
  return new File([data.buffer], file.name.replace(/\.[^.]+$/, "") + "-trimmed.mp4", { type: "video/mp4" })
}

function resizeImage(file, maxDimension = MAX_IMAGE_DIMENSION, quality = IMAGE_QUALITY) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width <= maxDimension && height <= maxDimension) {
        resolve(file)
        return
      }
      const scale = maxDimension / Math.max(width, height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }))
        },
        "image/jpeg",
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }
    img.src = url
  })
}

async function uploadImage(file, password, onProgress) {
  const resized = await resizeImage(file)
  return upload(resized.name, resized, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ password }),
    onUploadProgress: (p) => onProgress(Math.round(p.percentage)),
  })
}

async function uploadVideo(file, password, onProgress) {
  return upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ password }),
    onUploadProgress: (p) => onProgress(Math.round(p.percentage)),
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
  const [progress, setProgress] = useState(0)

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
    setProgress(0)
    try {
      const blob = await uploadImage(file, password, setProgress)
      updateEvent(i, "image", blob.url)
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploadingIndex(null)
      setProgress(0)
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
                {uploadingIndex === i ? `Uploading... ${progress}%` : ev.image ? "Replace poster/photo" : "Add poster/photo"}
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
  const [progress, setProgress] = useState(0)
  const [fileCount, setFileCount] = useState({ current: 0, total: 0 })

  const handlePhotos = async (files) => {
    setUploading(true)
    setFileCount({ current: 0, total: files.length })
    try {
      const uploaded = []
      for (let idx = 0; idx < files.length; idx++) {
        setFileCount({ current: idx + 1, total: files.length })
        setProgress(0)
        const blob = await uploadImage(files[idx], password, setProgress)
        uploaded.push(blob.url)
      }
      onChange({ ...session, photos: [...session.photos, ...uploaded] })
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploading(false)
      setProgress(0)
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
          {uploading ? `Uploading ${fileCount.current}/${fileCount.total}... ${progress}%` : "+ Add photos"}
        </span>
        <input type="file" accept="image/*" multiple onChange={(e) => handlePhotos(Array.from(e.target.files))} className="hidden" />
      </label>
    </div>
  )
}

function VideoSessionEditor({ session, onChange, onRemove, password }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileCount, setFileCount] = useState({ current: 0, total: 0 })
  const [statusText, setStatusText] = useState("")

  const handleClips = async (files) => {
    setUploading(true)
    setFileCount({ current: 0, total: files.length })
    try {
      const uploaded = []
      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx]
        setFileCount({ current: idx + 1, total: files.length })
        setProgress(0)
        let clipFile = file
        let duration
        try {
          duration = await getVideoDuration(file)
        } catch {
          alert(`Could not read "${file.name}" - skipped.`)
          continue
        }
        if (duration > MAX_CLIP_SECONDS) {
          try {
            clipFile = await trimVideo(file, MAX_CLIP_SECONDS, setStatusText)
          } catch (err) {
            alert(`Could not auto-trim "${file.name}" - skipped. (${err.message})`)
            setStatusText("")
            continue
          }
          setStatusText("")
        }
        const blob = await uploadVideo(clipFile, password, setProgress)
        uploaded.push(blob.url)
      }
      onChange({ ...session, clips: [...session.clips, ...uploaded] })
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploading(false)
      setProgress(0)
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
          {uploading ? (statusText || `Uploading ${fileCount.current}/${fileCount.total}... ${progress}%`) : "+ Add clips (any length - over 30s auto-trims)"}
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

function DownloadsManager({ password }) {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetch("/api/downloads")
      .then((r) => r.json())
      .then((data) => setDownloads(data.downloads || []))
      .catch(() => setDownloads([]))
      .finally(() => setLoading(false))
  }, [])

  const update = (i, field, value) => {
    setDownloads((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: value } : d)))
  }

  const add = () => setDownloads((prev) => [...prev, { title: "", link: "" }])
  const remove = (i) => setDownloads((prev) => prev.filter((_, idx) => idx !== i))

  const save = async () => {
    setSaveState("saving")
    setErrorMsg("")
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, downloads }),
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
      <p className="text-zinc-400 text-sm">
        Paste a link to wherever the mix is already hosted (Google Drive, Dropbox, etc. - make sure sharing is set to "anyone with the link").
      </p>
      {downloads.map((d, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-center">
          <input placeholder="Mix title" value={d.title} onChange={(e) => update(i, "title", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          <input placeholder="Download link (https://...)" value={d.link} onChange={(e) => update(i, "link", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove</button>
        </div>
      ))}
      <button onClick={add} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">+ Add Download Link</button>
      <button onClick={save} disabled={saveState === "saving"} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50">
        {saveState === "saving" ? "Saving..." : "Save Changes"}
      </button>
      {saveState === "success" && <p className="text-blue-400 text-sm text-center">Saved - the live site is updated.</p>}
      {saveState === "error" && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
    </div>
  )
}

function MerchManager({ password }) {
  const [merch, setMerch] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetch("/api/merch")
      .then((r) => r.json())
      .then((data) => setMerch(data.merch || []))
      .catch(() => setMerch([]))
      .finally(() => setLoading(false))
  }, [])

  const update = (i, field, value) => {
    setMerch((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)))
  }

  const add = () => setMerch((prev) => [...prev, { name: "", price: "", image: "", link: "" }])
  const remove = (i) => setMerch((prev) => prev.filter((_, idx) => idx !== i))

  const handleFileChange = async (i, file) => {
    if (!file) return
    setUploadingIndex(i)
    setProgress(0)
    try {
      const blob = await uploadImage(file, password, setProgress)
      update(i, "image", blob.url)
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploadingIndex(null)
      setProgress(0)
    }
  }

  const save = async () => {
    setSaveState("saving")
    setErrorMsg("")
    try {
      const res = await fetch("/api/merch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, merch }),
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
      {merch.map((m, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
            <input placeholder="Item name (e.g. DJ TIMKEY Tee)" value={m.name} onChange={(e) => update(i, "name", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input placeholder="Price in KES, numbers only (e.g. 1500)" value={m.price} onChange={(e) => update(i, "price", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove</button>
          </div>
          <input placeholder="Optional secondary buy link (store page, etc.)" value={m.link} onChange={(e) => update(i, "link", e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          <div className="flex items-center gap-4">
            {m.image && <img src={m.image} alt="" className="w-16 h-16 object-cover rounded-sm border border-zinc-700" />}
            <label className="text-sm text-zinc-400">
              <span className="inline-block bg-zinc-800 border border-zinc-700 hover:border-blue-500 text-white px-4 py-2 rounded-sm cursor-pointer transition-colors">
                {uploadingIndex === i ? `Uploading... ${progress}%` : m.image ? "Replace photo" : "Add photo"}
              </span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(i, e.target.files[0])} className="hidden" />
            </label>
          </div>
        </div>
      ))}

      <button onClick={add} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">+ Add Merch Item</button>
      <button onClick={save} disabled={saveState === "saving"} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50">
        {saveState === "saving" ? "Saving..." : "Save Changes"}
      </button>
      {saveState === "success" && <p className="text-blue-400 text-sm text-center">Saved - the live site is updated.</p>}
      {saveState === "error" && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
    </div>
  )
}

function AdsManager({ password }) {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then((data) => setAds(data.ads || []))
      .catch(() => setAds([]))
      .finally(() => setLoading(false))
  }, [])

  const update = (i, field, value) => {
    setAds((prev) => prev.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)))
  }

  const add = () => setAds((prev) => [...prev, { title: "", image: "", link: "" }])
  const remove = (i) => setAds((prev) => prev.filter((_, idx) => idx !== i))

  const handleFileChange = async (i, file) => {
    if (!file) return
    setUploadingIndex(i)
    setProgress(0)
    try {
      const blob = await uploadImage(file, password, setProgress)
      update(i, "image", blob.url)
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setUploadingIndex(null)
      setProgress(0)
    }
  }

  const save = async () => {
    setSaveState("saving")
    setErrorMsg("")
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ads }),
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
      <p className="text-zinc-400 text-sm">
        Ads for other products/brands. Each shows as a small banner near the bottom of the site, linking wherever you point it.
      </p>
      {ads.map((ad, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-center">
            <input placeholder="Label (optional)" value={ad.title} onChange={(e) => update(i, "title", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input placeholder="Link the ad should open (https://...)" value={ad.link} onChange={(e) => update(i, "link", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove</button>
          </div>
          <div className="flex items-center gap-4">
            {ad.image && <img src={ad.image} alt="" className="w-24 h-16 object-cover rounded-sm border border-zinc-700" />}
            <label className="text-sm text-zinc-400">
              <span className="inline-block bg-zinc-800 border border-zinc-700 hover:border-blue-500 text-white px-4 py-2 rounded-sm cursor-pointer transition-colors">
                {uploadingIndex === i ? `Uploading... ${progress}%` : ad.image ? "Replace banner image" : "Add banner image"}
              </span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(i, e.target.files[0])} className="hidden" />
            </label>
          </div>
        </div>
      ))}
      <button onClick={add} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">+ Add Ad</button>
      <button onClick={save} disabled={saveState === "saving"} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50">
        {saveState === "saving" ? "Saving..." : "Save Changes"}
      </button>
      {saveState === "success" && <p className="text-blue-400 text-sm text-center">Saved - the live site is updated.</p>}
      {saveState === "error" && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}
    </div>
  )
}

function TestimonialsManager({ password }) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false))
  }, [])

  const update = (i, field, value) => {
    setTestimonials((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))
  }

  const add = () => setTestimonials((prev) => [...prev, { quote: "", name: "", role: "" }])
  const remove = (i) => setTestimonials((prev) => prev.filter((_, idx) => idx !== i))

  const save = async () => {
    setSaveState("saving")
    setErrorMsg("")
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, testimonials }),
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
      {testimonials.map((t, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3">
          <textarea
            placeholder="The quote itself"
            value={t.quote}
            onChange={(e) => update(i, "quote", e.target.value)}
            rows="3"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
            <input placeholder="Name" value={t.name} onChange={(e) => update(i, "name", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <input placeholder="Role / event (optional)" value={t.role} onChange={(e) => update(i, "role", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove</button>
          </div>
        </div>
      ))}
      <button onClick={add} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">+ Add Testimonial</button>
      <button onClick={save} disabled={saveState === "saving"} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50">
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

        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => setTab("events")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "events" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Events</button>
          <button onClick={() => setTab("gallery")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "gallery" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Gallery</button>
          <button onClick={() => setTab("downloads")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "downloads" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Downloads</button>
          <button onClick={() => setTab("merch")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "merch" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Merch</button>
          <button onClick={() => setTab("ads")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "ads" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Ads</button>
          <button onClick={() => setTab("testimonials")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "testimonials" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Testimonials</button>
        </div>

        {tab === "events" && <EventsManager password={password} />}
        {tab === "gallery" && <GalleryManager password={password} />}
        {tab === "downloads" && <DownloadsManager password={password} />}
        {tab === "merch" && <MerchManager password={password} />}
        {tab === "ads" && <AdsManager password={password} />}
        {tab === "testimonials" && <TestimonialsManager password={password} />}
      </div>
    </div>
  )
}
