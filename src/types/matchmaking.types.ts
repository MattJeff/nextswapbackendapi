export interface MatchmakingParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
  minAge?: number;
  maxAge?: number;
  language?: string;
  nationality?: string;
}

export interface Match {
  userId: string;
  distance: number;
}
