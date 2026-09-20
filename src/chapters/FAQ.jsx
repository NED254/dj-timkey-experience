import { useState } from "react"
import { motion } from "framer-motion"

const FAQS = [
  {
    q: "What kind of music does DJ TIMKEY play?",
    a: "No fixed lane. Afrobeats, Amapiano, Gengetone, Afro House, Hip-Hop, Dancehall, he plays whatever the crowd is actually feeling that night, not a set list decided beforehand.",
  },
  {
    q: "How do I book him?",
    a: "Fill in the form below or just hit him up on WhatsApp with your date, venue and what kind of event it is. Fastest way to actually get a reply.",
  },
  {
    q: "How early should I lock in a date?",
    a: "The sooner the better, honestly. Weekends and December fill up quick. If it's short notice though, still ask. Sometimes it works out.",
  },
  {
    q: "What kind of events does he do?",
    a: "Clubs, weddings, corporate stuff, campus events, brand activations, private parties. If it needs a DJ who can read the room, that's the job.",
  },
  {
    q: "Can I request songs?",
    a: "Always. Send them before the event or just shout them out on the night. He'll find a way to fit them in.",
  },
  {
    q: "Does he travel for gigs outside Nairobi?",
    a: "Yes. Just mention where the event is when you reach out and travel gets sorted from there.",
  },
  {
    q: "How does payment work?",
    a: "Usually a deposit to hold the date, balance closer to the event. Exact details get worked out once you reach out with your event info.",
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
