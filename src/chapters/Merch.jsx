import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function MerchCard({ name, price, image, link }) {
  const whatsappHref =
    "https://wa.me/254790817087?text=" +
    encodeURIComponent(`Hi Timkey, I'd like to order the ${name}${price ? ` (KES ${price})` : ""}.`)

  return (
    <motion.div
      className="group relative bg-zinc-900/60 border border-zinc-800 rounded-sm overflow-hidden hover:border-blue-500/50 transition-colors"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative aspect-square bg-black">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-sm uppercase tracking-widest">
            No Image
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-white font-bold text-lg">{name}</p>
        {price && <p className="text-blue-400 font-semibold mt-1">KES {price}</p>}

        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-sm transition-colors"
          >
            Order via WhatsApp
          </a>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2.5 border border-zinc-700 hover:border-blue-500 text-white text-sm font-semibold rounded-sm transition-colors"
            >
              Buy Online
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Merch() {
  const [merch, setMerch] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/merch")
      .then((r) => r.json())
      .then((data) => setMerch(data.merch || []))
      .catch(() => setMerch([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && merch.length === 0) return null

  return (
    <section id="merch" className="relative bg-black py-24 md:py-36 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Merch
        </motion.h2>
        <motion.p
          className="text-zinc-400 text-lg max-w-xl mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Official DJ Timkey merch, made for the people who actually show up to the sets.
        </motion.p>

        {loading ? (
          <p className="text-zinc-400">Loading merch...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {merch.map((item, i) => (
              <MerchCard key={i} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
