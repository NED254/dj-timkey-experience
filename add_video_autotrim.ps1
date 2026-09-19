# Run from inside dj-timkey-experience\

npm install @ffmpeg/ffmpeg @ffmpeg/util

$path = ".\src\pages\Admin.jsx"
$content = Get-Content -Raw $path

# 1. Add ffmpeg import right after the existing @vercel/blob/client import
$oldImport = 'import { upload } from "@vercel/blob/client"'
$newImport = 'import { upload } from "@vercel/blob/client"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"'

if ($content -notmatch [regex]::Escape($oldImport)) {
    Write-Host "Could not find the import line - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($oldImport, $newImport)

# 2. Add ffmpeg loader + trimVideo helper right after getVideoDuration function
$oldMarker = 'function resizeImage(file, maxDimension = MAX_IMAGE_DIMENSION, quality = IMAGE_QUALITY) {'
$newHelpers = @'
let ffmpegInstance = null
async function getFFmpeg(onLog) {
  if (ffmpegInstance) return ffmpegInstance
  const ffmpeg = new FFmpeg()
  if (onLog) ffmpeg.on("log", ({ message }) => onLog(message))
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"
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
'@

if ($content -notmatch [regex]::Escape($oldMarker)) {
    Write-Host "Could not find resizeImage marker - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($oldMarker, $newHelpers)

# 3. Replace the VideoSessionEditor's reject-on-too-long logic with auto-trim
$oldReject = @'
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
        const blob = await uploadVideo(file, password, setProgress)
'@
$newTrim = @'
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
'@

if ($content -notmatch [regex]::Escape($oldReject)) {
    Write-Host "Could not find the reject-on-too-long block - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($oldReject, $newTrim)

# 4. Add statusText state to VideoSessionEditor and show it in the button label
$oldState = 'function VideoSessionEditor({ session, onChange, onRemove, password }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileCount, setFileCount] = useState({ current: 0, total: 0 })'
$newState = 'function VideoSessionEditor({ session, onChange, onRemove, password }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileCount, setFileCount] = useState({ current: 0, total: 0 })
  const [statusText, setStatusText] = useState("")'

if ($content -notmatch [regex]::Escape($oldState)) {
    Write-Host "Could not find VideoSessionEditor state block - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($oldState, $newState)

$oldLabel = '{uploading ? `Uploading ${fileCount.current}/${fileCount.total}... ${progress}%` : "+ Add clips (max 30s each)"}'
$newLabel = '{uploading ? (statusText || `Uploading ${fileCount.current}/${fileCount.total}... ${progress}%`) : "+ Add clips (any length - over 30s auto-trims)"}'

if ($content -notmatch [regex]::Escape($oldLabel)) {
    Write-Host "Could not find the video upload button label - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($oldLabel, $newLabel)

[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Admin.jsx updated: videos over 30s now auto-trim to the first 30s instead of being rejected." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
