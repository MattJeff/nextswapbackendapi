import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';

interface SupabaseUser {
  id: string;
  sub?: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  user?: SupabaseUser;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Authentification requise : Token manquant'));
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return next(new ApiError(401, 'Authentification échouée : Token invalide ou expiré'));
    }
    req.user = user as SupabaseUser;
    if (!req.user.sub) req.user.sub = req.user.id;
    if (!req.user.id) req.user.id = req.user.sub;
    next();
  } catch (err) {
    next(new ApiError(500, "Erreur serveur lors de l'authentification"));
  }
};
