import { Request, Response, NextFunction } from 'express';
import { createVideoRoomForMatch } from '../services/video.service';
import { ApiError } from '../utils/AppError';

export const createVideoCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userA, userB } = req.body;
    if (!userA || !userB) throw new ApiError(400, 'userA and userB are required');
    const result = await createVideoRoomForMatch(userA, userB);
    res.status(201).json(result);
  } catch (error) {
    if (error) next(error); else next(new ApiError(500, 'Unknown error'));
  }
};
