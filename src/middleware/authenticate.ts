import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  console.log('[AUTH] Middleware appelé. Headers:', req.headers);
  const authHeader = req.headers['authorization'];
  console.log('[AUTH] Authorization header:', authHeader);
  if (!authHeader) return next(new ApiError(401, 'No token provided'));
  const token = authHeader.split(' ')[1];
  console.log('[AUTH] Token extrait:', token);
  try {
    const decoded = verifyToken(token);
    console.log('[AUTH] Payload décodé:', decoded);
    if (typeof decoded !== 'object' || decoded === null) throw new ApiError(401, 'Invalid token payload');
    req.user = {
      id: (decoded as any).sub, // Supabase met l'id dans sub
      email: (decoded as any).email,
      ...(decoded as object) // autres claims si besoin
    };
    console.log('[AUTH] req.user injecté:', req.user);
    next();
  } catch (err) {
    console.error('[AUTH] Erreur de décodage JWT (full):', err);
    next(new ApiError(401, 'Invalid token'));
  }
};
