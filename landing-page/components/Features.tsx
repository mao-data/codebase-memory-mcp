'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)

const CollabIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
  </svg>
)

const features = [
  {
    icon: <SparkleIcon />,
    en_title: 'AI-Powered Planning',
    zh_title: 'AI 智慧規劃',
    en_desc: 'Describe your dream trip and watch AI build a complete, personalized itinerary — destinations, activities, and timing — in seconds.',
    zh_desc: '告訴 AI 你的旅遊夢想，幾秒內獲得完整個人化行程，包含景點、活動與時間安排。',
  },
  {
    icon: <CollabIcon />,
    en_title: 'Collaborate in Real-Time',
    zh_title: '即時協作編輯',
    en_desc: 'Invite friends and family to plan together. Everyone can add ideas, edit activities, and vote on what to do each day.',
    zh_desc: '邀請旅伴一起規劃，所有人都能新增想法、編輯活動，並投票決定每天的行程。',
  },
  {
    icon: <ShareIcon />,
    en_title: 'Share Beautifully',
    zh_title: '美觀分享行程',
    en_desc: 'Generate a stunning shareable link or export to PDF. Your itinerary looks as good as the trip itself.',
    zh_desc: '產出精美分享連結或匯出 PDF，你的行程和旅程本身一樣值得被好好呈現。',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Features() {
  const { t } = useLang()

  return (
    <section className="bg-warm-bg py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-warm-text font-medium mb-4 text-balance">
            {t('Everything you need for perfect trips', '完美旅程的一切所需')}
          </h2>
          <p className="text-warm-muted font-sans text-base max-w-sm mx-auto leading-relaxed">
            {t(
              'Simple tools to plan, organize, and share your adventures',
              '簡單好用的工具，規劃、整理並分享你的旅程'
            )}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              className="
                bg-warm-card border border-warm-border rounded-2xl p-8
                hover:shadow-lg hover:-translate-y-1
                transition-all duration-300 group
              "
            >
              <div className="text-warm-tan mb-5 group-hover:scale-110 transition-transform duration-300 origin-left">
                {f.icon}
              </div>
              <h3 className="font-serif text-lg font-medium text-warm-text mb-3">
                {t(f.en_title, f.zh_title)}
              </h3>
              <p className="font-sans text-sm text-warm-muted leading-relaxed">
                {t(f.en_desc, f.zh_desc)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
