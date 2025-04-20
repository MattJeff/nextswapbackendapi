-- Ajoute les colonnes de géolocalisation et de sexe au profil utilisateur
ALTER TABLE profiles
ADD COLUMN sex text,
ADD COLUMN location geography(Point, 4326),
ADD COLUMN location_updated_at timestamptz;

-- Pour afficher l'adresse, il faudra faire du reverse geocoding côté backend (API externe)
