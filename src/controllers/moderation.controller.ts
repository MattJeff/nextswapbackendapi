import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/AppError';

interface RequestWithUser extends Request {
  user?: { id: string };
}

import { Pool } from 'pg';
const pool = new Pool();

// Signalement d'utilisateur
export const reportUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { reportedUserId, reason } = req.body;
    const reporterId = req.user?.id || req.body.reporterId;
    if (!reporterId || !reportedUserId || !reason) throw new ApiError(400, 'reporterId, reportedUserId and reason required');
    await pool.query(
      'INSERT INTO moderation_reports (reporter_id, reported_user_id, reason) VALUES ($1, $2, $3)',
      [reporterId, reportedUserId, reason]
    );
    res.status(201).json({ message: 'User reported' });
  } catch (error) {
    next(error);
  }
};

// Logs d'activité (à compléter avec une vraie base/logs)
export const logActivity = async (userId: string, action: string, meta: any = {}) => {
  // TODO: enregistrer dans la base/logs
  console.log(`[ACTIVITY] ${userId} - ${action}`, meta);
};
