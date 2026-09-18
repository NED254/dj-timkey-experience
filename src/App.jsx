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
import FAQ from './chapters/FAQ'
import Booking from './chapters/Booking'
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
      <ChapterErrorBoundary><FAQ /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Booking /></ChapterErrorBoundary>
      <FloatingWhatsApp />
    </div>
  )
}

export default App
