import { motion } from 'framer-motion'

const BIO_LINES = [
  "Timkey reads a room and keeps it moving - that's the reputation behind the Mr. Beatnician tag.",
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
  return (
    <section id="about" className="relative bg-zinc-950 py-24 md:py-36 px-8 md:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[0.85fr_1.15fr] gap-16 items-start">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/images/timkey-portrait.jpg"
            alt="Portrait of DJ Timkey"
            className="w-full aspect-[4/5] object-cover rounded-sm"
          />
          <div className="absolute -inset-px border border-blue-500/20 rounded-sm pointer-events-none" />
        </motion.div>

        <div className="relative rounded-sm overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          >
            <source src="/videos/beatnician-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/60" />

          <div className="relative p-6 md:p-10">
            <motion.span
              className="block text-blue-500 text-sm uppercase tracking-[0.3em] mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Chapter 02
            </motion.span>

            <motion.h2
              className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-10"
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
                  className="text-zinc-300 text-base md:text-lg leading-relaxed"
              >
                {line}
              </motion.p>
              ))}
            </div>

            <motion.div
              className="mt-12 max-w-md border-l-2 border-blue-500 pl-6 py-2 bg-zinc-900/60 backdrop-blur-sm"
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
          </div>
        </div>
      </div>
    </section>
  )
}
