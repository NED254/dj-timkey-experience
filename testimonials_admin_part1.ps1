# Run from inside dj-timkey-experience\

# ---------- api/testimonials.js ----------
@'
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const testimonials = (await kv.get("testimonials")) || [];
    return res.status(200).json({ testimonials });
  }

  if (req.method === "POST") {
    const { password, testimonials } = req.body || {};

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!Array.isArray(testimonials)) {
      return res.status(400).json({ error: "testimonials must be an array" });
    }

    await kv.set("testimonials", testimonials);
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
'@ | Set-Content -Path ".\api\testimonials.js" -Encoding UTF8

# ---------- src/chapters/Testimonials.jsx: now reads from the API instead of a hardcoded array ----------
@'
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function TestimonialCard({ quote, name, role, index }) {
  return (
    <motion.div
      className="bg-zinc-900/60 border border-zinc-800 rounded-sm p-8 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <span className="text-blue-500 text-4xl leading-none mb-4">&ldquo;</span>
      <p className="text-zinc-200 text-base md:text-lg leading-relaxed flex-1">{quote}</p>
      <div className="mt-6 pt-4 border-t border-zinc-800">
        <p className="text-white font-semibold text-sm">{name}</p>
        {role && <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{role}</p>}
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && testimonials.length === 0) return null

  return (
    <section id="testimonials" className="relative bg-black py-24 md:py-36 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          What People Say
        </motion.h2>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
'@ | Set-Content -Path ".\src\chapters\Testimonials.jsx" -Encoding UTF8

Write-Host "Created api/testimonials.js; Testimonials.jsx now reads from it (empty until you add some in admin)." -ForegroundColor Green
Write-Host "Next: run part 2 (Admin tab + re-adding it to App.jsx)" -ForegroundColor Cyan
