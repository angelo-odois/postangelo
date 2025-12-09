import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { PageTemplate } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";
import { cache } from "../services/redis.js";

const router: ReturnType<typeof Router> = Router();
const pageTemplateRepository = () => AppDataSource.getRepository(PageTemplate);

/**
 * @swagger
 * /api/page-templates:
 *   get:
 *     summary: Get all active page templates (public)
 *     tags: [PageTemplates]
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const cacheKey = "page-templates:all";
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const templates = await pageTemplateRepository().find({
      where: { isActive: true },
      order: { order: "ASC", name: "ASC" },
    });

    await cache.set(cacheKey, templates, 3600); // Cache for 1 hour
    res.json(templates);
  })
);

/**
 * @swagger
 * /api/page-templates/{slug}:
 *   get:
 *     summary: Get a page template by slug (public)
 *     tags: [PageTemplates]
 */
router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const cacheKey = `page-template:${slug}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const template = await pageTemplateRepository().findOne({
      where: { slug, isActive: true },
    });

    if (!template) {
      throw new AppError("Template not found", 404);
    }

    await cache.set(cacheKey, template, 3600);
    res.json(template);
  })
);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * @swagger
 * /api/page-templates/admin/all:
 *   get:
 *     summary: Get all page templates (admin)
 *     tags: [PageTemplates]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/admin/all",
  asyncHandler(async (req, res) => {
    const templates = await pageTemplateRepository().find({
      order: { order: "ASC", name: "ASC" },
    });
    res.json(templates);
  })
);

/**
 * @swagger
 * /api/page-templates:
 *   post:
 *     summary: Create a new page template (admin)
 *     tags: [PageTemplates]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      slug,
      thumbnailUrl,
      category,
      contentJSON,
      defaultTitle,
      isPremium,
      order,
    } = req.body;

    if (!name || !slug) {
      throw new AppError("Name and slug are required", 400);
    }

    // Check if slug exists
    const existing = await pageTemplateRepository().findOne({ where: { slug } });
    if (existing) {
      throw new AppError("Template with this slug already exists", 400);
    }

    const template = pageTemplateRepository().create({
      name,
      description,
      slug,
      thumbnailUrl,
      category,
      contentJSON: contentJSON || { blocks: [] },
      defaultTitle,
      isPremium: isPremium ?? false,
      order: order ?? 0,
    });

    await pageTemplateRepository().save(template);
    await cache.invalidatePattern("page-templates:*");
    await cache.invalidatePattern("page-template:*");

    res.status(201).json(template);
  })
);

/**
 * @swagger
 * /api/page-templates/{id}:
 *   put:
 *     summary: Update a page template (admin)
 *     tags: [PageTemplates]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      name,
      description,
      slug,
      thumbnailUrl,
      category,
      contentJSON,
      defaultTitle,
      isPremium,
      order,
      isActive,
    } = req.body;

    const template = await pageTemplateRepository().findOne({ where: { id } });

    if (!template) {
      throw new AppError("Template not found", 404);
    }

    // Check slug uniqueness if changed
    if (slug && slug !== template.slug) {
      const existing = await pageTemplateRepository().findOne({ where: { slug } });
      if (existing) {
        throw new AppError("Template with this slug already exists", 400);
      }
    }

    Object.assign(template, {
      name: name ?? template.name,
      description: description ?? template.description,
      slug: slug ?? template.slug,
      thumbnailUrl: thumbnailUrl ?? template.thumbnailUrl,
      category: category ?? template.category,
      contentJSON: contentJSON ?? template.contentJSON,
      defaultTitle: defaultTitle ?? template.defaultTitle,
      isPremium: isPremium ?? template.isPremium,
      order: order ?? template.order,
      isActive: isActive ?? template.isActive,
    });

    await pageTemplateRepository().save(template);
    await cache.invalidatePattern("page-templates:*");
    await cache.invalidatePattern("page-template:*");

    res.json(template);
  })
);

/**
 * @swagger
 * /api/page-templates/{id}:
 *   delete:
 *     summary: Delete a page template (admin)
 *     tags: [PageTemplates]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const template = await pageTemplateRepository().findOne({ where: { id } });

    if (!template) {
      throw new AppError("Template not found", 404);
    }

    await pageTemplateRepository().remove(template);
    await cache.invalidatePattern("page-templates:*");
    await cache.invalidatePattern("page-template:*");

    res.json({ message: "Template deleted successfully" });
  })
);

export default router;
