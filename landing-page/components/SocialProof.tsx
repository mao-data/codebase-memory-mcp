'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const stats = [
  { en: '128 people on the waitlist', zh: '128 位旅人已加入候補' },
  { en: 'Launching soon', zh: '即將推出' },
  { en: 'Free early access', zh: '早鳥免費體驗' },
]

export default function SocialProof() {
  const { t } = useLang()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-warm-cream border-y border-warm-border py-4 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-2">
          {stats.map((s, i) => (
            <span key={i} className="flex items-center gap-2 text-warm-muted text-sm font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-tan flex-shrink-0" />
              {t(s.en, s.zh)}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
