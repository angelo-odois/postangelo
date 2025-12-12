import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Page, PageStatus, User } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { UserRole } from "../entities/index.js";
import { cache } from "../services/redis.js";
import { canCreatePortfolio, getPlanLimits } from "../config/plans.js";

const router: ReturnType<typeof Router> = Router();
const pageRepository = () => AppDataSource.getRepository(Page);

/**
 * @swagger
 * /api/pages:
 *   get:
 *     summary: Get all published pages
 *     tags: [Pages]
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { status } = req.query;

    const cacheKey = `pages:list:${status || "published"}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const pages = await pageRepository().find({
      where: { status: (status as PageStatus) || PageStatus.PUBLISHED },
      select: ["id", "title", "slug", "seoTitle", "seoDescription", "ogImageUrl", "coverImageUrl", "status", "createdAt", "updatedAt"],
      order: { createdAt: "DESC" },
    });

    await cache.set(cacheKey, pages, 300);
    res.json(pages);
  })
);

/**
 * @swagger
 * /api/pages/by-id/{id}:
 *   get:
 *     summary: Get page by ID (admin only, includes contentJSON)
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/by-id/:id",
  authenticate,
  requireRole(UserRole.ADMIN, UserRole.EDITOR),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const page = await pageRepository().findOne({
      where: { id },
      relations: ["createdBy"],
    });

    if (!page) {
      throw new AppError("Page not found", 404);
    }

    const response = {
      ...page,
      createdBy: page.createdBy
        ? { id: page.createdBy.id, name: page.createdBy.name }
        : null,
    };

    res.json(response);
  })
);

/**
 * @swagger
 * /api/pages/my:
 *   get:
 *     summary: Get current user's pages (authenticated)
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/my",
  authenticate,
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { status } = req.query;

    const whereCondition: Record<string, unknown> = {
      createdBy: { id: userId },
    };

    if (status) {
      whereCondition.status = status as PageStatus;
    }

    const pages = await pageRepository().find({
      where: whereCondition,
      select: ["id", "title", "slug", "seoTitle", "seoDescription", "ogImageUrl", "coverImageUrl", "status", "createdAt", "updatedAt"],
      order: { createdAt: "DESC" },
    });

    res.json(pages);
  })
);

/**
 * @swagger
 * /api/pages/{slug}:
 *   get:
 *     summary: Get page by slug (public)
 *     tags: [Pages]
 */
router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const cacheKey = `page:${slug}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const page = await pageRepository().findOne({
      where: { slug, status: PageStatus.PUBLISHED },
      relations: ["createdBy"],
    });

    if (!page) {
      throw new AppError("Page not found", 404);
    }

    const response = {
      ...page,
      createdBy: page.createdBy
        ? { id: page.createdBy.id, name: page.createdBy.name, username: page.createdBy.username }
        : null,
    };

    await cache.set(cacheKey, response, 300);
    res.json(response);
  })
);

// Admin routes - all routes below require authentication
router.use(authenticate, requireRole(UserRole.ADMIN, UserRole.EDITOR));

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Create a new page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title, slug, seoTitle, seoDescription, ogImageUrl, coverImageUrl, contentJSON, status } = req.body;
    const userId = req.user!.userId;

    if (!title || !slug) {
      throw new AppError("Title and slug are required", 400);
    }

    // Check plan limits for page creation
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const currentPageCount = await pageRepository().count({
      where: { createdBy: { id: userId } },
    });

    if (!canCreatePortfolio(user.plan, currentPageCount)) {
      const limits = getPlanLimits(user.plan);
      throw new AppError(
        `Você atingiu o limite de ${limits.maxPortfolios} página(s) do plano ${user.plan}. Faça upgrade para criar mais páginas.`,
        403
      );
    }

    const existing = await pageRepository().findOne({ where: { slug } });
    if (existing) {
      throw new AppError("A page with this slug already exists", 409);
    }

    const page = pageRepository().create({
      title,
      slug,
      seoTitle,
      seoDescription,
      ogImageUrl,
      coverImageUrl,
      contentJSON: contentJSON || { blocks: [] },
      status: status || PageStatus.DRAFT,
      createdBy: { id: req.user!.userId },
    });

    await pageRepository().save(page);
    await cache.invalidatePattern("pages:*");
    await cache.invalidatePattern("portfolio:*");

    res.status(201).json(page);
  })
);

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     summary: Update a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, slug, seoTitle, seoDescription, ogImageUrl, coverImageUrl, contentJSON, status } = req.body;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const page = await pageRepository().findOne({
      where: { id },
      relations: ["createdBy"],
    });

    if (!page) {
      throw new AppError("Page not found", 404);
    }

    // Check ownership (admins can edit any page)
    if (userRole !== UserRole.ADMIN && page.createdBy?.id !== userId) {
      throw new AppError("You don't have permission to edit this page", 403);
    }

    if (slug && slug !== page.slug) {
      const existing = await pageRepository().findOne({ where: { slug } });
      if (existing) {
        throw new AppError("A page with this slug already exists", 409);
      }
    }

    Object.assign(page, {
      title: title ?? page.title,
      slug: slug ?? page.slug,
      seoTitle: seoTitle ?? page.seoTitle,
      seoDescription: seoDescription ?? page.seoDescription,
      ogImageUrl: ogImageUrl ?? page.ogImageUrl,
      coverImageUrl: coverImageUrl ?? page.coverImageUrl,
      contentJSON: contentJSON ?? page.contentJSON,
      status: status ?? page.status,
    });

    await pageRepository().save(page);
    await cache.del(`page:${page.slug}`);
    await cache.invalidatePattern("pages:*");
    await cache.invalidatePattern("portfolio:*");

    res.json(page);
  })
);

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     summary: Delete a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const page = await pageRepository().findOne({
      where: { id },
      relations: ["createdBy"],
    });

    if (!page) {
      throw new AppError("Page not found", 404);
    }

    // Check ownership (admins can delete any page)
    if (userRole !== UserRole.ADMIN && page.createdBy?.id !== userId) {
      throw new AppError("You don't have permission to delete this page", 403);
    }

    await cache.del(`page:${page.slug}`);
    await pageRepository().remove(page);
    await cache.invalidatePattern("pages:*");
    await cache.invalidatePattern("portfolio:*");

    res.json({ message: "Page deleted successfully" });
  })
);

export default router;
