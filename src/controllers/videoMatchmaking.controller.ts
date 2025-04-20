import { Request, Response, NextFunction } from 'express';
import { getNextVideoProfileService } from '../services/videoMatchmaking.service';

export const getNextVideoProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const profile = await getNextVideoProfileService(req.user.id, req.query);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
