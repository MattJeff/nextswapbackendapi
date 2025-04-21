import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { ApiError } from '../utils/AppError';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) {
    return next(new ApiError(400, 'Invalid signup data'));
  }
  const { email, password } = parse.data;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) {
      return next(new ApiError(409, error.message || "Erreur lors de l'inscription"));
    }
    if (data.user && !data.session) {
      res.status(201).json({ message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.' });
    } else if (data.session) {
      res.status(201).json({
        message: 'Inscription et connexion réussies.',
        userId: data.user?.id,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
      });
    } else {
      next(new ApiError(500, 'Réponse inattendue de Supabase après inscription'));
    }
  } catch (err: any) {
    next(new ApiError(500, err.message || "Erreur serveur lors de l'inscription"));
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return next(new ApiError(400, 'Email et mot de passe requis'));
  }
  const { email, password } = parse.data;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return next(new ApiError(401, error?.message || 'Identifiants invalides'));
    }
    res.status(200).json({
      message: 'Connexion réussie',
      userId: data.user.id,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  } catch (err: any) {
    next(new ApiError(500, err.message || 'Erreur serveur lors de la connexion'));
  }
};
