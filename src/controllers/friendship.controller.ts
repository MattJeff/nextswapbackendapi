import { Request, Response, NextFunction } from 'express';
import {
  sendFriendRequestService,
  acceptFriendRequestService,
  removeFriendService,
  listFriendsService,
  listPendingRequestsService
} from '../services/friendship.service';

export const sendFriendRequest = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await sendFriendRequestService(req.user.id, req.params.userId);
    if (result && result.alreadyExists) {
      res.status(200).json({ message: 'Friendship already exists or pending.' });
    } else {
      res.status(201).json({ message: 'Friend request sent.' });
    }
  } catch (error) {
    next(error);
  }
};

export const acceptFriendRequest = async (req: any, res: Response, next: NextFunction) => {
  try {
    await acceptFriendRequestService(req.user.id, req.params.userId);
    res.json({ message: 'Friend request accepted.' });
  } catch (error) {
    next(error);
  }
};

export const removeFriend = async (req: any, res: Response, next: NextFunction) => {
  try {
    await removeFriendService(req.user.id, req.params.userId);
    res.json({ message: 'Friend removed.' });
  } catch (error) {
    next(error);
  }
};

export const listFriends = async (req: any, res: Response, next: NextFunction) => {
  try {
    const friends = await listFriendsService(req.user.id);
    res.json(friends);
  } catch (error) {
    next(error);
  }
};

export const listPendingRequests = async (req: any, res: Response, next: NextFunction) => {
  try {
    const pending = await listPendingRequestsService(req.user.id);
    res.json(pending);
  } catch (error) {
    next(error);
  }
};
