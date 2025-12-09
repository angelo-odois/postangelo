import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { User, Profile, Experience, Education, Skill, Project, Page, PageStatus } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate, optionalAuth } from "../middlewares/auth.js";
import { cache } from "../services/redis.js";

const router: ReturnType<typeof Router> = Router();
const userRepository = () => AppDataSource.getRepository(User);
const profileRepository = () => AppDataSource.getRepository(Profile);
const experienceRepository = () => AppDataSource.getRepository(Experience);
const educationRepository = () => AppDataSource.getRepository(Education);
const skillRepository = () => AppDataSource.getRepository(Skill);
const projectRepository = () => AppDataSource.getRepository(Project);
const pageRepository = () => AppDataSource.getRepository(Page);

// Helper function to build portfolio response
async function buildPortfolioResponse(userId: string, user: User, includeAllPages = false) {
  const [profile, experiences, educations, skills, projects, pages] = await Promise.all([
    profileRepository().findOne({ where: { userId } }),
    experienceRepository().find({
      where: { userId },
      order: { order: "ASC", startDate: "DESC" },
    }),
    educationRepository().find({
      where: { userId },
      order: { order: "ASC", startDate: "DESC" },
    }),
    skillRepository().find({
      where: { userId },
      order: { order: "ASC", category: "ASC" },
    }),
    projectRepository().find({
      where: { userId },
      order: { order: "ASC", isFeatured: "DESC", createdAt: "DESC" },
    }),
    pageRepository().find({
      where: includeAllPages
        ? { createdBy: { id: userId } }
        : { createdBy: { id: userId }, status: PageStatus.PUBLISHED },
      order: { updatedAt: "DESC" },
      select: ["id", "title", "slug", "seoDescription", "coverImageUrl", "status", "createdAt", "updatedAt"],
    }),
  ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      memberSince: user.createdAt,
    },
    profile,
    experiences,
    educations,
    skills,
    projects,
    pages,
    stats: {
      experiencesCount: experiences.length,
      educationsCount: educations.length,
      skillsCount: skills.length,
      projectsCount: projects.length,
      pagesCount: pages.length,
      featuredProjectsCount: projects.filter(p => p.isFeatured).length,
    },
  };
}

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @swagger
 * /api/portfolio/check-username/{username}:
 *   get:
 *     summary: Check if username is available
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username to check
 *     responses:
 *       200:
 *         description: Availability status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                 reason:
 *                   type: string
 *                   enum: [invalid_format, taken]
 */
router.get(
  "/check-username/:username",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { username } = req.params;
    const userId = req.user?.userId;

    // Validate username format
    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      res.json({ available: false, reason: "invalid_format" });
      return;
    }

    // Check reserved usernames
    const reservedUsernames = ["admin", "api", "www", "mail", "support", "help", "root", "system"];
    if (reservedUsernames.includes(username.toLowerCase())) {
      res.json({ available: false, reason: "reserved" });
      return;
    }

    const existing = await userRepository().findOne({
      where: { username },
    });

    if (existing && existing.id !== userId) {
      res.json({ available: false, reason: "taken" });
      return;
    }

    res.json({ available: true });
  })
);

/**
 * @swagger
 * /api/portfolio/{username}:
 *   get:
 *     summary: Get complete portfolio by username (public)
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the portfolio owner
 *     responses:
 *       200:
 *         description: Complete portfolio data
 *       404:
 *         description: User not found
 */
