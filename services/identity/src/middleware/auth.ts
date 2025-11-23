import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createErrorResponse } from '@the-wans/shared';
import type { JWTPayload } from '@the-wans/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'No token provided')
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(
      createErrorResponse('UNAUTHORIZED', 'Invalid or expired token')
    );
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(
        createErrorResponse('UNAUTHORIZED', 'Authentication required')
      );
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        createErrorResponse('FORBIDDEN', 'Insufficient permissions')
      );
    }

    next();
  };
};
