export type EventCategory = 'Community' | 'Trail' | 'Race' | 'Workshop';
export type EventDifficulty = 'All Levels' | 'Beginner Friendly' | 'Intermediate' | 'Advanced' | 'Expert';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type RegistrationStatus = 'confirmed' | 'waitlist' | 'attended' | 'cancelled';

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface DashboardEvent {
  id: string; // e.g. "wayanad-ghats-challenge"
  title: string;
  slug: string;
  category: EventCategory;
  category_label: string;
  tag: string;
  date: string; // e.g. "Sat, Nov 28, 2026"
  time: string; // e.g. "6:00 AM - 1:00 PM"
  location: string;
  google_maps_url?: string | null;
  distance: string; // e.g. "65 km" or "3 Hours Workshop"
  difficulty: EventDifficulty;
  fee: string; // e.g. "Free Entry"
  is_free: boolean;
  max_spots: number;
  filled_spots: number;
  spots_left: number;
  total_registrations: number;
  confirmed_riders: number;
  attended_riders: number;
  cancelled_count: number;
  image: string;
  description: string;
  highlights: string[];
  schedule: ScheduleItem[];
  status: EventStatus;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRegistrationItem {
  id: string; // UUID
  registration_number: string; // Ticket code, e.g. "BR-EVT-2026-5337"
  ticket_code: string;
  event: string;
  event_id: string;
  event_title: string;
  full_name: string;
  phone: string;
  email: string;
  participants: number;
  bike_type: string;
  experience_level: string;
  emergency_contact: string;
  notes: string;
  agreed_to_terms: boolean;
  status: RegistrationStatus;
  payment_status: 'not_required' | 'paid' | 'pending' | 'waived';
  created_at: string;
  updated_at: string;
}

