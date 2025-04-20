import { Request, Response, NextFunction } from 'express';
import {
  joinLiveMatchmaking,
  leaveLiveMatchmaking,
  nextLiveMatchmaking,
  getCurrentSession
} from '../services/live.service';

// L'utilisateur rejoint le matchmaking vidéo direct
export const joinMatchmaking = (req: any, res: Response, next: NextFunction) => {
  try {
    joinLiveMatchmaking(req.user.sub);
    // Essaie de matcher directement
    const match = nextLiveMatchmaking(req.user.sub);
    if (match) {
      const { getProfileSummary } = require('../../services/profile.service');
      getProfileSummary(match.partnerId).then((partnerProfile: any) => {
        res.json({ matched: true, partnerId: match.partnerId, sessionId: match.sessionId, partnerProfile });
      }).catch((err: any) => next(err));
    } else {
      res.status(200).json({ matched: false });
    }
  } catch (error) {
    next(error);
  }
};

// L'utilisateur passe à la personne suivante
export const nextMatchmaking = (req: any, res: Response, next: NextFunction) => {
  try {
    const match = nextLiveMatchmaking(req.user.sub);
    if (match) {
      const { getProfileSummary } = require('../../services/profile.service');
      getProfileSummary(match.partnerId).then((partnerProfile: any) => {
        res.json({ matched: true, partnerId: match.partnerId, sessionId: match.sessionId, partnerProfile });
      }).catch((err: any) => next(err));
    } else {
      res.status(200).json({ matched: false });
    }
  } catch (error) {
    next(error);
  }
};

// L'utilisateur quitte le matchmaking
export const leaveMatchmaking = (req: any, res: Response, next: NextFunction) => {
  try {
    leaveLiveMatchmaking(req.user.sub);
    res.json({ left: true });
  } catch (error) {
    next(error);
  }
};

// Récupérer la session courante (optionnel)
export const getCurrentMatchmakingSession = (req: any, res: Response, next: NextFunction) => {
  try {
    const session = getCurrentSession(req.user.sub);
    console.log('[LIVE][DEBUG] getCurrentMatchmakingSession:', session);
    if (!session) {
      return res.status(404).json({ error: 'No active session' });
    }
    res.json(session);
  } catch (error) {
    console.error('[LIVE][ERROR] getCurrentMatchmakingSession:', error);
    next(error);
  }
};
