'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <a href="/" className="font-serif text-2xl font-semibold text-warm-text">
            Journi
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-warm-card border border-warm-border rounded-2xl p-8 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="text-4xl mb-4">✉️</div>
                <h2 className="font-serif text-xl text-warm-text mb-2">
                  Check your inbox
                </h2>
                <p className="text-sm text-warm-muted font-sans leading-relaxed">
                  We sent a sign-in link to <strong>{email}</strong>.
                  Click it to continue.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs text-warm-muted hover:text-warm-text font-sans transition-colors"
                >
                  Use a different email
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="font-serif text-2xl text-warm-text font-medium mb-1">
                  Start your journey
                </h2>
                <p className="text-sm text-warm-muted font-sans mb-6">
                  Sign in or create an account to continue.
                </p>

                {/* Google */}
                <button
                  onClick={handleGoogle}
                  className="
                    w-full flex items-center justify-center gap-3
                    border border-warm-border rounded-xl py-3 px-4
                    font-sans text-sm text-warm-text
                    hover:bg-warm-cream hover:border-warm-tan/40
                    transition-all duration-200 mb-4
                  "
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-warm-border" />
                  <span className="text-xs text-warm-light font-sans">or</span>
                  <div className="flex-1 h-px bg-warm-border" />
                </div>

                {/* Magic link form */}
                <form onSubmit={handleMagicLink} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="
                      w-full px-4 py-3 rounded-xl text-sm font-sans
                      bg-warm-cream border border-warm-border
                      text-warm-text placeholder:text-warm-light
                      outline-none focus:border-warm-tan focus:ring-2 focus:ring-warm-tan/15
                      transition-all duration-200
                    "
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="
                      w-full bg-warm-tan hover:bg-warm-tan-dark disabled:opacity-60
                      text-white font-sans font-medium text-sm
                      py-3 rounded-xl
                      transition-all duration-200 hover:shadow-md
                    "
                  >
                    {status === 'loading' ? 'Sending...' : 'Send me a sign-in link'}
                  </button>
                </form>

                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500 font-sans mt-3 text-center"
                  >
                    {errorMsg || 'Something went wrong. Please try again.'}
                  </motion.p>
                )}

                <p className="text-xs text-warm-light font-sans text-center mt-5">
                  No password needed. We'll email you a link.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-xs text-warm-light font-sans text-center mt-5">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-warm-muted transition-colors">Terms</a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-warm-muted transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
