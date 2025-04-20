import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/AppError';

export const friendshipRequestSchema = z.object({
  userId: z.string().uuid()
});

export function validateFriendRequest(req: Request, res: Response, next: NextFunction) {
  const parse = friendshipRequestSchema.safeParse({ userId: req.params.userId });
  if (!parse.success) {
    return next(new ApiError(400, 'Invalid userId for friend request'));
  }
  next();
}
