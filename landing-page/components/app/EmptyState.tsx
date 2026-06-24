export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-6">✈️</div>
      <h2 className="font-serif text-2xl text-warm-text font-medium mb-3">
        Your next adventure awaits
      </h2>
      <p className="text-sm text-warm-muted font-sans max-w-xs mb-8 leading-relaxed">
        Create your first trip and let AI plan the perfect itinerary for you.
      </p>
      <a
        href="/trips/new"
        className="bg-warm-tan hover:bg-warm-tan-dark text-white font-sans font-medium text-sm px-6 py-3 rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-px"
      >
        Plan my first trip ✨
      </a>
    </div>
  )
}
