import { supabase } from './supabaseServiceClient';

async function createAndLoginUser(email: string, username: string) {
  // Création
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password: 'TestPassword123',
    options: {
      data: {
        username,
        birth_date: '2000-01-01',
        language: 'fr',
        nationality: 'FR',
      },
    },
  });
  if (signupError && !String(signupError.message).includes('already registered')) throw signupError;

  // Connexion
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: 'TestPassword123',
  });
  if (loginError) throw loginError;

  // Récupération du profil
  const userId = loginData.user?.id;
  let { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (profileError || !profile) {
    // Création manuelle du profil si absent
    const { data: insertedProfile, error: insertError } = await supabase.from('profiles').insert({
      id: userId,
      username,
      birth_date: '2000-01-01',
      language: 'fr',
      nationality: 'FR',
      email,
      created_at: new Date().toISOString()
    }).select('*').single();
    if (insertError) throw insertError;
    profile = insertedProfile;
  }

  return {
    id: userId,
    email,
    username,
    token: loginData.session?.access_token,
    profile,
  };

}

async function main() {
  // On nettoie toute relation d'amitié entre les deux users de test (dans les deux sens)
  const emails = ['testuser1@example.com', 'testuser2@example.com'];
  // On récupère les IDs des deux users (car ils peuvent changer)
  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id, email').in('email', emails);
  if (profilesError) {
    console.error('Erreur lors de la récupération des profils pour nettoyage:', profilesError);
    process.exit(1);
  }
  if (profiles.length === 2) {
    const id1 = profiles[0].id;
    const id2 = profiles[1].id;
    // Toujours dans l'ordre croissant pour respecter la contrainte
    const [user_id_1, user_id_2] = id1 < id2 ? [id1, id2] : [id2, id1];
    const { error: delErr } = await supabase
      .from('friendships')
      .delete()
      .or(`and(user_id_1.eq.${user_id_1},user_id_2.eq.${user_id_2}),and(user_id_1.eq.${user_id_2},user_id_2.eq.${user_id_1})`);
    if (delErr) {
      console.error('Erreur lors du nettoyage des anciennes amitiés:', delErr);
    } else {
      console.log('Relations d\'amitié nettoyées entre les deux users de test.');
    }
  } else {
    console.warn('Impossible de nettoyer les relations d\'amitié : les deux profils de test ne sont pas trouvés.');
  }

  const user1 = await createAndLoginUser('testuser1@example.com', 'testuser1');
  const user2 = await createAndLoginUser('testuser2@example.com', 'testuser2');
  const fs = require('fs');
  fs.writeFileSync(
    __dirname + '/testTokens.json',
    JSON.stringify({
      TOKEN_USER1: user1.token,
      TOKEN_USER2: user2.token,
      USER1_ID: user1.id,
      USER2_ID: user2.id
    }, null, 2)
  );
  console.log('Tokens et IDs de test écrits dans scripts/testTokens.json');

  // Vérification : affiche tous les IDs présents dans la table profiles
  const { data: allProfiles, error: allProfilesError } = await supabase.from('profiles').select('id, email, username');
  if (allProfilesError) {
    console.error('Erreur lors de la récupération des profils:', allProfilesError);
  } else {
    console.log('Profils présents dans la table profiles:', allProfiles);
  }
}


main().catch(e => { console.error(e); process.exit(1); });
