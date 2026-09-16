import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import ChapterErrorBoundary from './components/ChapterErrorBoundary'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Arrival from './chapters/Arrival'
import MeetTheBeatnician from './chapters/MeetTheBeatnician'
import Moments from './chapters/Moments'
import Sound from './chapters/Sound'
import Gallery from './chapters/Gallery'
import Booking from './chapters/Booking'

function App() {
  return (
    <div className="bg-black text-white">
      <LoadingScreen />
      <Navbar />
      <ChapterErrorBoundary><Arrival /></ChapterErrorBoundary>
      <ChapterErrorBoundary><MeetTheBeatnician /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Moments /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Sound /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Gallery /></ChapterErrorBoundary>
      <ChapterErrorBoundary><Booking /></ChapterErrorBoundary>
      <FloatingWhatsApp />
    </div>
  )
}

export default App
