import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const GENRES = ['Afrobeats', 'Amapiano', 'Gengetone', 'Afro House', 'Hip-Hop', 'Dancehall']

const MIXES = [
  {
    title: 'Tirries Tuesday - Old Skool Edition',
    subtitle: 'Live at Java Blue Lounge, ft. MC Pin',
    src: '/videos/mix-1-tirries-tuesday.mp4',
    poster: '/images/mix-1-tirries-tuesday-poster.jpg',
    youtube: 'https://youtu.be/ZrTikLIp330',
  },
  {
    title: 'Soniq EP 5',
    subtitle: 'Studio mix',
    src: '/videos/mix-2-soniq-ep5.mp4',
    poster: '/images/mix-2-soniq-ep5-poster.jpg',
    youtube: 'https://youtu.be/8bvNFhjdlX8',
  },
  {
    title: 'Soniq at Java B',
    subtitle: 'Live at Java Blue Lounge',
    src: '/videos/mix-3-soniq-java-b.mp4',
    poster: '/images/mix-3-soniq-java-b-poster.jpg',
    youtube: 'https://youtu.be/0A4f-Q4EFDs',
  },
]

const CONSTELLATION = [
  { x: 32, y: 22 },
  { x: 50, y: 22 },
  { x: 68, y: 22 },
  { x: 50, y: 38 },
  { x: 50, y: 54 },
  { x: 50, y: 70 },
]
const LINES = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [4, 5],
]
const SETTLE_DURATION = 5
const STEPS = 6

function buildSpiral(target, seed) {
  const xs = []
  const ys = []
  for (let s = 0; s < STEPS; s++) {
    const t = s / (STEPS - 1)
    if (s === STEPS - 1) {
      xs.push(target.x)
      ys.push(target.y)
      continue
    }
    const angle = (1 - t) * Math.PI * 4 + seed * 6.283
    const radius = (1 - t) * 34
    xs.push(target.x + Math.cos(angle) * radius)
    ys.push(target.y + Math.sin(angle) * radius * 0.55)
  }
  return { xs, ys }
}

const AMBIENT_STARS = Array.from({ length: 50 }, (_, i) => {
  const seed = i * 91.7
  return {
    left: seed % 100,
    top: (seed * 2.3) % 100,
    size: 1 + ((i * 11) % 2),
    delay: (i % 8) * 0.4,
    duration: 2.5 + (i % 3),
  }
})

