import { useState } from "react"
import { motion } from "framer-motion"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus("error")
        setErrorMsg(data.error || "Something went wrong")
        return
      }
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
      setErrorMsg("Network error")
    }
  }

  return (
    <section className="relative bg-black py-20 px-8 md:px-16 border-t border-zinc-900">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-white font-bold uppercase text-2xl md:text-3xl mb-3">Stay in the loop</h3>
        <p className="text-zinc-400 text-sm md:text-base mb-6">
          Get notified about new mixes and upcoming shows. No spam, just the essentials.
        </p>

        {status === "success" ? (
          <p className="text-blue-400 font-semibold">You're on the list. Thanks for subscribing.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-sm transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === "sending" ? "Joining..." : "Notify Me"}
            </button>
          </form>
        )}
        {status === "error" && <p className="text-red-400 text-sm mt-3">{errorMsg}</p>}
      </motion.div>
    </section>
  )
}
