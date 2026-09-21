import { motion } from "framer-motion"

// EDIT ME: replace each quote/name/role below with a real testimonial.
// Keep the same three fields per entry. Add or remove entries as needed.
const TESTIMONIALS = [
  {
    quote: "Replace this with a real quote from someone who has booked him.",
    name: "Name goes here",
    role: "Event or venue",
  },
  {
    quote: "Replace this with a real quote from someone who has booked him.",
    name: "Name goes here",
    role: "Event or venue",
  },
  {
    quote: "Replace this with a real quote from someone who has booked him.",
    name: "Name goes here",
    role: "Event or venue",
  },
]

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
        <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{role}</p>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} {...t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
