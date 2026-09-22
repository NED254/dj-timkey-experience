# Run from inside dj-timkey-experience\
# Wires Newsletter into App.jsx and adds a read-only Subscribers tab in admin.

# ---------- App.jsx: add Newsletter right after Booking, before FAQ ----------
$appPath = ".\src\App.jsx"
$appContent = Get-Content -Raw $appPath

$oldImport = "import FAQ from './chapters/FAQ'"
$newImport = "import Newsletter from './chapters/Newsletter'
import FAQ from './chapters/FAQ'"

$oldJsx = "<ChapterErrorBoundary><Booking /></ChapterErrorBoundary>
      <ChapterErrorBoundary><FAQ /></ChapterErrorBoundary>"
$newJsx = "<ChapterErrorBoundary><Booking /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Newsletter /></ChapterErrorBoundary>
      <ChapterErrorBoundary><FAQ /></ChapterErrorBoundary>"

if ($appContent -notmatch [regex]::Escape($oldImport)) {
    Write-Host "Could not find FAQ import in App.jsx - stopping without changes to App.jsx." -ForegroundColor Red
} elseif ($appContent -notmatch [regex]::Escape($oldJsx)) {
    Write-Host "Could not find Booking/FAQ JSX block in App.jsx - stopping without changes to App.jsx." -ForegroundColor Red
} else {
    $appContent = $appContent.Replace($oldImport, $newImport)
    $appContent = $appContent.Replace($oldJsx, $newJsx)
    [System.IO.File]::WriteAllText((Resolve-Path $appPath), $appContent, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "App.jsx updated: Newsletter signup added between Booking and FAQ." -ForegroundColor Green
}

# ---------- Admin.jsx: add a read-only Subscribers tab ----------
$adminPath = ".\src\pages\Admin.jsx"
$adminContent = Get-Content -Raw $adminPath

$anchor = "export default function Admin() {"
$managerCode = @'
function SubscribersManager({ password }) {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetch(`/api/subscribe?password=${encodeURIComponent(password)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error)
        } else {
          setSubscribers(data.subscribers || [])
        }
      })
      .catch(() => setErrorMsg("Network error"))
      .finally(() => setLoading(false))
  }, [password])

  const copyAll = () => {
    navigator.clipboard.writeText(subscribers.join(", "))
  }

  if (loading) return <p className="text-zinc-400">Loading...</p>
  if (errorMsg) return <p className="text-red-400 text-sm">{errorMsg}</p>

  return (
    <div className="flex flex-col gap-4">
      <p className="text-zinc-400 text-sm">{subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}</p>
      <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-5 flex flex-col gap-2 max-h-96 overflow-y-auto">
        {subscribers.length === 0 ? (
          <p className="text-zinc-500 text-sm">No subscribers yet.</p>
        ) : (
          subscribers.map((email, i) => (
            <p key={i} className="text-white text-sm">{email}</p>
          ))
        )}
      </div>
      {subscribers.length > 0 && (
        <button onClick={copyAll} className="border border-zinc-700 hover:border-blue-500 text-white rounded-sm py-3 transition-colors">
          Copy All Emails
        </button>
      )}
    </div>
  )
}

export default function Admin() {
'@

if ($adminContent -notmatch [regex]::Escape($anchor)) {
    Write-Host "Could not find 'export default function Admin()' anchor - stopping without changes to Admin.jsx." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($anchor, $managerCode)

$oldTabs = '<button onClick={() => setTab("testimonials")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "testimonials" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Testimonials</button>
        </div>'
$newTabs = '<button onClick={() => setTab("testimonials")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "testimonials" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Testimonials</button>
          <button onClick={() => setTab("subscribers")} className={`px-5 py-2 rounded-sm text-sm font-semibold uppercase transition-colors ${tab === "subscribers" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Subscribers</button>
        </div>'

if ($adminContent -notmatch [regex]::Escape($oldTabs)) {
    Write-Host "Could not find the tab bar block - stopping without changes to Admin.jsx." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($oldTabs, $newTabs)

$oldRender = '{tab === "testimonials" && <TestimonialsManager password={password} />}
      </div>'
$newRender = '{tab === "testimonials" && <TestimonialsManager password={password} />}
        {tab === "subscribers" && <SubscribersManager password={password} />}
      </div>'

if ($adminContent -notmatch [regex]::Escape($oldRender)) {
    Write-Host "Could not find the render-switch block - stopping without changes to Admin.jsx." -ForegroundColor Red
    exit
}
$adminContent = $adminContent.Replace($oldRender, $newRender)

[System.IO.File]::WriteAllText((Resolve-Path $adminPath), $adminContent, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Admin.jsx updated: Subscribers tab added (read-only list + copy all)." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
