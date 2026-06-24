'use client'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const steps = [
  {
    num: '01',
    en_title: 'Tell AI your dream trip',
    zh_title: '告訴 AI 你的旅遊夢想',
    en_desc:
      'Enter your destination, travel dates, budget, and preferences. Whether it\'s a solo adventure or a group trip, our AI tailors everything to you.',
    zh_desc:
      '輸入目的地、旅遊日期、預算和偏好。無論是獨自冒險還是多人旅行，AI 都能量身規劃。',
  },
  {
    num: '02',
    en_title: 'Collaborate with your travel crew',
    zh_title: '與旅伴一起協作',
    en_desc:
      'Invite companions to join your trip plan. Add activities, leave comments, and vote on what sounds most exciting — together.',
    zh_desc:
      '邀請旅伴加入你的行程計畫，一起新增活動、留言討論，並投票決定最令人期待的安排。',
  },
  {
    num: '03',
    en_title: 'Share your journey',
    zh_title: '分享你的旅程',
    en_desc:
      'Generate a beautiful shareable link anyone can view, or export a polished PDF. Your adventure, beautifully told.',
    zh_desc:
      '產出任何人都能瀏覽的精美分享連結，或匯出精緻的 PDF。你的冒險故事，值得被好好呈現。',
  },
]

export default function HowItWorks() {
  const { t } = useLang()

  return (
    <section className="bg-warm-cream py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-warm-text font-medium mb-4">
            {t('Simple as 1, 2, 3', '三步驟，輕鬆搞定')}
          </h2>
          <p className="text-warm-muted font-sans text-base">
            {t('From idea to adventure in minutes', '從想法到出發，只需幾分鐘')}
          </p>
        </motion.div>

        <div>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-6 sm:gap-10 items-start py-10 border-b border-warm-border last:border-0"
            >
              <span className="font-serif text-5xl sm:text-6xl font-medium text-warm-tan/25 leading-none flex-shrink-0 select-none">
                {step.num}
              </span>
              <div className="pt-1">
                <h3 className="font-serif text-xl text-warm-text font-medium mb-2">
                  {t(step.en_title, step.zh_title)}
                </h3>
                <p className="font-sans text-sm text-warm-muted leading-relaxed max-w-lg">
                  {t(step.en_desc, step.zh_desc)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
