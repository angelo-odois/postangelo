import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, UserRole } from "../entities/index.js";
import { refreshTokenStore } from "./redis.js";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function parseExpiresIn(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 3600;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      return 3600;
  }
}

// Bcrypt cost factor: 10 is a good balance between security and performance
// Cost 10 = ~100ms, Cost 12 = ~400ms on typical server
const BCRYPT_COST = 10;

export const authService = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_COST);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  },

  async generateTokens(user: User): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = uuidv4();

    const expiresInSeconds = parseExpiresIn(JWT_REFRESH_EXPIRES_IN);
    await refreshTokenStore.set(user.id, refreshToken, expiresInSeconds);

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  },

  async verifyRefreshToken(userId: string, token: string): Promise<boolean> {
    return refreshTokenStore.isValid(userId, token);
  },

  async revokeRefreshToken(userId: string, token: string): Promise<void> {
    await refreshTokenStore.revoke(userId, token);
  },

  async revokeAllRefreshTokens(userId: string): Promise<void> {
    await refreshTokenStore.revokeAll(userId);
  },
};
