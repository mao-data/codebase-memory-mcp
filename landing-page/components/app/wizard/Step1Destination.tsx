'use client'
import { motion } from 'framer-motion'
import type { WizardData } from '@/app/trips/new/page'

interface Props {
  data: WizardData
  setData: (d: WizardData) => void
  onNext: () => void
}

const SUGGESTIONS = ['Tokyo, Japan', 'Bali, Indonesia', 'Paris, France', 'Bangkok, Thailand', 'Seoul, South Korea', 'Barcelona, Spain']

export default function Step1Destination({ data, setData, onNext }: Props) {
  const canContinue = data.destination.trim().length > 1

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="font-serif text-3xl text-warm-text font-medium mb-2">
        Where are you headed?
      </h1>
      <p className="text-warm-muted font-sans text-sm mb-8">
        Tell us your destination and when you're going.
      </p>

      <div className="space-y-5">
        {/* Destination */}
        <div>
          <label className="block text-xs font-sans font-semibold text-warm-muted uppercase tracking-widest mb-2">
            Destination
          </label>
          <input
            type="text"
            value={data.destination}
            onChange={e => setData({ ...data, destination: e.target.value })}
            placeholder="e.g. Tokyo, Japan"
            autoFocus
            className="w-full px-4 py-3.5 rounded-xl font-sans text-base bg-warm-card border border-warm-border text-warm-text placeholder:text-warm-light outline-none focus:border-warm-tan focus:ring-2 focus:ring-warm-tan/15 transition-all"
          />
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setData({ ...data, destination: s })}
                className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  data.destination === s
                    ? 'bg-warm-tan text-white border-warm-tan'
                    : 'border-warm-border text-warm-muted hover:border-warm-tan hover:text-warm-tan'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-sans font-semibold text-warm-muted uppercase tracking-widest mb-2">
              Start date
            </label>
            <input
              type="date"
              value={data.startDate}
              onChange={e => setData({ ...data, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3.5 rounded-xl font-sans text-sm bg-warm-card border border-warm-border text-warm-text outline-none focus:border-warm-tan focus:ring-2 focus:ring-warm-tan/15 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold text-warm-muted uppercase tracking-widest mb-2">
              End date
            </label>
            <input
              type="date"
              value={data.endDate}
              onChange={e => setData({ ...data, endDate: e.target.value })}
              min={data.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3.5 rounded-xl font-sans text-sm bg-warm-card border border-warm-border text-warm-text outline-none focus:border-warm-tan focus:ring-2 focus:ring-warm-tan/15 transition-all"
            />
          </div>
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-xs font-sans font-semibold text-warm-muted uppercase tracking-widest mb-2">
            Travelers
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setData({ ...data, travelers: Math.max(1, data.travelers - 1) })}
              className="w-10 h-10 rounded-full border border-warm-border text-warm-muted hover:border-warm-tan hover:text-warm-tan transition-all font-sans text-lg"
            >
              −
            </button>
            <span className="font-serif text-2xl text-warm-text w-8 text-center">
              {data.travelers}
            </span>
            <button
              type="button"
              onClick={() => setData({ ...data, travelers: Math.min(20, data.travelers + 1) })}
              className="w-10 h-10 rounded-full border border-warm-border text-warm-muted hover:border-warm-tan hover:text-warm-tan transition-all font-sans text-lg"
            >
              +
            </button>
            <span className="text-sm text-warm-muted font-sans">
              {data.travelers === 1 ? 'solo traveller' : 'travellers'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="bg-warm-tan hover:bg-warm-tan-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-sans font-medium text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-px"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  )
}
