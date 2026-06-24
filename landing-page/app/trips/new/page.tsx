'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import StepIndicator from '@/components/app/wizard/StepIndicator'
import Step1Destination from '@/components/app/wizard/Step1Destination'
import Step2Preferences from '@/components/app/wizard/Step2Preferences'
import Step3Generating from '@/components/app/wizard/Step3Generating'

export interface WizardData {
  destination: string
  startDate: string
  endDate: string
  travelers: number
  styles: string[]
  budget: string
  notes: string
}

const DEFAULT: WizardData = {
  destination: '',
  startDate: '',
  endDate: '',
  travelers: 2,
  styles: [],
  budget: 'mid',
  notes: '',
}

export default function NewTripPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(DEFAULT)
  const [error, setError] = useState('')

  const generate = useCallback(async () => {
    setError('')
    try {
      const res = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Generation failed')
      }

      const { tripId } = await res.json()
      router.push(`/trips/${tripId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setStep(2) // back to preferences so user can retry
    }
  }, [data, router])

  return (
    <div className="bg-warm-card rounded-2xl border border-warm-border p-8 shadow-sm">
      {step < 3 && <StepIndicator current={step} total={2} />}

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
          {error} — please try again.
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <Step1Destination
            key="step1"
            data={data}
            setData={setData}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2Preferences
            key="step2"
            data={data}
            setData={setData}
            onBack={() => setStep(1)}
            onGenerate={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3Generating
            key="step3"
            onGenerate={generate}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
