import type { User } from '@supabase/supabase-js'
import SignOutButton from './SignOutButton'

interface AppNavProps {
  user: User
}

export default function AppNav({ user }: AppNavProps) {
  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'JN'

  return (
    <nav className="bg-warm-bg border-b border-warm-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <a
          href="/dashboard"
          className="font-serif text-xl font-semibold text-warm-text tracking-tight hover:text-warm-tan transition-colors"
        >
          Journi
        </a>

        <div className="flex items-center gap-4">
          <span className="text-xs text-warm-muted font-sans hidden sm:block">
            {user.email}
          </span>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-warm-tan flex items-center justify-center text-white text-xs font-sans font-semibold">
            {initials}
          </div>
          <SignOutButton />
        </div>
      </div>
    </nav>
  )
}
