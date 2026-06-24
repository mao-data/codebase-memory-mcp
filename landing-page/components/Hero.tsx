'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import WaitlistForm from './WaitlistForm'

const titleLines = {
  en: ['Plan Together.', 'Cherish Every Moment.'],
  zh: ['一起規劃，', '珍藏每個當下。'],
}

export default function Hero() {
  const { lang, t } = useLang()
  const lines = titleLines[lang]

  return (
    <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80"
          alt="Beautiful Bali travel destination"
          fill
          className="object-cover hero-bg"
          priority
          unoptimized
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/65" />
        <div className="absolute inset-0 bg-warm-deep/15" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto w-full">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-sans text-white/60 text-xs tracking-[0.25em] uppercase mb-5"
        >
          Journi
        </motion.p>

        {/* Main headline */}
        <div className="mb-5">
          {lines.map((line, i) => (
            <motion.h1
              key={`${lang}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] text-white font-medium leading-tight block"
            >
              {line}
            </motion.h1>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: 'easeOut' }}
          className="font-sans text-white/75 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
        >
          {t(
            'AI-powered travel planning built for sharing — organize trips, collaborate with friends, and share every adventure beautifully.',
            'AI 生成行程，與旅伴協作編輯，輕鬆分享每段旅程。'
          )}
        </motion.p>

        {/* Waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: 'easeOut' }}
        >
          <WaitlistForm variant="hero" />
          <p className="text-white/40 text-xs font-sans mt-3">
            {t('No credit card required · Free to join', '無需信用卡 · 免費加入')}
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
