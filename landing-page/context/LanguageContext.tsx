'use client'
import { createContext, useContext, useState } from 'react'

type Lang = 'en' | 'zh'

interface LangContextType {
  lang: Lang
  toggle: () => void
  t: (en: string, zh: string) => string
}

const LanguageContext = createContext<LangContextType>({
  lang: 'zh',
  toggle: () => {},
  t: (_en, zh) => zh,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh')
  const toggle = () => setLang(l => (l === 'en' ? 'zh' : 'en'))
  const t = (en: string, zh: string) => (lang === 'en' ? en : zh)

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
