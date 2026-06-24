import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AppNav from '@/components/app/AppNav'

export const metadata = {
  title: 'My Trips — Journi',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-warm-bg">
      <AppNav user={user} />
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
