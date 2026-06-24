'use client'
import { useLang } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-warm-bg border-t border-warm-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-serif text-warm-text font-semibold text-lg tracking-tight">
          Journi
        </span>

        <p className="text-xs text-warm-light font-sans text-center">
          {t(
            'A product by Maoratec · © 2025 Journi. All rights reserved.',
            'Maoratec 出品 · © 2025 Journi. 版權所有。'
          )}
        </p>

        <div className="flex gap-5 text-xs text-warm-muted font-sans">
          <a href="#" className="hover:text-warm-text transition-colors">
            {t('Privacy', '隱私政策')}
          </a>
          <a href="#" className="hover:text-warm-text transition-colors">
            {t('Terms', '使用條款')}
          </a>
        </div>
      </div>
    </footer>
  )
}
