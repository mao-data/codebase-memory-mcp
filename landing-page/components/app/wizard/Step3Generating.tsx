'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onGenerate: () => Promise<void>
}

const MESSAGES = [
  'Planning your itinerary…',
  'Finding hidden gems…',
  'Checking local tips…',
  'Curating the best restaurants…',
  'Mapping your route…',
  'Adding finishing touches…',
]

export default function Step3Generating({ onGenerate }: Props) {
  const [progress, setProgress] = useState(0)
  const [msgIdx, setMsgIdx] = useState(0)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    // Fake progress: crawl to 92% while AI runs, then jump to 100 on done
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 92) return p
        return p + (92 - p) * 0.06 + 0.4
      })
      setMsgIdx(i => (i + 1) % MESSAGES.length)
    }, 1800)

    onGenerate().finally(() => {
      clearInterval(interval)
      setProgress(100)
    })

    return () => clearInterval(interval)
  }, [onGenerate])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Animated orb */}
      <div className="relative w-24 h-24 mb-10">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-warm-tan/20"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-warm-tan border-t-transparent"
        />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">✈️</div>
      </div>

      <h2 className="font-serif text-2xl text-warm-text font-medium mb-2">
        Crafting your trip
      </h2>

      <motion.p
        key={msgIdx}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="text-warm-muted font-sans text-sm mb-10 h-5"
      >
        {MESSAGES[msgIdx]}
      </motion.p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-warm-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-warm-tan rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.6 }}
        />
      </div>
      <p className="text-xs text-warm-light font-sans mt-3">
        This usually takes 20–40 seconds
      </p>
    </motion.div>
  )
}
