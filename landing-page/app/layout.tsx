import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Journi — Plan Together, Cherish Every Moment',
  description:
    'AI-powered travel planning built for sharing. Organize trips, collaborate with friends, and share every adventure beautifully.',
  openGraph: {
    title: 'Journi — Plan Together, Cherish Every Moment',
    description: 'AI-powered travel planning built for sharing.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-warm-bg text-warm-text antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
