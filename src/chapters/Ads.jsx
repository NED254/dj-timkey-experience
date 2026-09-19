import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Ads() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then((data) => setAds(data.ads || []))
      .catch(() => setAds([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && ads.length === 0) return null

  return (
    <section id="ads" className="relative bg-black py-16 px-8 md:px-16 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <p className="text-zinc-600 text-xs uppercase tracking-[0.3em] mb-6 text-center">Sponsored</p>
        <div className="flex flex-wrap justify-center gap-4">
          {ads.map((ad, i) => (
            <motion.a
              key={i}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group block w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.7rem)] rounded-sm overflow-hidden border border-zinc-800 hover:border-blue-500/40 transition-colors"
            >
              {ad.image && (
                <img
                  src={ad.image}
                  alt={ad.title || "Advertisement"}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              {ad.title && (
                <p className="text-zinc-400 text-sm text-center py-2 group-hover:text-white transition-colors">
                  {ad.title}
                </p>
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
