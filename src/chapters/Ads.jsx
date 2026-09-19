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

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-zinc-950 border-b border-zinc-800 overflow-hidden flex items-center">
      <style>{`
        @keyframes ads-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex items-center gap-10 whitespace-nowrap will-change-transform"
        style={{ animation: "ads-ticker-scroll 28s linear infinite" }}
      >
        {items.map((ad, i) => (
          <a
            key={i}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs uppercase tracking-wide transition-colors"
          >
            <span className="text-zinc-600">Sponsored</span>
            {ad.image && (
              <img src={ad.image} alt="" className="w-5 h-5 object-cover rounded-sm" />
            )}
            {ad.title && <span>{ad.title}</span>}
          </a>
        ))}
      </div>
    </div>
  )
}
