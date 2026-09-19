# Run from inside dj-timkey-experience\
# This is a TARGETED patch to Admin.jsx (preserves the blob fix and video auto-trim
# work already in the file) plus a full rewrite of App.jsx (unchanged since Merch).

$adminPath = ".\src\pages\Admin.jsx"
$adminContent = Get-Content -Raw $adminPath

# 1. Insert AdsManager function right before "export default function Admin()"
$anchor = "export default function Admin() {"
$adsManagerCode = @'
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

export default function Admin() {
'@

if ($adminContent -notmatch [regex]::Escape($anchor)) {
    Write-Host "Could not find 'export default function Admin()' anchor - stopping without changes." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($anchor, $adsManagerCode)

# 2. Add the Ads tab button (after the Merch button)
$oldTabs = '<button onClick={() => setTab("merch")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "merch" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Merch</button>
        </div>'
$newTabs = '<button onClick={() => setTab("merch")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "merch" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Merch</button>
          <button onClick={() => setTab("ads")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "ads" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Ads</button>
        </div>'

if ($adminContent -notmatch [regex]::Escape($oldTabs)) {
    Write-Host "Could not find the tab bar block - stopping without changes." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($oldTabs, $newTabs)

# 3. Add the Ads render line (after the Merch render line)
$oldRender = '{tab === "merch" && <MerchManager password={password} />}
      </div>'
$newRender = '{tab === "merch" && <MerchManager password={password} />}
        {tab === "ads" && <AdsManager password={password} />}
      </div>'

if ($adminContent -notmatch [regex]::Escape($oldRender)) {
    Write-Host "Could not find the render-switch block - stopping without changes." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($oldRender, $newRender)

[System.IO.File]::WriteAllText((Resolve-Path $adminPath), $adminContent, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Admin.jsx patched with Ads tab (blob fix and video auto-trim preserved)." -ForegroundColor Green

# ---------- src/App.jsx (unchanged since Merch was added, safe to rewrite fully) ----------
@'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import ChapterErrorBoundary from './components/ChapterErrorBoundary'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Arrival from './chapters/Arrival'
import MeetTheBeatnician from './chapters/MeetTheBeatnician'
import Moments from './chapters/Moments'
import Sound from './chapters/Sound'
import Events from './chapters/Events'
import Gallery from './chapters/Gallery'
import Merch from './chapters/Merch'
import Booking from './chapters/Booking'
import FAQ from './chapters/FAQ'
import Ads from './chapters/Ads'
import Admin from './pages/Admin'

function App() {
  if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
    return <Admin />
  }

  return (
    <div className="bg-black text-white">
      <LoadingScreen />
      <Navbar />
      <ChapterErrorBoundary><Arrival /></ChapterErrorBoundary>
      <ChapterErrorBoundary><MeetTheBeatnician /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Moments /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Sound /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Events /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Gallery /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Merch /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Booking /></ChapterErrorBoundary>
      <ChapterErrorBoundary><FAQ /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Ads /></ChapterErrorBoundary>
      <FloatingWhatsApp />
      <footer className="bg-black border-t border-zinc-800 py-8 px-8 md:px-16 text-center">
        <p className="text-zinc-500 text-sm">&copy; 2026 DJ Timkey. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
'@ | Set-Content -Path ".\src\App.jsx" -Encoding UTF8

Write-Host "App.jsx updated: Ads chapter wired in (after FAQ, before footer)." -ForegroundColor Green
Write-Host "Next: run add_ads_part1.ps1 if you haven't already (creates api/ads.js and Ads.jsx), then npm run build" -ForegroundColor Cyan
