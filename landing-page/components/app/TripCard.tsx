import type { TripWithMeta } from '@/types/database'
import Image from 'next/image'

const DESTINATION_PHOTOS: Record<string, string> = {
  tokyo: 'photo-1540959733332-eab4deabeeaf',
  japan: 'photo-1540959733332-eab4deabeeaf',
  kyoto: 'photo-1492571350019-22de08371fd3',
  bali: 'photo-1537996194471-e657df975ab4',
  paris: 'photo-1499856871958-5b9627545d1a',
  london: 'photo-1513635269975-59663e0ac1ad',
  newyork: 'photo-1496442226666-8d4d0e62e6e9',
  bangkok: 'photo-1508009603885-50cf7c579365',
  seoul: 'photo-1538485399081-7191377e8241',
  default: 'photo-1506905925346-21bda4d32df4',
}

function getCoverPhoto(destination: string, coverImage: string | null): string {
  if (coverImage) return coverImage
  const key = destination.toLowerCase().replace(/\s/g, '')
  const photoId = Object.entries(DESTINATION_PHOTOS).find(([k]) => key.includes(k))?.[1]
    ?? DESTINATION_PHOTOS.default
  return `https://images.unsplash.com/${photoId}?w=600&q=70`
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return 'Dates TBD'
  const s = new Date(start)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (!end) return s.toLocaleDateString('en', opts)
  const e = new Date(end)
  const days = Math.round((e.getTime() - s.getTime()) / 86400000) + 1
  return `${s.toLocaleDateString('en', opts)} – ${e.toLocaleDateString('en', opts)} · ${days}d`
}

interface TripCardProps {
  trip: TripWithMeta
}

export default function TripCard({ trip }: TripCardProps) {
  const photo = getCoverPhoto(trip.destination, trip.cover_image)
  const dateStr = formatDateRange(trip.start_date, trip.end_date)
  const collabCount = trip.trip_collaborators?.[0]?.count ?? 0

  return (
    <a
      href={`/trips/${trip.id}`}
      className="group block bg-warm-card border border-warm-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover photo */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={photo}
          alt={trip.destination}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {trip.is_public && (
          <span className="absolute top-3 right-3 bg-warm-tan text-white text-xs font-sans px-2 py-0.5 rounded-full">
            Public
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-base font-medium text-warm-text mb-1 truncate">
          {trip.title}
        </h3>
        <p className="text-xs text-warm-muted font-sans mb-3">{dateStr}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-warm-light font-sans">{trip.destination}</span>
          {collabCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-warm-muted font-sans">
              <span>👥</span>
              {collabCount + 1}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
