import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa'

const PHOTOS = [
  { src: '/images/timkey-hero.jpg', caption: 'Live on stage', span: 'row-span-2' },
  { src: '/images/timkey-portrait.jpg', caption: 'Mr. Beatnician', span: '' },
  { src: '/images/timkey-club.jpg', caption: 'On the decks', span: '' },
  { src: '/images/timkey-martos-lounge.jpg', caption: "DJ Timkey @ Marto's Lounge", span: 'row-span-2' },
  { src: '/images/gallery-1.jpg', caption: '', span: '' },
  { src: '/images/gallery-2.jpg', caption: '', span: '' },
  { src: '/images/gallery-3.jpg', caption: '', span: '' },
  { src: '/images/gallery-4.jpg', caption: '', span: '' },
  { src: '/images/gallery-5.jpg', caption: '', span: '' },
  { src: '/images/gallery-6.jpg', caption: '', span: '' },
  { src: '/images/gallery-7.jpg', caption: '', span: '' },
  { src: '/images/gallery-8.jpg', caption: '', span: '' },
  { src: '/images/gallery-9.jpg', caption: '', span: '' },
  { src: '/images/gallery-10.jpg', caption: '', span: '' },
  { src: '/images/gallery-11.jpg', caption: '', span: '' },
  { src: '/images/gallery-12.jpg', caption: '', span: '' },
  { src: '/images/gallery-13.jpg', caption: '', span: '' },
]

// To add a new shoot: paste the new object below with its date (YYYY-MM-DD).
// The list automatically sorts newest-first and badges the latest one.
const FEATURED_GALLERIES = [
  {
    title: 'Live at Java',
    credit: 'Mastervisuals2.0',
    date: '2026-09-11',
    cover: 'https://images.pixieset.com/906862221/026554e4039b680b1a4e3a75cb99d6b8-cover.jpg',
    href: 'https://mastervisuals20.pixieset.com/timkeyjava',
  },
  {
    title: 'Every set tells a story',
    credit: 'MASTERVISUALSKE',
    date: '2026-09-04',
    cover: 'https://images.pixieset.com/586800221/40a3214a43e67deaea312eb649864404-cover.jpg',
    href: 'https://mastervisualske12.pixieset.com/deejaytimkey',
  },
].sort((a, b) => new Date(b.date) - new Date(a.date))

const SOCIALS = [
  { label: 'Instagram', handle: '@dj_timkey', href: 'https://www.instagram.com/dj_timkey', Icon: FaInstagram },
  { label: 'TikTok', handle: '@djtimkey', href: 'https://www.tiktok.com/@djtimkey', Icon: FaTiktok },
  { label: 'Facebook', handle: 'Deejey Timkey', href: 'https://www.facebook.com/DeejeyTimkey', Icon: FaFacebook },
]

function GalleryTile({ src, caption, span, onOpen }) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-sm cursor-pointer ${span}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      onClick={onOpen}
    >
      <img
        src={src}
        alt={caption || 'DJ Timkey'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-white text-sm font-semibold uppercase tracking-wide">{caption}</p>
        </div>
      )}
      <div className="absolute inset-0 border border-transparent group-hover:border-blue-500/50 transition-colors duration-500 pointer-events-none" />
    </motion.div>
  )
}

