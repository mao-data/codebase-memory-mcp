import { createClient } from '@/utils/supabase/server'
import TripCard from '@/components/app/TripCard'
import EmptyState from '@/components/app/EmptyState'
import type { TripWithMeta } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: ownedTrips } = await supabase
    .from('trips')
    .select('*, trip_collaborators(count)')
    .eq('owner_id', user!.id)
    .order('updated_at', { ascending: false })

  const { data: sharedTrips } = await supabase
    .from('trips')
    .select('*, trip_collaborators!inner(count)')
    .eq('trip_collaborators.user_id', user!.id)
    .neq('owner_id', user!.id)
    .order('updated_at', { ascending: false })

  const myTrips = (ownedTrips ?? []) as TripWithMeta[]
  const shared = (sharedTrips ?? []) as TripWithMeta[]
  const hasTrips = myTrips.length > 0 || shared.length > 0

  const firstName = user!.email?.split('@')[0] ?? 'traveller'

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl text-warm-text font-medium mb-1">
            Welcome back, {firstName} ✈
          </h1>
          <p className="text-sm text-warm-muted font-sans">
            {hasTrips
              ? `You have ${myTrips.length} trip${myTrips.length !== 1 ? 's' : ''}`
              : 'Start planning your next adventure'}
          </p>
        </div>
        <a
          href="/trips/new"
          className="
            flex items-center gap-2
            bg-warm-tan hover:bg-warm-tan-dark
            text-white font-sans font-medium text-sm
            px-5 py-2.5 rounded-full
            transition-all duration-200 hover:shadow-md hover:-translate-y-px
            whitespace-nowrap
          "
        >
          <span>✨</span>
          New trip
        </a>
      </div>

      {!hasTrips ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          {/* My Trips */}
          {myTrips.length > 0 && (
            <section>
              <h2 className="font-sans text-xs font-semibold text-warm-muted uppercase tracking-widest mb-4">
                My Trips
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {/* Shared with me */}
          {shared.length > 0 && (
            <section>
              <h2 className="font-sans text-xs font-semibold text-warm-muted uppercase tracking-widest mb-4">
                Shared with me
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {shared.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
