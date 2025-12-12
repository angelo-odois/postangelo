import { Request, Response, NextFunction } from "express";
import { authService, TokenPayload } from "../services/auth.js";
import { UserRole } from "../entities/index.js";
import { Errors } from "./errorHandler.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      requestId?: string;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    const error = Errors.tokenMissing();
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  const token = authHeader.slice(7);
  const payload = authService.verifyAccessToken(token);

  if (!payload) {
    const error = Errors.tokenInvalid();
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  req.user = payload;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const error = Errors.tokenMissing();
      res.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      const error = Errors.adminRequired();
      res.status(error.statusCode).json({
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    next();
  };
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = authService.verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}

export const requireAdmin = requireRole(UserRole.ADMIN);