function FeaturedGalleryCard({ title, credit, cover, href, isLatest }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-sm"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={cover}
          alt={`${title} - photo gallery by ${credit}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        {isLatest && (
          <span className="absolute top-4 right-4 flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Latest Shoot
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="text-blue-400 text-xs uppercase tracking-[0.3em]">
          Full Photo Gallery
        </span>
        <h3 className="text-white font-bold uppercase text-xl md:text-2xl leading-tight mt-2">
          {title}
        </h3>
        <p className="text-zinc-400 text-sm mt-1">Shot by {credit}</p>
        <span className="inline-flex items-center gap-2 mt-4 text-white text-sm font-semibold uppercase tracking-wide border-b border-blue-500 pb-1 group-hover:text-blue-400 group-hover:border-blue-400 transition-colors">
          View the full gallery
        </span>
      </div>
    </motion.a>
  )
}

function Lightbox({ photo, onClose, onPrev, onNext }) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-sm flex items-center justify-center px-6 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl leading-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>

          <button
            className="absolute left-4 md:left-8 text-white/60 hover:text-white text-4xl leading-none px-2"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Previous"
          >
            &#8249;
          </button>

          <motion.img
            key={photo.src}
            src={photo.src}
            alt={photo.caption || 'DJ Timkey'}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-sm shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 md:right-8 text-white/60 hover:text-white text-4xl leading-none px-2"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next"
          >
            &#8250;
          </button>

          {photo.caption && (
            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-300 text-sm uppercase tracking-widest">
              {photo.caption}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SessionPhotoLightbox({ session, index, onClose, onPrev, onNext }) {
  if (!session) return null
  const url = session.photos[index]
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[95] bg-black/95 backdrop-blur-sm flex items-center justify-center px-6 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl leading-none" onClick={onClose} aria-label="Close">&times;</button>
        {session.photos.length > 1 && (
          <button className="absolute left-4 md:left-8 text-white/60 hover:text-white text-4xl leading-none px-2" onClick={(e) => { e.stopPropagation(); onPrev() }} aria-label="Previous">&#8249;</button>
        )}
        <motion.img
          key={url}
          src={url}
          alt={session.title}
          className="max-h-[85vh] max-w-[85vw] object-contain rounded-sm shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        />
        {session.photos.length > 1 && (
          <button className="absolute right-4 md:right-8 text-white/60 hover:text-white text-4xl leading-none px-2" onClick={(e) => { e.stopPropagation(); onNext() }} aria-label="Next">&#8250;</button>
        )}
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-300 text-sm uppercase tracking-widest">
          {session.title} {session.date && `- ${session.date}`}
        </p>
      </motion.div>
    </AnimatePresence>
  )
}

function VideoLightbox({ url, title, onClose }) {
  if (!url) return null
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[95] bg-black/95 backdrop-blur-sm flex items-center justify-center px-6 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <button className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl leading-none" onClick={onClose} aria-label="Close">&times;</button>
        <motion.video
          key={url}
          src={url}
          controls
          autoPlay
          playsInline
          className="max-h-[85vh] max-w-[85vw] rounded-sm shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        />
        {title && (
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-300 text-sm uppercase tracking-widest">
            {title}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function LatestSessions() {
  const [photoSessions, setPhotoSessions] = useState([])
  const [videoSessions, setVideoSessions] = useState([])
  const [photoLightbox, setPhotoLightbox] = useState(null) // { session, index }
  const [videoLightbox, setVideoLightbox] = useState(null) // { url, title }

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        setPhotoSessions((data.photoSessions || []).filter((s) => s.photos && s.photos.length))
        setVideoSessions((data.videoSessions || []).filter((s) => s.clips && s.clips.length))
      })
      .catch(() => {})
  }, [])

  if (photoSessions.length === 0 && videoSessions.length === 0) return null

  return (
    <div className="mb-16">
      {photoSessions.length > 0 && (
        <div className="mb-14">
          <h3 className="text-white font-bold uppercase text-2xl mb-6">Latest Photo Sessions</h3>
          <div className="flex flex-col gap-8">
            {photoSessions.map((session, si) => (
              <div key={si}>
                <p className="text-zinc-400 text-sm uppercase tracking-wide mb-3">
                  {session.title} {session.date && `- ${session.date}`}
                </p>
                <div className="flex flex-wrap gap-3">
                  {session.photos.map((url, pi) => (
                    <button
                      key={pi}
                      onClick={() => setPhotoLightbox({ session, index: pi })}
                      className="w-28 h-28 rounded-sm overflow-hidden border border-zinc-800 hover:border-blue-500/50 transition-colors"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {videoSessions.length > 0 && (
        <div>
          <h3 className="text-white font-bold uppercase text-2xl mb-6">Latest Video Clips</h3>
          <div className="flex flex-col gap-8">
            {videoSessions.map((session, si) => (
              <div key={si}>
                <p className="text-zinc-400 text-sm uppercase tracking-wide mb-3">
                  {session.title} {session.date && `- ${session.date}`}
                </p>
                <div className="flex flex-wrap gap-3">
                  {session.clips.map((url, ci) => (
                    <button
                      key={ci}
                      onClick={() => setVideoLightbox({ url, title: session.title })}
                      className="relative w-28 h-20 rounded-sm overflow-hidden border border-zinc-800 hover:border-blue-500/50 transition-colors"
                    >
                      <video src={url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="w-8 h-8 rounded-full bg-blue-600/90 flex items-center justify-center text-white text-sm">&#9654;</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SessionPhotoLightbox
        session={photoLightbox?.session}
        index={photoLightbox?.index || 0}
        onClose={() => setPhotoLightbox(null)}
        onPrev={() => setPhotoLightbox((s) => ({ ...s, index: (s.index - 1 + s.session.photos.length) % s.session.photos.length }))}
        onNext={() => setPhotoLightbox((s) => ({ ...s, index: (s.index + 1) % s.session.photos.length }))}
      />
      <VideoLightbox url={videoLightbox?.url} title={videoLightbox?.title} onClose={() => setVideoLightbox(null)} />
    </div>
  )
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)

  const openAt = (i) => setActiveIndex(i)
  const close = () => setActiveIndex(null)
  const prev = () => setActiveIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)
  const next = () => setActiveIndex((i) => (i + 1) % PHOTOS.length)

  return (
    <section id="gallery" className="relative bg-black py-24 md:py-36 px-8 md:px-16">
      <div className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5] pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-white font-bold uppercase text-4xl md:text-6xl leading-[0.95] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Gallery
        </motion.h2>
        <motion.p
          className="text-zinc-400 text-lg max-w-xl mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Some shots from clubs, campuses, and brand events he's played.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px] mb-14">
          {PHOTOS.map((photo, i) => (
            <GalleryTile key={photo.src} {...photo} onOpen={() => openAt(i)} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {FEATURED_GALLERIES.map((gallery, i) => (
            <FeaturedGalleryCard key={gallery.href} {...gallery} isLatest={i === 0} />
          ))}
        </div>

        <LatestSessions />

        <motion.div
          className="flex flex-wrap items-center justify-between gap-6 border-t border-zinc-800 pt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-zinc-400 text-base max-w-sm">
            This is just a glimpse - follow along for the full story, or bring Timkey to your next event.
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map(({ label, handle, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 border border-zinc-700 text-white rounded-sm hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
              >
                <Icon className="text-lg" />
                <span className="font-semibold text-sm">{handle}</span>
              </a>
            ))}
            <a
              href="#booking"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-sm transition-colors"
            >
              Book Timkey
            </a>
          </div>
        </motion.div>
      </div>

      <Lightbox
        photo={activeIndex !== null ? PHOTOS[activeIndex] : null}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}
