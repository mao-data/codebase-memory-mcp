interface StepIndicatorProps {
  current: number
  total: number
}

export default function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }, (_, i) => i + 1).map(step => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-all duration-300 ${
              step < current
                ? 'bg-warm-tan text-white'
                : step === current
                ? 'bg-warm-tan text-white ring-4 ring-warm-tan/20'
                : 'bg-warm-border text-warm-muted'
            }`}
          >
            {step < current ? '✓' : step}
          </div>
          {step < total && (
            <div
              className={`h-px w-10 transition-all duration-500 ${
                step < current ? 'bg-warm-tan' : 'bg-warm-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
