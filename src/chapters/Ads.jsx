import { useEffect, useState } from "react"

export default function Ads() {
  const [ads, setAds] = useState([])

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then((data) => setAds(data.ads || []))
      .catch(() => setAds([]))
  }, [])

  if (ads.length === 0) return null

  const items = [...ads, ...ads]
  const duration = Math.max(5, ads.length * 2)

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-10 bg-black/80 backdrop-blur-md overflow-hidden flex items-center border-b border-cyan-400/40"
      style={{
        boxShadow: "0 0 12px rgba(34, 211, 238, 0.35), 0 1px 0 rgba(34, 211, 238, 0.6)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
      }}
    >
      <style>{`
        @keyframes ads-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex items-center gap-12 whitespace-nowrap will-change-transform pl-12"
        style={{ animation: `ads-ticker-scroll ${duration}s linear infinite` }}
      >
        {items.map((ad, i) => (
          <a
            key={i}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-2 text-zinc-300 hover:text-cyan-300 text-xs uppercase tracking-widest transition-colors"
          >
            <span className="text-cyan-500/70">&#9670;</span>
            {ad.image && (
              <img src={ad.image} alt="" className="w-5 h-5 object-cover rounded-sm border border-cyan-400/30" />
            )}
            {ad.title && <span>{ad.title}</span>}
          </a>
        ))}
      </div>
    </div>
  )
}
