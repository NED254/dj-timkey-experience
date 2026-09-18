# Run from inside dj-timkey-experience\

# ---------- api/merch.js ----------
@'
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const merch = (await kv.get("merch")) || [];
    return res.status(200).json({ merch });
  }

  if (req.method === "POST") {
    const { password, merch } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(merch)) {
      return res.status(400).json({ error: "merch must be an array" });
    }

    await kv.set("merch", merch);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
'@ | Set-Content -Path ".\api\merch.js" -Encoding UTF8

# ---------- src/chapters/Merch.jsx ----------
@'
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Merch() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/merch")
      .then((r) => r.json())
      .then((data) => setItems(data.merch || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && items.length === 0) return null

  return (
    <section id="merch" className="relative bg-black py-24 md:py-36 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Merch
        </motion.h2>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden hover:border-blue-500/40 transition-colors"
              >
                {item.image && (
                  <div className="aspect-square overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-white font-bold text-lg">{item.name}</p>
                  {item.price && <p className="text-blue-400 font-semibold text-base mt-1">{item.price}</p>}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 w-full text-center px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold uppercase tracking-wide rounded-sm transition-colors"
                    >
                      Order
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
'@ | Set-Content -Path ".\src\chapters\Merch.jsx" -Encoding UTF8

Write-Host "Created api/merch.js and src/chapters/Merch.jsx" -ForegroundColor Green
Write-Host "Next: run part 2 (Admin Merch tab + App.jsx wiring)" -ForegroundColor Cyan
