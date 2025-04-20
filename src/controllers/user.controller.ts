import { Request, Response, NextFunction } from 'express';
import { 
  searchUsersService, 
  getUserByIdService, 
  createUserService, 
  updateUserService, 
  deleteUserService 
} from '../services/user.service';

export const searchUsers = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await searchUsersService(req);
    res.json(result);
  } catch (error) {
    console.error('[USER_CONTROLLER] ERREUR attrapée dans le catch:', error);
    next(error);
  }
};

export const getUserById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('[USER_CONTROLLER] ERREUR attrapée dans le catch:', error);
    next(error);
  }
};

export const createUser = async (req: any, res: Response, next: NextFunction) => {
  console.log('[USER_CONTROLLER] createUser called');
  console.log('[USER_CONTROLLER] createUser req.user:', req.user);
  try {
    const { username, birth_date, language, nationality } = req.body;
    const id = req.user?.id;
    const email = req.user?.email;
    console.log('[USER_CONTROLLER] id/email JWT:', { id, email });
    if (!id || !email) return res.status(401).json({ error: 'Unauthorized: missing user id/email' });

    // Vérifie si le profil existe déjà
    const existing = await getUserByIdService(id);
    console.log('[USER_CONTROLLER] Résultat getUserByIdService:', existing);
    if (existing) {
      console.log('[CREATE USER] Profil déjà existant pour id', id);
      return res.status(409).json({ error: 'Profile already exists' });
    }

    // Prépare le payload conforme au schéma
    const profilePayload = { id, email, username, birth_date, language, nationality };
    console.log('[USER_CONTROLLER] Payload envoyé à Supabase:', profilePayload);
    const user = await createUserService(profilePayload);
    console.log('[USER_CONTROLLER] Résultat retour Supabase:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('[USER_CONTROLLER] ERREUR attrapée dans le catch:', error);
    next(error);
  }
};

export const updateUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('[USER_CONTROLLER] ERREUR attrapée dans le catch:', error);
    next(error);
  }
};

export const deleteUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const success = await deleteUserService(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.json({ deleted: true });
  } catch (error) {
    console.error('[USER_CONTROLLER] ERREUR attrapée dans le catch:', error);
    next(error);
  }
};
