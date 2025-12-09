import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Project } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import { cache } from "../services/redis.js";

const router: ReturnType<typeof Router> = Router();
const projectRepository = () => AppDataSource.getRepository(Project);

/**
 * @swagger
 * /api/projects/by-username/{username}:
 *   get:
 *     summary: Get projects by username (public)
 *     tags: [Projects]
 */
router.get(
  "/by-username/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    const cacheKey = `projects:${username}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const projects = await projectRepository().find({
      where: { user: { username } },
      order: { order: "ASC", isFeatured: "DESC", createdAt: "DESC" },
    });

    await cache.set(cacheKey, projects, 300);
    res.json(projects);
  })
);

/**
 * @swagger
 * /api/projects/by-username/{username}/featured:
 *   get:
 *     summary: Get featured projects by username (public)
 *     tags: [Projects]
 */
router.get(
  "/by-username/:username/featured",
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    const cacheKey = `projects:${username}:featured`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const projects = await projectRepository().find({
      where: { user: { username }, isFeatured: true },
      order: { order: "ASC" },
    });

    await cache.set(cacheKey, projects, 300);
    res.json(projects);
  })
);

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get current user's projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const projects = await projectRepository().find({
      where: { userId },
      order: { order: "ASC", isFeatured: "DESC", createdAt: "DESC" },
    });

    res.json(projects);
  })
);

/**
 * @swagger
 * /api/projects/reorder:
 *   put:
 *     summary: Reorder projects
 *     tags: [Projects]
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
      await projectRepository().update(
        { id: item.id, userId },
        { order: item.order }
      );
    }

    await cache.invalidatePattern("projects:*");

    res.json({ message: "Projects reordered successfully" });
  })
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a single project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const project = await projectRepository().findOne({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    res.json(project);
  })
);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const {
      title,
      description,
      longDescription,
      thumbnailUrl,
      images,
      liveUrl,
      repositoryUrl,
      figmaUrl,
      technologies,
      tags,
      status,
      startDate,
      endDate,
      isFeatured,
      order,
    } = req.body;

    if (!title) {
      throw new AppError("Project title is required", 400);
    }

    const project = projectRepository().create({
      userId,
      title,
      description,
      longDescription,
      thumbnailUrl,
      images,
      liveUrl,
      repositoryUrl,
      figmaUrl,
      technologies,
      tags,
      status,
      startDate,
      endDate,
      isFeatured: isFeatured ?? false,
      order: order ?? 0,
    });

    await projectRepository().save(project);
    await cache.invalidatePattern("projects:*");

    res.status(201).json(project);
  })
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const {
      title,
      description,
      longDescription,
      thumbnailUrl,
      images,
      liveUrl,
      repositoryUrl,
      figmaUrl,
      technologies,
      tags,
      status,
      startDate,
      endDate,
      isFeatured,
      order,
    } = req.body;

    const project = await projectRepository().findOne({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    Object.assign(project, {
      title: title ?? project.title,
      description: description ?? project.description,
      longDescription: longDescription ?? project.longDescription,
      thumbnailUrl: thumbnailUrl ?? project.thumbnailUrl,
      images: images ?? project.images,
      liveUrl: liveUrl ?? project.liveUrl,
      repositoryUrl: repositoryUrl ?? project.repositoryUrl,
      figmaUrl: figmaUrl ?? project.figmaUrl,
      technologies: technologies ?? project.technologies,
      tags: tags ?? project.tags,
      status: status ?? project.status,
      startDate: startDate ?? project.startDate,
      endDate: endDate ?? project.endDate,
      isFeatured: isFeatured ?? project.isFeatured,
      order: order ?? project.order,
    });

    await projectRepository().save(project);
    await cache.invalidatePattern("projects:*");

    res.json(project);
  })
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    const project = await projectRepository().findOne({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    await projectRepository().remove(project);
    await cache.invalidatePattern("projects:*");

    res.json({ message: "Project deleted successfully" });
  })
);

export default router;
