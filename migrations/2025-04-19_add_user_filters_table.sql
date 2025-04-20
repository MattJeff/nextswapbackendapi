-- Table dédiée pour les préférences de filtre utilisateur
CREATE TABLE IF NOT EXISTS user_filters (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  min_age integer,
  max_age integer,
  language text[],
  nationality text[],
  sex text[],
  radius_km integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour accélérer les recherches
CREATE INDEX IF NOT EXISTS idx_user_filters_language ON user_filters USING gin(language);
CREATE INDEX IF NOT EXISTS idx_user_filters_nationality ON user_filters USING gin(nationality);
CREATE INDEX IF NOT EXISTS idx_user_filters_sex ON user_filters USING gin(sex);
