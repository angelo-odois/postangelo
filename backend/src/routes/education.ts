import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Education } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import { cache } from "../services/redis.js";

const router: ReturnType<typeof Router> = Router();
const educationRepository = () => AppDataSource.getRepository(Education);

/**
 * @swagger
 * /api/education/by-username/{username}:
 *   get:
 *     summary: Get education by username (public)
 *     tags: [Education]
 */
router.get(
  "/by-username/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    const cacheKey = `education:${username}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const educations = await educationRepository().find({
      where: { user: { username } },
      order: { order: "ASC", startDate: "DESC" },
    });

    await cache.set(cacheKey, educations, 300);
    res.json(educations);
  })
);

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /api/education:
 *   get:
 *     summary: Get current user's education
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const educations = await educationRepository().find({
      where: { userId },
      order: { order: "ASC", startDate: "DESC" },
    });

    res.json(educations);
  })
);

/**
 * @swagger
 * /api/education:
 *   post:
 *     summary: Create a new education entry
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const {
      institution,
      degree,
      field,
      description,
      startDate,
      endDate,
      isCurrent,
      institutionLogoUrl,
      institutionUrl,
      grade,
      order,
    } = req.body;

    if (!institution || !degree || !startDate) {
      throw new AppError("Institution, degree, and start date are required", 400);
    }

    const education = educationRepository().create({
      userId,
      institution,
      degree,
      field,
      description,
      startDate,
      endDate: isCurrent ? null : endDate,
      isCurrent: isCurrent ?? false,
      institutionLogoUrl,
      institutionUrl,
      grade,
      order: order ?? 0,
    });

    await educationRepository().save(education);
    await cache.invalidatePattern("education:*");

    res.status(201).json(education);
  })
);

/**
 * @swagger
 * /api/education/reorder:
 *   put:
 *     summary: Reorder education entries
 *     tags: [Education]
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
      await educationRepository().update(
        { id: item.id, userId },
        { order: item.order }
      );
    }

    await cache.invalidatePattern("education:*");

    res.json({ message: "Education entries reordered successfully" });
  })
);

/**
 * @swagger
 * /api/education/{id}:
 *   put:
 *     summary: Update an education entry
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const {
      institution,
      degree,
      field,
      description,
      startDate,
      endDate,
      isCurrent,
      institutionLogoUrl,
      institutionUrl,
      grade,
      order,
    } = req.body;

    const education = await educationRepository().findOne({
      where: { id, userId },
    });

    if (!education) {
      throw new AppError("Education entry not found", 404);
    }

    Object.assign(education, {
      institution: institution ?? education.institution,
      degree: degree ?? education.degree,
      field: field ?? education.field,
      description: description ?? education.description,
      startDate: startDate ?? education.startDate,
      endDate: isCurrent ? null : (endDate ?? education.endDate),
      isCurrent: isCurrent ?? education.isCurrent,
      institutionLogoUrl: institutionLogoUrl ?? education.institutionLogoUrl,
      institutionUrl: institutionUrl ?? education.institutionUrl,
      grade: grade ?? education.grade,
      order: order ?? education.order,
    });

    await educationRepository().save(education);
    await cache.invalidatePattern("education:*");

    res.json(education);
  })
);

/**
 * @swagger
 * /api/education/{id}:
 *   delete:
 *     summary: Delete an education entry
 *     tags: [Education]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const education = await educationRepository().findOne({
      where: { id, userId },
    });

    if (!education) {
      throw new AppError("Education entry not found", 404);
    }

    await educationRepository().remove(education);
    await cache.invalidatePattern("education:*");

    res.json({ message: "Education entry deleted successfully" });
  })
);

export default router;
