'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function Mockup() {
  const { t } = useLang()

  return (
    <section className="bg-warm-bg py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-warm-text font-medium mb-4 text-balance">
            {t('Your trip, beautifully organized', '你的旅程，美觀呈現')}
          </h2>
          <p className="text-warm-muted font-sans text-base max-w-sm mx-auto leading-relaxed">
            {t(
              'Every detail in one place — flights, hotels, activities, and personal notes.',
              '所有細節一目了然 — 機票、住宿、活動與個人筆記。'
            )}
          </p>
        </motion.div>

        {/* Phone mockup with floating badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-xs mx-auto"
        >
          {/* Main trip card */}
          <div className="bg-warm-card rounded-3xl shadow-2xl border border-warm-border overflow-hidden">
            {/* Card header */}
            <div className="px-5 pt-5 pb-4 border-b border-warm-border">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="font-serif text-base text-warm-text font-medium">
                    {t('Tokyo Adventure', '東京冒險之旅')}
                  </h3>
                  <p className="text-xs text-warm-muted font-sans mt-0.5">
                    {t('March 15–20, 2024 · 6 days', '2024 年 3 月 15–20 日 · 6 天')}
                  </p>
                </div>
                {/* Collaborator avatars */}
                <div className="flex -space-x-2">
                  {['#C4956A', '#8B7355', '#D4A574'].map((color, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-sans font-medium"
                      style={{ backgroundColor: color }}
                    >
                      {['A', 'B', 'C'][i]}
                    </div>
                  ))}
                </div>
              </div>
              {/* Tab bar */}
              <div className="flex gap-1.5 mt-3">
                {[
                  { en: 'Overview', zh: '總覽' },
                  { en: 'Timeline', zh: '時間軸', active: true },
                  { en: '+ Add', zh: '+ 新增' },
                ].map((tab, i) => (
                  <button
                    key={i}
                    className={`text-xs font-sans px-3 py-1.5 rounded-full transition-colors ${
                      tab.active
                        ? 'bg-warm-text text-white'
                        : 'text-warm-muted hover:text-warm-text'
                    }`}
                  >
                    {t(tab.en, tab.zh)}
                  </button>
                ))}
              </div>
            </div>

            {/* Day navigation */}
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="w-6 h-6 rounded-full border border-warm-border flex items-center justify-center text-warm-muted text-xs">
                  ‹
                </button>
                <span className="text-sm font-sans font-medium text-warm-text">
                  {t('Day 1', '第 1 天')}
                </span>
                <button className="w-6 h-6 rounded-full border border-warm-border flex items-center justify-center text-warm-muted text-xs">
                  ›
                </button>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-warm-tan" />
                <div className="w-1.5 h-1.5 rounded-full bg-warm-border" />
                <div className="w-1.5 h-1.5 rounded-full bg-warm-border" />
              </div>
            </div>
            <p className="px-5 text-xs text-warm-light font-sans pb-3">
              {t('Thursday, March 14, 2024', '2024 年 3 月 14 日，星期四')}
            </p>

            {/* Activity card */}
            <div className="px-5 pb-5">
              <div className="bg-warm-cream rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-base flex-shrink-0">
                      ✈️
                    </div>
                    <div>
                      <p className="text-xs font-sans font-medium text-warm-text">
                        {t('Flight to Tokyo', '飛往東京')}
                      </p>
                      <p className="text-xs text-warm-light font-sans">11:00 AM</p>
                    </div>
                  </div>
                  <span className="text-xs font-sans font-semibold text-warm-text">$850</span>
                </div>
                <p className="text-xs text-warm-muted font-sans mb-2">
                  {t('San Francisco → Tokyo', '舊金山 → 東京')}
                </p>
                <p className="text-xs text-warm-light font-sans mb-3">
                  {t('United Airlines UA837 · Direct SFO→NRT', 'United Airlines UA837 · SFO 直飛 NRT')}
                </p>
                <div className="rounded-xl overflow-hidden h-20 bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
                  <span className="text-4xl">🛫</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge — collaborators */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-6 top-1/4 bg-warm-card rounded-2xl shadow-xl border border-warm-border px-3.5 py-2.5 flex items-center gap-2 hidden sm:flex"
          >
            <span className="text-sm">👥</span>
            <div>
              <p className="text-xs font-sans font-medium text-warm-text leading-tight">
                {t('3 collaborators', '3 位旅伴')}
              </p>
              <p className="text-xs text-warm-muted font-sans leading-tight">
                {t('editing now', '正在編輯')}
              </p>
            </div>
          </motion.div>

          {/* Floating badge — AI */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute -left-8 bottom-1/4 bg-warm-card rounded-2xl shadow-xl border border-warm-border px-3.5 py-2.5 flex items-center gap-2 hidden sm:flex"
          >
            <span className="text-sm">✨</span>
            <div>
              <p className="text-xs font-sans font-medium text-warm-text leading-tight">
                {t('AI Suggested', 'AI 建議')}
              </p>
              <p className="text-xs text-warm-muted font-sans leading-tight">
                {t('Shibuya Crossing', '澀谷十字路口')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
