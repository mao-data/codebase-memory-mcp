'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-warm-muted hover:text-warm-text font-sans transition-colors"
    >
      Sign out
    </button>
  )
}
