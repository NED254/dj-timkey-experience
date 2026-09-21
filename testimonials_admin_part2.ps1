# Run from inside dj-timkey-experience\
# Targeted patch to Admin.jsx (adds a 6th tab) and App.jsx (re-adds Testimonials to the page).

$adminPath = ".\src\pages\Admin.jsx"
$adminContent = Get-Content -Raw $adminPath

$anchor = "export default function Admin() {"
$managerCode = @'
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
'@

if ($adminContent -notmatch [regex]::Escape($anchor)) {
    Write-Host "Could not find 'export default function Admin()' anchor - stopping without changes." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($anchor, $managerCode)

$oldTabs = '<button onClick={() => setTab("ads")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "ads" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Ads</button>
        </div>'
$newTabs = '<button onClick={() => setTab("ads")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "ads" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Ads</button>
          <button onClick={() => setTab("testimonials")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "testimonials" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Testimonials</button>
        </div>'

if ($adminContent -notmatch [regex]::Escape($oldTabs)) {
    Write-Host "Could not find the tab bar block - stopping without changes." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($oldTabs, $newTabs)

$oldRender = '{tab === "ads" && <AdsManager password={password} />}
      </div>'
$newRender = '{tab === "ads" && <AdsManager password={password} />}
        {tab === "testimonials" && <TestimonialsManager password={password} />}
      </div>'

if ($adminContent -notmatch [regex]::Escape($oldRender)) {
    Write-Host "Could not find the render-switch block - stopping without changes." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($oldRender, $newRender)

[System.IO.File]::WriteAllText((Resolve-Path $adminPath), $adminContent, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Admin.jsx patched with Testimonials tab." -ForegroundColor Green

# ---------- App.jsx: re-add Testimonials (was temporarily removed) ----------
$appPath = ".\src\App.jsx"
$appContent = Get-Content -Raw $appPath

$oldImport = "import Merch from './chapters/Merch'"
$newImport = "import Merch from './chapters/Merch'
import Testimonials from './chapters/Testimonials'"

$oldJsx = "<ChapterErrorBoundary><Merch /></ChapterErrorBoundary>"
$newJsx = "<ChapterErrorBoundary><Merch /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Testimonials /></ChapterErrorBoundary>"

if ($appContent -match [regex]::Escape("Testimonials from './chapters/Testimonials'")) {
    Write-Host "Testimonials already wired into App.jsx - skipping that part." -ForegroundColor Yellow
} elseif ($appContent -notmatch [regex]::Escape($oldImport)) {
    Write-Host "Could not find Merch import in App.jsx - stopping without changes to App.jsx." -ForegroundColor Red
} elseif ($appContent -notmatch [regex]::Escape($oldJsx)) {
    Write-Host "Could not find Merch JSX line in App.jsx - stopping without changes to App.jsx." -ForegroundColor Red
} else {
    $appContent = $appContent.Replace($oldImport, $newImport)
    $appContent = $appContent.Replace($oldJsx, $newJsx)
    [System.IO.File]::WriteAllText((Resolve-Path $appPath), $appContent, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "App.jsx updated: Testimonials back on the page, right after Merch." -ForegroundColor Green
}

Write-Host "Next: npm run build" -ForegroundColor Cyan
