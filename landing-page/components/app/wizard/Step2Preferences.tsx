'use client'
import { motion } from 'framer-motion'
import type { WizardData } from '@/app/trips/new/page'

interface Props {
  data: WizardData
  setData: (d: WizardData) => void
  onBack: () => void
  onGenerate: () => void
}

const STYLES = [
  { id: 'cultural',   label: 'Cultural',   icon: '🏛️' },
  { id: 'foodie',     label: 'Foodie',     icon: '🍜' },
  { id: 'nature',     label: 'Nature',     icon: '🌿' },
  { id: 'shopping',   label: 'Shopping',   icon: '🛍️' },
  { id: 'adventure',  label: 'Adventure',  icon: '🧗' },
  { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
]

const BUDGETS = [
  { id: 'budget',      label: 'Budget',      desc: 'Hostels & street food' },
  { id: 'mid',         label: 'Mid-range',   desc: '3-star hotels & locals' },
  { id: 'comfortable', label: 'Comfortable', desc: '4-star hotels & dining' },
  { id: 'luxury',      label: 'Luxury',      desc: '5-star & fine dining' },
]

export default function Step2Preferences({ data, setData, onBack, onGenerate }: Props) {
  const toggleStyle = (id: string) => {
    const styles = data.styles.includes(id)
      ? data.styles.filter(s => s !== id)
      : [...data.styles, id]
    setData({ ...data, styles })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="font-serif text-3xl text-warm-text font-medium mb-2">
        Your travel style
      </h1>
      <p className="text-warm-muted font-sans text-sm mb-8">
        Help us personalise your itinerary.
      </p>

      <div className="space-y-7">
        {/* Style chips */}
        <div>
          <label className="block text-xs font-sans font-semibold text-warm-muted uppercase tracking-widest mb-3">
            Interests <span className="normal-case font-normal">(pick any)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(s => {
              const active = data.styles.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStyle(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-sans transition-all duration-200 ${
                    active
                      ? 'bg-warm-tan text-white border-warm-tan shadow-sm'
                      : 'border-warm-border text-warm-muted hover:border-warm-tan hover:text-warm-tan'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-sans font-semibold text-warm-muted uppercase tracking-widest mb-3">
            Budget level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {BUDGETS.map(b => {
              const active = data.budget === b.id
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setData({ ...data, budget: b.id })}
                  className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
                    active
                      ? 'border-warm-tan bg-warm-tan/8 ring-2 ring-warm-tan/20'
                      : 'border-warm-border hover:border-warm-tan/50'
                  }`}
                >
                  <div className={`text-sm font-sans font-semibold ${active ? 'text-warm-tan' : 'text-warm-text'}`}>
                    {b.label}
                  </div>
                  <div className="text-xs font-sans text-warm-muted mt-0.5">
                    {b.desc}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-sans font-semibold text-warm-muted uppercase tracking-widest mb-2">
            Special requests <span className="normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={data.notes}
            onChange={e => setData({ ...data, notes: e.target.value })}
            placeholder="e.g. vegetarian meals, avoiding long walks, must-see spots..."
            rows={3}
            className="w-full px-4 py-3.5 rounded-xl font-sans text-sm bg-warm-card border border-warm-border text-warm-text placeholder:text-warm-light outline-none focus:border-warm-tan focus:ring-2 focus:ring-warm-tan/15 transition-all resize-none"
          />
        </div>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-sans text-warm-muted hover:text-warm-text transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onGenerate}
          className="bg-warm-tan hover:bg-warm-tan-dark text-white font-sans font-medium text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-px"
        >
          Generate itinerary ✨
        </button>
      </div>
    </motion.div>
  )
}
