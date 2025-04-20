import { Request, Response, NextFunction } from 'express';
import { getUserFilters, updateUserFilters } from '../services/userFilters.service';

export async function getUserFiltersController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new Error('User not authenticated');
const userId = req.user.id;
    const data = await getUserFilters(userId);
    res.json(data || {});
  } catch (error) {
    next(error);
  }
}

export async function updateUserFiltersController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new Error('User not authenticated');
const userId = req.user.id;
    const data = await updateUserFilters(userId, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
