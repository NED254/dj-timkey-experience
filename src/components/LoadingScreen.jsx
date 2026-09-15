import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setDone(true), 1100)
          return 100
        }
        return prev + Math.floor(Math.random() * 8) + 4
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  const displayProgress = Math.min(progress, 100)

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/intro-logo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex flex-col items-center">
            <motion.h1
              className="text-white font-bold uppercase text-3xl md:text-5xl tracking-widest mb-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              DJ <span className="text-blue-500">Timkey</span>
            </motion.h1>

            <div className="flex items-end gap-1 h-10 mb-8" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 bg-blue-500 rounded-full"
                  animate={{ height: ['10%', '100%', '10%'] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>

            <div className="w-48 h-px bg-zinc-700 relative overflow-hidden mb-3">
              <motion.div
                className="absolute inset-y-0 left-0 bg-blue-500"
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-zinc-300 text-xs uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {displayProgress}%
            </span>

            <AnimatePresence>
              {displayProgress >= 100 && (
                <motion.span
                  className="mt-6 text-blue-400 text-sm md:text-base uppercase tracking-[0.35em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
