# Run from inside dj-timkey-experience\

@'
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && events.length === 0) return null

  return (
    <section id="events" className="relative bg-black py-24 md:py-36 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Catch Timkey Live
        </motion.h2>

        {loading ? (
          <p className="text-zinc-400">Loading events...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-blue-500/40 rounded-lg overflow-hidden transition-colors"
              >
                <div className="flex flex-col md:flex-row items-stretch">
                  {ev.image ? (
                    <button
                      onClick={() => setLightboxImage(ev.image)}
                      className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 overflow-hidden group focus:outline-none"
                      aria-label="Enlarge photo"
                    >
                      <img
                        src={ev.image}
                        alt={ev.venue}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                  ) : (
                    <div className="hidden md:block w-4 flex-shrink-0" />
                  )}

                  <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="md:w-32 flex-shrink-0">
                      <span className="text-blue-400 font-bold text-3xl md:text-4xl uppercase leading-none">{ev.date}</span>
                    </div>

                    <div className="flex-1">
                      <p className="text-white font-bold text-xl md:text-2xl leading-tight">{ev.venue}</p>
                      {ev.city && <p className="text-zinc-400 text-base mt-1">{ev.city}</p>}
                      {ev.status && (
                        <span className="inline-block mt-3 text-blue-400 text-xs font-semibold uppercase tracking-widest border border-blue-500/40 rounded-full px-3 py-1">
                          {ev.status}
                        </span>
                      )}
                    </div>

                    {ev.link && (
                      <a
                        href={ev.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base font-bold uppercase tracking-wide rounded-sm transition-colors whitespace-nowrap"
                      >
                        Book / Tickets
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImage}
              alt=""
              className="max-w-full max-h-full object-contain rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white text-3xl leading-none hover:text-blue-400 transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
'@ | Set-Content -Path ".\src\chapters\Events.jsx" -Encoding UTF8

Write-Host "Events.jsx redesigned: larger card layout, bigger photo, bigger date/venue text, bigger CTA button." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
