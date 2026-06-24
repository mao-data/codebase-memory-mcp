'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function Navbar() {
  const { lang, toggle, t } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? 'bg-warm-bg/90 backdrop-blur-md border-b border-warm-border shadow-sm'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span
          className={`font-serif text-xl font-semibold tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-warm-text' : 'text-white'
          }`}
        >
          Journi
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className={`text-sm font-sans transition-colors duration-300 ${
              scrolled
                ? 'text-warm-muted hover:text-warm-text'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {lang === 'en' ? '中文' : 'EN'}
          </button>
          <a
            href="#final-cta"
            className="
              bg-warm-tan hover:bg-warm-tan-dark
              text-white text-sm font-sans font-medium
              px-4 py-2 rounded-full
              transition-all duration-200
              hover:shadow-md hover:-translate-y-px
            "
          >
            {t('Join Waitlist', '加入候補')}
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
