import { Request, Response, NextFunction } from 'express';
import { requestMatchService } from '../services/matchmaking.service';

export const requestMatch = async (req: any, res: Response, next: NextFunction) => {
  try {
    const match = await requestMatchService(req.user.id, req.body);
    res.json(match);
  } catch (error) {
    next(error);
  }
};
