import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const BIO_LINES = [
  "Timkey reads a room and keeps it moving. That's the reputation behind the Mr. Beatnician tag.",
  "He works comfortably across genres rather than sticking to one lane: Afrobeats, Amapiano, Gengetone, Afro House, Hip-Hop, Dancehall.",
  "His sets have taken him from club nights and corporate functions to university stages, including a headline set at freshers' night.",
  "Media appearances include Citizen TV's 10 Over 10 and Hot96 guest mixes.",
]

const lineVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function MeetTheBeatnician() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '200px 0px' })
  const isVisible = useInView(sectionRef, { margin: '200px 0px' })
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isVisible) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [isVisible])

  return (
    <section id="about" ref={sectionRef} className="relative bg-black py-24 md:py-36 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/timkey-portrait.jpg"
        onError={(e) => console.error('Video failed to load:', e)}
        className="absolute inset-0 w-full h-full object-cover z-0"
        ref={videoRef}
        src={isInView ? '/videos/beatnician-bg.mp4' : undefined}
      />

      <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/60" />

      <div className="relative z-10 max-w-6xl mr-auto ml-0 lg:ml-8 grid md:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full" />

          <div className="relative">
            <img
              src="/images/timkey-portrait.jpg"
              alt="Portrait of DJ Timkey"
              className="w-full aspect-[4/5] object-cover rounded-sm shadow-2xl shadow-black/60"
            />
            <div className="absolute -inset-px border border-blue-500/40 rounded-sm pointer-events-none" />
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
          </div>
        </motion.div>

        <div>
          <motion.h2
            className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Meet The <span className="text-blue-500">Beatnician</span>
          </motion.h2>

          <div className="space-y-5 max-w-xl">
            {BIO_LINES.map((line, i) => (
              <motion.p
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={lineVariants}
                className="text-zinc-100 text-base md:text-lg leading-relaxed drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]"
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="mt-12 max-w-md border-l-2 border-blue-500 pl-6 py-4 bg-zinc-900/80 backdrop-blur-md shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-white text-lg md:text-xl italic leading-snug">
              "Every crowd deserves a moment they'll never forget."
            </p>
            <span className="block mt-3 text-zinc-500 text-sm uppercase tracking-widest">
              DJ Timkey
            </span>
          </motion.div>

          <motion.div
            className="mt-10 grid grid-cols-3 gap-6 max-w-md"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div>
              <p className="text-white text-2xl md:text-3xl font-bold">600+</p>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">Events Played</p>
            </div>
            <div>
              <p className="text-white text-2xl md:text-3xl font-bold">8+</p>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">Genres Mastered</p>
            </div>
            <div>
              <p className="text-white text-2xl md:text-3xl font-bold">5+</p>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mt-1">Years Active</p>
            </div>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <a
              href="#booking"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-sm transition-colors"
            >
              Book Timkey
            </a>
            <a
              href="#sound"
              className="px-8 py-4 border border-zinc-400 text-white font-semibold rounded-sm backdrop-blur-sm bg-black/20 hover:border-blue-500/50 transition-colors"
            >
              Hear The Sound
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
