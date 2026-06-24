'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

interface WaitlistFormProps {
  variant?: 'hero' | 'cta'
}

export default function WaitlistForm({ variant = 'hero' }: WaitlistFormProps) {
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const isHero = variant === 'hero'

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center py-2 ${isHero ? 'text-white' : 'text-warm-text'}`}
        >
          <div className="text-3xl mb-2">✓</div>
          <p className="font-sans text-sm">
            {t("You're on the list! We'll be in touch soon.", '已成功加入！我們會盡快與您聯繫。')}
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('Enter your email address', '輸入您的電子郵件')}
              required
              className={`
                flex-1 px-4 py-3 rounded-xl text-sm font-sans outline-none
                transition-all duration-200 border
                ${isHero
                  ? 'bg-white/95 text-warm-text placeholder:text-warm-light border-transparent focus:border-warm-tan focus:ring-2 focus:ring-warm-tan/20'
                  : 'bg-warm-cream text-warm-text placeholder:text-warm-light border-warm-border focus:border-warm-tan focus:ring-2 focus:ring-warm-tan/20'
                }
              `}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="
                bg-warm-tan hover:bg-warm-tan-dark disabled:opacity-60
                text-white font-sans font-medium text-sm
                px-6 py-3 rounded-xl
                transition-all duration-200
                whitespace-nowrap
                hover:shadow-md hover:-translate-y-px
                active:translate-y-0
              "
            >
              {status === 'loading'
                ? t('Joining...', '加入中...')
                : t('Join Waitlist', '加入候補名單')}
            </button>
          </div>
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs mt-2 text-center ${isHero ? 'text-red-300' : 'text-red-500'}`}
            >
              {t('Something went wrong. Please try again.', '發生錯誤，請再試一次。')}
            </motion.p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  )
}
