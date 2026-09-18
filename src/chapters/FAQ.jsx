import { useState } from "react"
import { motion } from "framer-motion"

const FAQS = [
  {
    q: "What kind of music does DJ TIMKEY play?",
    a: "Open format - Afrobeats, Amapiano, Gengetone, Afro House, Hip-Hop, Dancehall and more. He reads the room and blends genres live rather than sticking to one lane.",
  },
  {
    q: "How do I book him for my event?",
    a: "Use the booking form below, or reach out directly via WhatsApp or email with your date, venue, and event type. He'll get back to you to confirm details.",
  },
  {
    q: "How far in advance should I book?",
    a: "As early as possible - popular dates, especially weekends and wedding season, fill up fast. A few weeks' notice is ideal, but reach out even for last-minute events.",
  },
  {
    q: "What types of events does he play?",
    a: "Clubs, weddings, corporate functions, campus events, brand activations, private parties - pretty much anything that needs the right music at the right moment.",
  },
  {
    q: "Can I request specific songs?",
    a: "Yes - send your requests ahead of time or on the night, and he'll work them naturally into the set.",
  },
  {
    q: "Does he travel outside his home city?",
    a: "Yes, he's open to travel for the right event - just mention your location when you reach out so travel details can be worked out.",
  },
  {
    q: "What's the payment process?",
    a: "Details are shared once you reach out with your event info - typically a deposit secures the date, with the balance due closer to the event.",
  },
]

function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left gap-4"
      >
        <span className="text-white font-semibold text-base md:text-lg">{q}</span>
        <span className={`text-blue-400 text-2xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-zinc-400 text-sm md:text-base pb-6 pr-8 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="relative bg-black py-24 md:py-36 px-8 md:px-16">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Frequently Asked
        </motion.h2>

        <div className="border-t border-zinc-800">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
