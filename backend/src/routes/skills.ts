import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Skill } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import { cache } from "../services/redis.js";

const router: ReturnType<typeof Router> = Router();
const skillRepository = () => AppDataSource.getRepository(Skill);

/**
 * @swagger
 * /api/skills/by-username/{username}:
 *   get:
 *     summary: Get skills by username (public)
 *     tags: [Skills]
 */
router.get(
  "/by-username/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    const cacheKey = `skills:${username}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const skills = await skillRepository().find({
      where: { user: { username } },
      order: { order: "ASC", category: "ASC" },
    });

    await cache.set(cacheKey, skills, 300);
    res.json(skills);
  })
);

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get current user's skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const skills = await skillRepository().find({
      where: { userId },
      order: { order: "ASC", category: "ASC" },
    });

    res.json(skills);
  })
);

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const {
      name,
      category,
      level,
      yearsOfExperience,
      iconUrl,
      order,
    } = req.body;

    if (!name) {
      throw new AppError("Skill name is required", 400);
    }

    const skill = skillRepository().create({
      userId,
      name,
      category,
      level,
      yearsOfExperience,
      iconUrl,
      order: order ?? 0,
    });

    await skillRepository().save(skill);
    await cache.invalidatePattern("skills:*");

    res.status(201).json(skill);
  })
);

/**
 * @swagger
 * /api/skills/reorder:
 *   put:
 *     summary: Reorder skills
 *     tags: [Skills]
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
      await skillRepository().update(
        { id: item.id, userId },
        { order: item.order }
      );
    }

    await cache.invalidatePattern("skills:*");

    res.json({ message: "Skills reordered successfully" });
  })
);

/**
 * @swagger
 * /api/skills/bulk:
 *   post:
 *     summary: Create multiple skills at once
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/bulk",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      throw new AppError("Skills array is required", 400);
    }

    const createdSkills = [];

    for (let i = 0; i < skills.length; i++) {
      const skillData = skills[i];
      const skill = skillRepository().create({
        userId,
        name: skillData.name,
        category: skillData.category,
        level: skillData.level,
        yearsOfExperience: skillData.yearsOfExperience,
        iconUrl: skillData.iconUrl,
        order: skillData.order ?? i,
      });

      const saved = await skillRepository().save(skill);
      createdSkills.push(saved);
    }

    await cache.invalidatePattern("skills:*");

    res.status(201).json(createdSkills);
  })
);

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const {
      name,
      category,
      level,
      yearsOfExperience,
      iconUrl,
      order,
    } = req.body;

    const skill = await skillRepository().findOne({
      where: { id, userId },
    });

    if (!skill) {
      throw new AppError("Skill not found", 404);
    }

    Object.assign(skill, {
      name: name ?? skill.name,
      category: category ?? skill.category,
      level: level ?? skill.level,
      yearsOfExperience: yearsOfExperience ?? skill.yearsOfExperience,
      iconUrl: iconUrl ?? skill.iconUrl,
      order: order ?? skill.order,
    });

    await skillRepository().save(skill);
    await cache.invalidatePattern("skills:*");

    res.json(skill);
  })
);

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete a skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const skill = await skillRepository().findOne({
      where: { id, userId },
    });

    if (!skill) {
      throw new AppError("Skill not found", 404);
    }

    await skillRepository().remove(skill);
    await cache.invalidatePattern("skills:*");

    res.json({ message: "Skill deleted successfully" });
  })
);

export default router;
