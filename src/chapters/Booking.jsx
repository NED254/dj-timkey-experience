import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaWhatsapp, FaEnvelope, FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa'

const CONTACT_LINKS = [
  { label: 'WhatsApp / Call', value: '+254 790 817087', href: 'https://wa.me/254790817087', Icon: FaWhatsapp },
  { label: 'Email', value: 'deejaytimkey@gmail.com', href: 'mailto:deejaytimkey@gmail.com', Icon: FaEnvelope },
  { label: 'Instagram', value: '@dj_timkey', href: 'https://www.instagram.com/dj_timkey', Icon: FaInstagram },
  { label: 'TikTok', value: '@djtimkey', href: 'https://www.tiktok.com/@djtimkey', Icon: FaTiktok },
  { label: 'Facebook', value: 'Deejey Timkey', href: 'https://www.facebook.com/DeejeyTimkey', Icon: FaFacebook },
]

function DepthCounter() {
  const [depth, setDepth] = useState(187)

  useEffect(() => {
    const id = setInterval(() => {
      setDepth((d) => (d > 260 ? 187 : d + 1))
    }, 220)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute top-6 right-6 md:top-10 md:right-12 text-right font-mono">
      <p className="text-cyan-300/50 text-[10px] uppercase tracking-[0.3em] mb-1">Depth</p>
      <p className="text-cyan-200/80 text-2xl md:text-3xl tabular-nums drop-shadow-[0_0_12px_rgba(94,234,212,0.5)]">
        {depth}m
      </p>
    </div>
  )
}

function StatusPill() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/40 bg-blue-500/10 mb-8"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.span
        className="w-2 h-2 rounded-full bg-blue-400"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-blue-400 text-xs uppercase tracking-widest font-semibold">
        Now Booking Events 2026
      </span>
    </motion.div>
  )
}

export default function Booking() {
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
  const [status, setStatus] = useState('idle')
  const whatsappHref = 'https://wa.me/254790817087?text=' + encodeURIComponent("Hi Timkey, I'd like to book you for an event.")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.target
    const formData = new FormData(form)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={sectionRef} id="booking" className="relative bg-black py-24 md:py-36 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/booking-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            ref={videoRef}
            src={isInView ? "/videos/booking-bg.mp4" : undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#041220]/70 via-[#00060d]/55 to-black/85" />

          <div
            className="absolute -top-1/4 left-[15%] w-[200px] h-[160%] opacity-[0.06] bg-gradient-to-b from-cyan-300 via-cyan-500/40 to-transparent"
            style={{ transform: 'rotate(8deg)' }}
          />
          <div
            className="absolute -top-1/4 left-[55%] w-[140px] h-[160%] opacity-[0.05] bg-gradient-to-b from-cyan-200 via-cyan-500/30 to-transparent"
            style={{ transform: 'rotate(-6deg)' }}
          />

          {Array.from({ length: 45 }, (_, i) => {
            const seed = i * 53.7
            const size = 1 + (i % 3)
            const hue = i % 4 === 0 ? 'bg-cyan-300' : i % 3 === 0 ? 'bg-teal-300' : 'bg-blue-300'
            return (
              <motion.span
                key={i}
                className={`absolute rounded-full ${hue}`}
                style={{
                  left: `${seed % 100}%`,
                  top: `${(seed * 1.9) % 100}%`,
                  width: size,
                  height: size,
                  boxShadow: `0 0 ${size * 4}px ${size}px rgba(94, 234, 212, 0.5)`,
                }}
                animate={{
                  y: [0, -120, 0],
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: 12 + (i % 8),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (i % 10) * 1.1,
                }}
              />
            )
          })}

          <motion.div
            className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full bg-cyan-200"
            style={{ boxShadow: '0 0 30px 10px rgba(103, 232, 249, 0.4)' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[60%] right-[25%] w-2.5 h-2.5 rounded-full bg-teal-200"
            style={{ boxShadow: '0 0 34px 12px rgba(94, 234, 212, 0.4)' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
          <motion.div
            className="absolute bottom-[15%] left-[45%] w-1.5 h-1.5 rounded-full bg-blue-200"
            style={{ boxShadow: '0 0 26px 8px rgba(147, 197, 253, 0.4)' }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

      <div className="relative max-w-6xl mx-auto">
                <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Book Timkey
        </motion.h2>

        <StatusPill />

        <p className="text-zinc-300 text-lg max-w-xl mb-14">
          Clubs, corporate functions, campus events, brand activations - reach out directly and
          Timkey will get back to you.
        </p>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <motion.div
            className="bg-black/60 border border-zinc-800 rounded-sm p-8 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input type="hidden" name="access_key" value="43231be2-0ff5-4774-9d80-e0766b0d6b71" />
              <input type="hidden" name="subject" value="New booking request - DJ Timkey site" />

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-zinc-400 text-sm">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-zinc-400 text-sm">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="event_type" className="text-zinc-400 text-sm">Event type</label>
                <select
                  id="event_type"
                  name="event_type"
                  className="bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option>Club / Nightlife</option>
                  <option>Corporate Event</option>
                  <option>Wedding</option>
                  <option>Campus / Student Event</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-zinc-400 text-sm">Details</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-sm transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send Booking Request'}
              </motion.button>

              {status === 'success' && (
                <p className="text-blue-400 text-sm text-center">
                  Message sent - Timkey will get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">
                  Something went wrong. Try WhatsApp or email instead.
                </p>
              )}
            
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-600 text-xs uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 border border-blue-500/50 hover:bg-blue-500/10 text-blue-400 font-semibold py-4 rounded-sm transition-colors"
            >
              Book via WhatsApp
            </motion.a>

            </form>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center bg-black/60 border border-zinc-800 backdrop-blur-sm rounded-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-5 border-t border-zinc-800 last:border-b hover:pl-2 transition-all"
              >
                <span className="flex items-center gap-2 text-zinc-300 text-sm uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"><link.Icon className="text-base text-blue-400" /> {link.label}</span>
                <span className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                  {link.value}
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}


