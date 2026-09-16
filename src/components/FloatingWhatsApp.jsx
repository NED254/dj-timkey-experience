import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function FloatingWhatsApp() {
  const href =
    'https://wa.me/254790817087?text=' +
    encodeURIComponent("Hi Timkey, I'd like to book you for an event.")

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="hidden md:block mr-3 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-sm text-white text-sm font-semibold whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
        Chat on WhatsApp
      </span>

      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-2xl shadow-black/50">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
        <FaWhatsapp className="relative text-white text-3xl" />
      </span>
    </motion.a>
  )
}
