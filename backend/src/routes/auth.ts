import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { User } from "../entities/index.js";
import { authService } from "../services/auth.js";
import { asyncHandler, Errors } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";
import { ErrorCodes } from "../errors/codes.js";

const router: ReturnType<typeof Router> = Router();
const userRepository = () => AppDataSource.getRepository(User);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (_req, res) => {
    const error = ErrorCodes.SYSTEM_RATE_LIMITED;
    res.status(error.status).json({
      error: {
        code: error.code,
        message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
        timestamp: new Date().toISOString(),
      },
    });
  },
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      throw Errors.requiredField("nome, email, senha e username");
    }

    if (password.length < 6) {
      throw Errors.stringTooLong("senha", 6);
    }

    // Validate username format (alphanumeric and hyphens only)
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      throw Errors.invalidFormat("username", "apenas letras, numeros e hifens");
    }

    if (username.length < 3 || username.length > 30) {
      throw Errors.invalidFormat("username", "entre 3 e 30 caracteres");
    }

    // Check if email already exists
    const existingEmail = await userRepository().findOne({ where: { email } });
    if (existingEmail) {
      throw Errors.emailTaken(email);
    }

    // Check if username already exists
    const existingUsername = await userRepository().findOne({ where: { username } });
    if (existingUsername) {
      throw Errors.usernameTaken(username);
    }

    // Create new user
    const passwordHash = await authService.hashPassword(password);
    const user = userRepository().create({
      name,
      email,
      username,
      passwordHash,
      onboardingCompleted: false,
    });

    await userRepository().save(user);

    const tokens = await authService.generateTokens(user);

    res.status(201).json({
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: user.onboardingCompleted,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  })
);

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
      throw Errors.requiredField("email e senha");
    }

    const user = await userRepository().findOne({ where: { email } });

    if (!user) {
      throw Errors.invalidCredentials();
    }

    const isValid = await authService.verifyPassword(password, user.passwordHash);

    if (!isValid) {
      throw Errors.invalidCredentials();
    }

    const tokens = await authService.generateTokens(user);

    res.json({
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: user.onboardingCompleted,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
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
      throw Errors.requiredField("refreshToken e userId");
    }

    const isValid = await authService.verifyRefreshToken(userId, refreshToken);

    if (!isValid) {
      throw Errors.tokenInvalid();
    }

    const user = await userRepository().findOne({ where: { id: userId } });

    if (!user) {
      throw Errors.userNotFound(userId);
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

    res.json({ message: "Logout realizado com sucesso" });
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
      select: ["id", "name", "email", "role", "username", "avatarUrl", "onboardingCompleted", "createdAt", "plan", "subscriptionStatus"],
    });

    if (!user) {
      throw Errors.userNotFound(req.user!.userId);
    }

    res.json(user);
  })
);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 */
router.post(
  "/change-password",
  authenticate,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw Errors.requiredField("senha atual e nova senha");
    }

    if (newPassword.length < 6) {
      throw Errors.invalidFormat("nova senha", "minimo 6 caracteres");
    }

    const user = await userRepository().findOne({
      where: { id: req.user!.userId },
    });

    if (!user) {
      throw Errors.userNotFound(req.user!.userId);
    }

    const isValid = await authService.verifyPassword(currentPassword, user.passwordHash);

    if (!isValid) {
      throw Errors.invalidCredentials({ reason: "senha atual incorreta" });
    }

    user.passwordHash = await authService.hashPassword(newPassword);
    await userRepository().save(user);

    res.json({ message: "Senha alterada com sucesso" });
  })
);

/**
 * @swagger
 * /api/auth/avatar:
 *   put:
 *     summary: Update user avatar
 *     tags: [Auth]
 */
router.put(
  "/avatar",
  authenticate,
  asyncHandler(async (req, res) => {
    const { avatarUrl } = req.body;

    const user = await userRepository().findOne({
      where: { id: req.user!.userId },
    });

    if (!user) {
      throw Errors.userNotFound(req.user!.userId);
    }

    user.avatarUrl = avatarUrl || null;
    await userRepository().save(user);

    res.json({ message: "Avatar atualizado", avatarUrl: user.avatarUrl });
  })
);

/**
 * @swagger
 * /api/auth/complete-onboarding:
 *   post:
 *     summary: Mark onboarding as completed
 *     tags: [Auth]
 */
router.post(
  "/complete-onboarding",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await userRepository().findOne({
      where: { id: req.user!.userId },
    });

    if (!user) {
      throw Errors.userNotFound(req.user!.userId);
    }

    user.onboardingCompleted = true;
    await userRepository().save(user);

    res.json({ message: "Onboarding concluido", onboardingCompleted: true });
  })
);

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Permanently delete user account and all associated data
 *     tags: [Auth]
 */
router.delete(
  "/delete-account",
  authenticate,
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    const userId = req.user!.userId;

    if (!password) {
      throw Errors.requiredField("senha");
    }

    const user = await userRepository().findOne({
      where: { id: userId },
    });

    if (!user) {
      throw Errors.userNotFound(userId);
    }

    // Verify password before deletion
    const isValid = await authService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw Errors.invalidCredentials({ reason: "senha incorreta" });
    }

    // Delete all user data (cascade should handle most, but let's be explicit)
    await AppDataSource.transaction(async (manager) => {
      // Delete profile
      await manager.query("DELETE FROM profiles WHERE user_id = $1", [userId]);
      // Delete experiences
      await manager.query("DELETE FROM experiences WHERE user_id = $1", [userId]);
      // Delete education
      await manager.query("DELETE FROM educations WHERE user_id = $1", [userId]);
      // Delete skills
      await manager.query("DELETE FROM skills WHERE user_id = $1", [userId]);
      // Delete projects
      await manager.query("DELETE FROM projects WHERE user_id = $1", [userId]);
      // Delete pages
      await manager.query("DELETE FROM pages WHERE created_by = $1", [userId]);
      // Delete assets
      await manager.query("DELETE FROM assets WHERE uploaded_by = $1", [userId]);
      // Finally delete the user
      await manager.query("DELETE FROM users WHERE id = $1", [userId]);
    });

    // Revoke all refresh tokens
    await authService.revokeAllRefreshTokens(userId);

    res.json({ message: "Conta excluida com sucesso" });
  })
);

export default router;
