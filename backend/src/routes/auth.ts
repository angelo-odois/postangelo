import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { User } from "../entities/index.js";
import { authService } from "../services/auth.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router: ReturnType<typeof Router> = Router();
const userRepository = () => AppDataSource.getRepository(User);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await userRepository().findOne({ where: { email } });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await authService.verifyPassword(password, user.passwordHash);

    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const tokens = await authService.generateTokens(user);

    res.json({
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const { refreshToken, userId } = req.body;

    if (!refreshToken || !userId) {
      throw new AppError("Refresh token and userId are required", 400);
    }

    const isValid = await authService.verifyRefreshToken(userId, refreshToken);

    if (!isValid) {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await userRepository().findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Revoke old token and generate new ones
    await authService.revokeRefreshToken(userId, refreshToken);
    const tokens = await authService.generateTokens(user);

    res.json(tokens);
  })
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post(
  "/logout",
  authenticate,
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken && req.user) {
      await authService.revokeRefreshToken(req.user.userId, refreshToken);
    }

    res.json({ message: "Logged out successfully" });
  })
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 */
router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userRepository().findOne({
      where: { id: req.user!.userId },
      select: ["id", "name", "email", "role", "createdAt"],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  })
);

export default router;
