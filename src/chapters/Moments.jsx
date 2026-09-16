import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const MOMENTS = [
  { label: 'Freshers Night', src: '/videos/freshers-night.mp4', poster: '/images/freshers-night-poster.jpg' },
  { label: 'Weekend Club Tour', src: '/videos/weekend-club-tour.mp4', poster: '/images/weekend-club-tour-poster.jpg' },
  { label: 'University Festival', src: '/videos/university-festival.mp4', poster: '/images/university-festival-poster.jpg' },
  { label: 'Citizen TV - 10 Over 10', src: '/videos/citizen-tv.mp4', poster: '/images/citizen-tv-poster.jpg' },
]

const STARS = Array.from({ length: 70 }, (_, i) => {
  const seed = i * 137.5
  return {
    left: (seed % 100),
    top: ((seed * 3.7) % 100),
    size: 1 + ((i * 17) % 3),
    delay: (i % 10) * 0.3,
    duration: 2 + (i % 4),
  }
})

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#05030f] via-black to-black" />
      <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[120px]" />
      {STARS.map((star, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function PhoneCard({ label, src, poster, offset, onEnded }) {
  const isCenter = offset === 0
  const videoRef = useRef(null)

  const rotateY = offset * -20
  const translateX = offset * 240
  const translateZ = isCenter ? 80 : -120
  const scale = isCenter ? 1.15 : 0.95
  const opacity = Math.abs(offset) > 2 ? 0 : isCenter ? 1 : 0.65

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isCenter) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isCenter])

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{ transformStyle: 'preserve-3d' }}
      animate={{
        x: translateX - 155,
        y: '-50%',
        z: translateZ,
        rotateY,
        scale,
        opacity,
      }}
      transition={{ type: 'spring', stiffness: 130, damping: 18 }}
    >
      {isCenter && (
        <motion.div
          className="absolute -inset-8 rounded-[3rem] bg-blue-500/25 blur-2xl"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className={`relative w-[310px] h-[550px] rounded-[2.25rem] border-4 ${
          isCenter ? 'border-blue-500/70' : 'border-zinc-600/60'
        } bg-zinc-900 shadow-2xl overflow-hidden`}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-10" />
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          poster={poster}
          preload="auto"
          onEnded={isCenter ? onEnded : undefined}
          className="w-full h-full object-cover"
        />
        {isCenter && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5">
            <p className="text-white text-base font-semibold uppercase tracking-wide">{label}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Moments() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % MOMENTS.length)
  }
  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + MOMENTS.length) % MOMENTS.length)
  }

  return (
    <section id="moments" className="relative bg-black py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
      <StarField />

      <div className="relative px-8 md:px-16 max-w-6xl mx-auto mb-16">
                <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Moments
        </motion.h2>
      </div>

      <motion.div
        className="relative h-[650px] w-full cursor-grab active:cursor-grabbing"
        style={{ perspective: '1600px' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.x < -80 || info.velocity.x < -400) {
            goNext()
          } else if (info.offset.x > 80 || info.velocity.x > 400) {
            goPrev()
          }
        }}
      >
        {MOMENTS.map((moment, i) => (
          <PhoneCard
            key={moment.label}
            label={moment.label}
            src={moment.src}
            poster={moment.poster}
            offset={i - activeIndex}
          />
        ))}
      </motion.div>

      <div className="relative flex justify-center gap-2 mt-10">
        {MOMENTS.map((moment, i) => (
          <button
            key={moment.label}
            onClick={() => setActiveIndex(i)}
            aria-label={`Show ${moment.label}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-8 bg-blue-500' : 'w-1.5 bg-zinc-700'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
