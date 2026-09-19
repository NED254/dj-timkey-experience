import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Moments', href: '#moments' },
  { label: 'Sound', href: '#sound' },
  { label: 'Gallery', href: '#gallery' },
]

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastY.current && currentY > 120) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className="fixed top-9 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
        <a href="#" className="text-white font-bold uppercase tracking-wide text-sm">
          DJ <span className="text-blue-500">Timkey</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-zinc-300 text-sm hover:text-white transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>

      <a
        href="#booking"
        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors"
      >
        Book Timkey
      </a>
    </motion.nav>
  )
}
