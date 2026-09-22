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
import Testimonials from './chapters/Testimonials'
import Booking from './chapters/Booking'
import Newsletter from './chapters/Newsletter'
import FAQ from './chapters/FAQ'
import Ads from './chapters/Ads'
import Admin from './pages/Admin'
import { Analytics } from '@vercel/analytics/react'

function App() {
  if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
    return <Admin />
  }

  return (
    <div className="bg-black text-white">
      <LoadingScreen />
      <Navbar />
      <Ads />
      <ChapterErrorBoundary><Arrival /></ChapterErrorBoundary>
      <ChapterErrorBoundary><MeetTheBeatnician /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Moments /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Sound /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Events /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Gallery /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Merch /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Testimonials /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Booking /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Newsletter /></ChapterErrorBoundary>
      <ChapterErrorBoundary><FAQ /></ChapterErrorBoundary>
      <FloatingWhatsApp />
      <Analytics />
      <footer className="bg-black border-t border-zinc-800 py-8 px-8 md:px-16 text-center">
        <p className="text-zinc-500 text-sm">&copy; 2026 DJ Timkey. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
