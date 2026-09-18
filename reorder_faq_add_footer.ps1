# Run from inside dj-timkey-experience\

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
import Booking from './chapters/Booking'
import FAQ from './chapters/FAQ'
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
      <ChapterErrorBoundary><Booking /></ChapterErrorBoundary>
      <ChapterErrorBoundary><FAQ /></ChapterErrorBoundary>
      <FloatingWhatsApp />
      <footer className="bg-black border-t border-zinc-800 py-8 px-8 md:px-16 text-center">
        <p className="text-zinc-500 text-sm">&copy; 2026 DJ Timkey. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
'@ | Set-Content -Path ".\src\App.jsx" -Encoding UTF8

Write-Host "App.jsx updated: FAQ moved to last, copyright footer added." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
