export interface Trip {
  id: string
  owner_id: string
  title: string
  destination: string
  start_date: string | null
  end_date: string | null
  cover_image: string | null
  is_public: boolean
  share_token: string
  created_at: string
  updated_at: string
}

export interface TripDay {
  id: string
  trip_id: string
  day_number: number
  date: string | null
  title: string | null
  notes: string | null
  created_at: string
}

export interface Activity {
  id: string
  day_id: string
  trip_id: string
  type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'transport'
  title: string
  description: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  cost: number | null
  currency: string
  booking_ref: string | null
  image_url: string | null
  klook_link: string | null
  kkday_link: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TripCollaborator {
  id: string
  trip_id: string
  user_id: string | null
  email: string | null
  role: 'editor' | 'viewer'
  accepted_at: string | null
  created_at: string
}

export interface TripWithMeta extends Trip {
  trip_days?: { count: number }[]
  trip_collaborators?: { count: number }[]
}
