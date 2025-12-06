import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { BlockTemplate } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { UserRole } from "../entities/index.js";

const router: ReturnType<typeof Router> = Router();
const blockTemplateRepository = () => AppDataSource.getRepository(BlockTemplate);

/**
 * @swagger
 * /api/admin/block-templates:
 *   get:
 *     summary: Get all block templates
 *     tags: [BlockTemplates]
 */
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const templates = await blockTemplateRepository().find({
      order: { category: "ASC", name: "ASC" },
    });
    res.json(templates);
  })
);

/**
 * @swagger
 * /api/admin/block-templates/{id}:
 *   get:
 *     summary: Get block template by ID
 *     tags: [BlockTemplates]
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const template = await blockTemplateRepository().findOne({ where: { id } });

    if (!template) {
      throw new AppError("Block template not found", 404);
    }

    res.json(template);
  })
);

// Admin-only routes
router.use(authenticate, requireRole(UserRole.ADMIN));

/**
 * @swagger
 * /api/admin/block-templates:
 *   post:
 *     summary: Create a new block template
 *     tags: [BlockTemplates]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, category, schemaJSON, previewDataJSON } = req.body;

    if (!name || !category || !schemaJSON) {
      throw new AppError("Name, category, and schemaJSON are required", 400);
    }

    const template = blockTemplateRepository().create({
      name,
      category,
      schemaJSON,
      previewDataJSON,
    });

    await blockTemplateRepository().save(template);

    res.status(201).json(template);
  })
);

/**
 * @swagger
 * /api/admin/block-templates/{id}:
 *   put:
 *     summary: Update a block template
 *     tags: [BlockTemplates]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category, schemaJSON, previewDataJSON } = req.body;

    const template = await blockTemplateRepository().findOne({ where: { id } });

    if (!template) {
      throw new AppError("Block template not found", 404);
    }

    Object.assign(template, {
      name: name ?? template.name,
      category: category ?? template.category,
      schemaJSON: schemaJSON ?? template.schemaJSON,
      previewDataJSON: previewDataJSON ?? template.previewDataJSON,
    });

    await blockTemplateRepository().save(template);

    res.json(template);
  })
);

/**
 * @swagger
 * /api/admin/block-templates/{id}:
 *   delete:
 *     summary: Delete a block template
 *     tags: [BlockTemplates]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const template = await blockTemplateRepository().findOne({ where: { id } });

    if (!template) {
      throw new AppError("Block template not found", 404);
    }

    await blockTemplateRepository().remove(template);

    res.json({ message: "Block template deleted successfully" });
  })
);

export default router;
