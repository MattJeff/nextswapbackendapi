import { Request, Response, NextFunction } from 'express';
import { blockUserService, unblockUserService, listBlockedUsersService } from '../services/block.service';

export const blockUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    await blockUserService(req.user.id, req.params.userId);
    res.status(201).json({ message: 'User blocked.' });
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    await unblockUserService(req.user.id, req.params.userId);
    res.json({ message: 'User unblocked.' });
  } catch (error) {
    next(error);
  }
};

export const listBlockedUsers = async (req: any, res: Response, next: NextFunction) => {
  try {
    const blocked = await listBlockedUsersService(req.user.id);
    res.json(blocked);
  } catch (error) {
    next(error);
  }
};