function SoundBackground({ isInView }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/sound-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        src={isInView ? "/videos/sound-bg.mp4" : undefined}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#030308]/60 via-zinc-950/50 to-zinc-950/90" />

      {AMBIENT_STARS.map((star, i) => (
        <motion.span
          key={`ambient-${i}`}
          className="absolute rounded-full bg-white/70"
          style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

            {CONSTELLATION.map((point, i) => {
        const { xs, ys } = buildSpiral(point, i * 0.37)
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
            style={{ marginLeft: '-3px', marginTop: '-3px' }}
            animate={{
              left: xs.map((v) => `${v}%`),
              top: ys.map((v) => `${v}%`),
              boxShadow: [
                '0 0 0px rgba(59,130,246,0)',
                '0 0 0px rgba(59,130,246,0)',
                '0 0 12px rgba(59,130,246,0.9)',
              ],
            }}
            transition={{ duration: SETTLE_DURATION, ease: 'easeInOut', delay: i * 0.15 }}
          />
        )
      })}


        <div className="absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  )
}

function Vinyl() {
  return (
    <motion.div
      className="relative w-40 h-40 md:w-52 md:h-52 rounded-full flex-shrink-0"
      style={{
        background: 'repeating-radial-gradient(circle, #18181b 0px, #18181b 2px, #09090b 3px, #09090b 6px)',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    >
      <div className="absolute inset-0 rounded-full border border-zinc-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600 flex items-center justify-center">
        <motion.span
          className="text-white text-[9px] md:text-xs font-bold uppercase tracking-wide"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          Timkey
        </motion.span>
      </div>
    </motion.div>
  )
}

function Waveform() {
  const bars = Array.from({ length: 28 }, (_, i) => 1 + ((i * 13) % 5))
  return (
    <div className="flex items-center gap-[3px] h-8">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] bg-blue-500 rounded-full"
          animate={{ height: [`${h * 4}px`, `${h * 8}px`, `${h * 4}px`] }}
          transition={{ duration: 1 + (i % 3) * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
        />
      ))}
    </div>
  )
}

function MixCard({ title, subtitle, src, poster, youtube, isFocused }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isFocused) {
      v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [isFocused])

  const handleEnter = () => {
    const v = videoRef.current
    if (v) v.play().catch(() => {})
  }
  const handleLeave = () => {
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
  }

  return (
    <a
      href={youtube}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full h-full bg-black rounded-[1.75rem] overflow-hidden border-[3px] border-zinc-800 hover:border-blue-500/50 transition-colors shadow-2xl shadow-black/60"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      draggable={false}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-blue-600/90 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/50">
          <span className="text-white ml-0.5 text-base">&#9654;</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-bold text-sm leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {title}
        </p>
        <p className="text-zinc-300 text-xs mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          {subtitle}
        </p>
        <span className="inline-block mt-2 text-blue-400 text-[10px] uppercase tracking-widest group-hover:text-blue-300 transition-colors">
          Watch on YouTube &rarr;
        </span>
      </div>
    </a>
  )
}

const WHEEL_STEP = 20
const WHEEL_RADIUS = 900

function MixWheel({ mixes }) {
  const [focused, setFocused] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFocused((f) => (f + 1) % mixes.length)
    }, 4000)
    return () => clearInterval(id)
  }, [mixes.length])

  return (
    <div className="relative">
      <div className="relative h-[400px] md:h-[460px] overflow-hidden flex justify-center">
        {mixes.map((mix, i) => {
          const angle = (i - focused) * WHEEL_STEP
          const isFocused = i === focused
          return (
            <div
              key={mix.title}
              className="absolute left-1/2 top-0 w-[150px] md:w-[190px] aspect-[9/17] transition-transform duration-700 cursor-pointer"
              style={{
                transform: `translateX(-50%) rotate(${angle}deg)`,
                transformOrigin: `50% ${WHEEL_RADIUS}px`,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                zIndex: isFocused ? 20 : 10 - Math.abs(i - focused),
              }}
              onClick={() => setFocused(i)}
            >
              <div
                className="w-full h-full transition-all duration-700"
                style={{
                  opacity: isFocused ? 1 : 0.5,
                  filter: isFocused ? 'none' : 'brightness(0.55) blur(0.5px)',
                  transform: `scale(${isFocused ? 1 : 0.82})`,
                }}
              >
                <MixCard {...mix} isFocused={isFocused} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        {mixes.map((mix, i) => (
          <button
            key={mix.title}
            onClick={() => setFocused(i)}
            aria-label={`Show ${mix.title}`}
            className={`h-2 rounded-full transition-all ${
              i === focused ? 'w-6 bg-blue-500' : 'w-2 bg-zinc-700 hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Sound() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '200px 0px' })

  return (
    <section ref={sectionRef} id="sound" className="relative bg-black py-24 md:py-36 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
      <SoundBackground isInView={isInView} />

      <div className="relative max-w-6xl mx-auto">
                <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Sound
        </motion.h2>

        <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-center mb-16">
          <Vinyl />
          <div>
            <p className="text-zinc-300 text-lg max-w-xl mb-6">
              No single genre defines a night - Timkey moves through all of these live, reading the
              crowd and blending as he goes.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {GENRES.map((genre) => (
                <span
                  key={genre}
                  className="px-4 py-2 border border-zinc-700 rounded-full text-zinc-300 text-sm uppercase tracking-wide"
                >
                  {genre}
                </span>
              ))}
            </div>
            <Waveform />
          </div>
        </div>

        <MixWheel mixes={MIXES} />
      </div>
    </section>
  )
}
