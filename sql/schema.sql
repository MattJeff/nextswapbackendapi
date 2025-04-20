-- Extension PostGIS
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

-- Table des profils utilisateurs (déjà fournie plus haut)
-- ...

-- Table des relations d'amitié
CREATE TABLE IF NOT EXISTS public.friendships (
  user_id_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id_1, user_id_2),
  CONSTRAINT check_user_order CHECK (user_id_1 < user_id_2)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS friendships_user_id_1_idx ON public.friendships (user_id_1);
CREATE INDEX IF NOT EXISTS friendships_user_id_2_idx ON public.friendships (user_id_2);

-- Table des blocages utilisateurs
CREATE TABLE IF NOT EXISTS public.blocks (
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (blocker_id, blocked_id)
);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS blocks_blocker_id_idx ON public.blocks (blocker_id);

-- Politiques RLS pour friendships
CREATE POLICY IF NOT EXISTS "Users can select own friendships"
  ON public.friendships FOR SELECT TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
CREATE POLICY IF NOT EXISTS "Users can insert own friendships"
  ON public.friendships FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
CREATE POLICY IF NOT EXISTS "Users can delete own friendships"
  ON public.friendships FOR DELETE TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
CREATE POLICY IF NOT EXISTS "Users can update pending friendship status"
  ON public.friendships FOR UPDATE TO authenticated
  USING (status = 'pending' AND auth.uid() = user_id_2);

-- Politiques RLS pour blocks
CREATE POLICY IF NOT EXISTS "Users can select their own blocks"
  ON public.blocks FOR SELECT TO authenticated
  USING (auth.uid() = blocker_id);
CREATE POLICY IF NOT EXISTS "Users can insert blocks"
  ON public.blocks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY IF NOT EXISTS "Users can delete their own blocks"
  ON public.blocks FOR DELETE TO authenticated
  USING (auth.uid() = blocker_id);
