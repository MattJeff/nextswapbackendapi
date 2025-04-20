export interface UserProfile {
  id: string;
  username: string;
  birth_date: string;
  language: string;
  nationality: string;
  location?: string;
  is_available_for_matchmaking?: boolean;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}
