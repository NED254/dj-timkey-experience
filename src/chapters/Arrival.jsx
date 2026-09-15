import { motion } from 'framer-motion'

const NAME_PARTS = [
  { text: 'DJ', className: 'text-white' },
  { text: 'TIMKEY', className: 'text-blue-500' },
]

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Arrival() {
  let letterIndex = 0

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-end bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/images/arrival-poster.jpg"
        className="absolute inset-0 w-full h-full object-contain md:object-cover"
      >
        <source src="/videos/intro-logo.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />

      <div className="relative z-10 w-full px-8 pb-20 md:px-16 md:pb-28">
        <motion.div
          className="flex items-end gap-1 h-6 mb-6"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="w-1 bg-blue-500 animate-pulse"
              style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </motion.div>

        <h1 className="font-bold uppercase leading-[0.9] text-[14vw] md:text-[9vw] flex flex-wrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          {NAME_PARTS.map((part, partIdx) => (
            <span key={partIdx} className={`${part.className} flex mr-[0.25em]`}>
              {part.text.split('').map((char) => {
                const i = letterIndex++
                return (
                  <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                )
              })}
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-zinc-200 text-base md:text-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
        >
          Also known as <span className="text-white font-semibold">Mr. Beatnician</span> -
          hype master and open-format DJ based in Kenya. Afrobeats, Amapiano, Gengetone,
          Afro House, Hip-Hop, Dancehall - whatever the room needs.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7 }}
        >
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-sm"
          >
            Book Timkey
          </motion.a>
          <motion.a
            href="#moments"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 border border-zinc-400 text-white font-semibold rounded-sm backdrop-blur-sm bg-black/20"
          >
            Watch Highlights
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-300 text-xs uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span>Scroll to enter the experience</span>
        <span className="w-px h-8 bg-zinc-400 animate-bounce" />
      </motion.div>
    </section>
  )
}
