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
      <div className="relative max-w-4xl mx-auto">
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
          <div className="border-t border-zinc-800">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-[64px_110px_1fr_auto_auto] gap-3 md:gap-6 items-center py-6 border-b border-zinc-800"
              >
                {ev.image ? (
                  <button
                    onClick={() => setLightboxImage(ev.image)}
                    className="w-16 h-16 rounded-sm border border-zinc-700 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Enlarge photo"
                  >
                    <img src={ev.image} alt={ev.venue} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                  </button>
                ) : (
                  <div className="w-16 h-16 hidden md:block" />
                )}
                <span className="text-white font-bold text-lg uppercase">{ev.date}</span>
                <span>
                  <span className="text-white font-semibold">{ev.venue}</span>
                  {ev.city && <span className="text-zinc-400 text-sm block md:inline md:ml-2">{ev.city}</span>}
                </span>
                {ev.status && (
                  <span className="text-blue-400 text-sm font-semibold uppercase tracking-wide">{ev.status}</span>
                )}
                {ev.link && (
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="justify-self-start md:justify-self-end px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-sm transition-colors whitespace-nowrap"
                  >
                    Book / Tickets
                  </a>
                )}
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
