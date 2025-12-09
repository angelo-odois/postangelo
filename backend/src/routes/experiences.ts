import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Experience } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import { cache } from "../services/redis.js";

const router: ReturnType<typeof Router> = Router();
const experienceRepository = () => AppDataSource.getRepository(Experience);

/**
 * @swagger
 * /api/experiences/by-username/{username}:
 *   get:
 *     summary: Get experiences by username (public)
 *     tags: [Experiences]
 */
router.get(
  "/by-username/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    const cacheKey = `experiences:${username}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const experiences = await experienceRepository().find({
      where: { user: { username } },
      order: { order: "ASC", startDate: "DESC" },
    });

    await cache.set(cacheKey, experiences, 300);
    res.json(experiences);
  })
);

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /api/experiences:
 *   get:
 *     summary: Get current user's experiences
 *     tags: [Experiences]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const experiences = await experienceRepository().find({
      where: { userId },
      order: { order: "ASC", startDate: "DESC" },
    });

    res.json(experiences);
  })
);

/**
 * @swagger
 * /api/experiences:
 *   post:
 *     summary: Create a new experience
 *     tags: [Experiences]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const {
      company,
      position,
      location,
      employmentType,
      description,
      startDate,
      endDate,
      isCurrent,
      companyLogoUrl,
      companyUrl,
      technologies,
      order,
    } = req.body;

    if (!company || !position || !startDate) {
      throw new AppError("Company, position, and start date are required", 400);
    }

    const experience = experienceRepository().create({
      userId,
      company,
      position,
      location,
      employmentType,
      description,
      startDate,
      endDate: isCurrent ? null : endDate,
      isCurrent: isCurrent ?? false,
      companyLogoUrl,
      companyUrl,
      technologies,
      order: order ?? 0,
    });

    await experienceRepository().save(experience);
    await cache.invalidatePattern("experiences:*");
    await cache.invalidatePattern("portfolio:*");

    res.status(201).json(experience);
  })
);

/**
 * @swagger
 * /api/experiences/reorder:
 *   put:
 *     summary: Reorder experiences
 *     tags: [Experiences]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/reorder",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      throw new AppError("Items array is required", 400);
    }

    for (const item of items) {
      await experienceRepository().update(
        { id: item.id, userId },
        { order: item.order }
      );
    }

    await cache.invalidatePattern("experiences:*");
    await cache.invalidatePattern("portfolio:*");

    res.json({ message: "Experiences reordered successfully" });
  })
);

/**
 * @swagger
 * /api/experiences/{id}:
 *   put:
 *     summary: Update an experience
 *     tags: [Experiences]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const {
      company,
      position,
      location,
      employmentType,
      description,
      startDate,
      endDate,
      isCurrent,
      companyLogoUrl,
      companyUrl,
      technologies,
      order,
    } = req.body;

    const experience = await experienceRepository().findOne({
      where: { id, userId },
    });

    if (!experience) {
      throw new AppError("Experience not found", 404);
    }

    Object.assign(experience, {
      company: company ?? experience.company,
      position: position ?? experience.position,
      location: location ?? experience.location,
      employmentType: employmentType ?? experience.employmentType,
      description: description ?? experience.description,
      startDate: startDate ?? experience.startDate,
      endDate: isCurrent ? null : (endDate ?? experience.endDate),
      isCurrent: isCurrent ?? experience.isCurrent,
      companyLogoUrl: companyLogoUrl ?? experience.companyLogoUrl,
      companyUrl: companyUrl ?? experience.companyUrl,
      technologies: technologies ?? experience.technologies,
      order: order ?? experience.order,
    });

    await experienceRepository().save(experience);
    await cache.invalidatePattern("experiences:*");
    await cache.invalidatePattern("portfolio:*");

    res.json(experience);
  })
);

/**
 * @swagger
 * /api/experiences/{id}:
 *   delete:
 *     summary: Delete an experience
 *     tags: [Experiences]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const experience = await experienceRepository().findOne({
      where: { id, userId },
    });

    if (!experience) {
      throw new AppError("Experience not found", 404);
    }

    await experienceRepository().remove(experience);
    await cache.invalidatePattern("experiences:*");
    await cache.invalidatePattern("portfolio:*");

    res.json({ message: "Experience deleted successfully" });
  })
);

export default router;
