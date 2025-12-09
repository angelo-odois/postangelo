import { Request, Response, NextFunction } from "express";
import { authService, TokenPayload } from "../services/auth.js";
import { UserRole } from "../entities/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.slice(7);
  const payload = authService.verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }

  req.user = payload;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: Insufficient permissions" });
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
