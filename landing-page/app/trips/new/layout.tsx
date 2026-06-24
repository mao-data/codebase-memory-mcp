import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function NewTripLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-warm-bg">
      <header className="border-b border-warm-border bg-warm-bg/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-sans text-warm-muted hover:text-warm-text transition-colors flex items-center gap-1.5"
          >
            ← Dashboard
          </Link>
          <span className="font-serif text-warm-text text-base font-medium">Plan a new trip</span>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