router.get(
  "/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    // Avoid matching reserved routes
    if (["me", "check-username", "stats"].includes(username)) {
      throw new AppError("Invalid username", 400);
    }

    const cacheKey = `portfolio:${username}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const user = await userRepository().findOne({
      where: { username },
      select: ["id", "name", "username", "createdAt"],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const response = await buildPortfolioResponse(user.id, user, false);

    // Remove stats from public response (optional - can be kept if desired)
    const publicResponse = { ...response };

    await cache.set(cacheKey, publicResponse, 300);
    res.json(publicResponse);
  })
);

// ============================================
// PROTECTED ROUTES
// ============================================
router.use(authenticate);

/**
 * @swagger
 * /api/portfolio/me:
 *   get:
 *     summary: Get current user's portfolio (for preview, includes drafts)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete portfolio data including drafts
 */
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const user = await userRepository().findOne({
      where: { id: userId },
      select: ["id", "name", "email", "username", "createdAt"],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const response = await buildPortfolioResponse(userId, user, true);
    res.json(response);
  })
);

/**
 * @swagger
 * /api/portfolio/me/stats:
 *   get:
 *     summary: Get portfolio statistics for current user
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio statistics
 */
router.get(
  "/me/stats",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const [
      experiencesCount,
      educationsCount,
      skillsCount,
      projectsCount,
      publishedPagesCount,
      draftPagesCount,
    ] = await Promise.all([
      experienceRepository().count({ where: { userId } }),
      educationRepository().count({ where: { userId } }),
      skillRepository().count({ where: { userId } }),
      projectRepository().count({ where: { userId } }),
      pageRepository().count({ where: { createdBy: { id: userId }, status: PageStatus.PUBLISHED } }),
      pageRepository().count({ where: { createdBy: { id: userId }, status: PageStatus.DRAFT } }),
    ]);

    const profile = await profileRepository().findOne({ where: { userId } });

    // Calculate completion percentage
    const completionItems = [
      profile?.fullName ? 1 : 0,
      profile?.bio ? 1 : 0,
      profile?.avatarUrl ? 1 : 0,
      experiencesCount > 0 ? 1 : 0,
      educationsCount > 0 ? 1 : 0,
      skillsCount > 0 ? 1 : 0,
      projectsCount > 0 ? 1 : 0,
    ];
    const completionPercentage = Math.round((completionItems.reduce((a, b) => a + b, 0) / completionItems.length) * 100);

    res.json({
      experiences: experiencesCount,
      educations: educationsCount,
      skills: skillsCount,
      projects: projectsCount,
      pages: {
        published: publishedPagesCount,
        draft: draftPagesCount,
        total: publishedPagesCount + draftPagesCount,
      },
      profile: {
        hasAvatar: !!profile?.avatarUrl,
        hasBio: !!profile?.bio,
        hasFullName: !!profile?.fullName,
        isAvailableForWork: profile?.isAvailableForWork ?? false,
      },
      completionPercentage,
    });
  })
);

/**
 * @swagger
 * /api/portfolio/me/username:
 *   put:
 *     summary: Update current user's username
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-z0-9_-]+$'
 *     responses:
 *       200:
 *         description: Username updated successfully
 *       400:
 *         description: Invalid username format
 *       409:
 *         description: Username already taken
 */
router.put(
  "/me/username",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { username } = req.body;

    if (!username) {
      throw new AppError("Username is required", 400);
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      throw new AppError(
        "Username must be 3-30 characters long and can only contain lowercase letters, numbers, hyphens, and underscores",
        400
      );
    }

    // Check reserved usernames
    const reservedUsernames = ["admin", "api", "www", "mail", "support", "help", "root", "system", "me"];
    if (reservedUsernames.includes(username.toLowerCase())) {
      throw new AppError("This username is reserved", 400);
    }

    // Check if username is already taken
    const existing = await userRepository().findOne({
      where: { username },
    });

    if (existing && existing.id !== userId) {
      throw new AppError("Username is already taken", 409);
    }

    // Get old username for cache invalidation
    const user = await userRepository().findOne({ where: { id: userId } });
    const oldUsername = user?.username;

    await userRepository().update(userId, { username });

    // Invalidate both old and new portfolio caches
    if (oldUsername) {
      await cache.del(`portfolio:${oldUsername}`);
    }
    await cache.del(`portfolio:${username}`);
    await cache.invalidatePattern("portfolio:*");

    res.json({ message: "Username updated successfully", username });
  })
);

// Keep backward compatibility with old route
router.put(
  "/username",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { username } = req.body;

    if (!username) {
      throw new AppError("Username is required", 400);
    }

    const usernameRegex = /^[a-z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      throw new AppError(
        "Username must be 3-30 characters long and can only contain lowercase letters, numbers, hyphens, and underscores",
        400
      );
    }

    const reservedUsernames = ["admin", "api", "www", "mail", "support", "help", "root", "system", "me"];
    if (reservedUsernames.includes(username.toLowerCase())) {
      throw new AppError("This username is reserved", 400);
    }

    const existing = await userRepository().findOne({
      where: { username },
    });

    if (existing && existing.id !== userId) {
      throw new AppError("Username is already taken", 409);
    }

    const user = await userRepository().findOne({ where: { id: userId } });
    const oldUsername = user?.username;

    await userRepository().update(userId, { username });

    if (oldUsername) {
      await cache.del(`portfolio:${oldUsername}`);
    }
    await cache.del(`portfolio:${username}`);
    await cache.invalidatePattern("portfolio:*");

    res.json({ message: "Username updated successfully", username });
  })
);

export default router;
