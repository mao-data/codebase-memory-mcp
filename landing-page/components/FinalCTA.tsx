'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import WaitlistForm from './WaitlistForm'

export default function FinalCTA() {
  const { t } = useLang()

  return (
    <section id="final-cta" className="bg-warm-deep py-28 px-6 relative overflow-hidden">
      {/* Subtle warm texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, #C4956A 0%, transparent 60%),
                            radial-gradient(circle at 70% 50%, #A87A52 0%, transparent 60%)`,
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p className="font-sans text-warm-tan/80 text-xs tracking-[0.2em] uppercase mb-5">
            {t('Early Access', '早鳥搶先體驗')}
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-medium mb-5 leading-tight text-balance">
            {t(
              'Be the first to explore Journi',
              '成為第一批探索 Journi 的旅人'
            )}
          </h2>

          <p className="font-sans text-white/50 text-base mb-10 max-w-sm mx-auto leading-relaxed">
            {t(
              "We're building something special. Join the waitlist and we'll let you know the moment we launch.",
              '我們正在打造一件特別的事。加入候補名單，第一時間獲得上線通知。'
            )}
          </p>

          <WaitlistForm variant="cta" />

          <p className="text-white/25 text-xs font-sans mt-4">
            {t('No spam. Unsubscribe anytime.', '不發垃圾信。隨時可取消訂閱。')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
