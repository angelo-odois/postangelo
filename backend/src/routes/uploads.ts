import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../data-source.js";
import { Asset } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { UserRole } from "../entities/index.js";
import rateLimit from "express-rate-limit";

const router: ReturnType<typeof Router> = Router();
const assetRepository = () => AppDataSource.getRepository(Asset);

const UPLOADS_PATH = process.env.UPLOADS_PATH || "/data/uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "application/pdf",
];

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many uploads, please try again later" },
});

// Ensure upload directory exists
async function ensureUploadDir(subPath: string): Promise<string> {
  const fullPath = path.join(UPLOADS_PATH, subPath);
  await fs.mkdir(fullPath, { recursive: true });
  return fullPath;
}

// Generate thumbnail for images
async function generateThumbnail(
  inputPath: string,
  outputPath: string
): Promise<void> {
  await sharp(inputPath)
    .resize(300, 300, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(outputPath);
}

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const date = new Date();
    const subPath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    try {
      const fullPath = await ensureUploadDir(subPath);
      cb(null, fullPath);
    } catch (error) {
      cb(error as Error, "");
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
      return;
    }
    cb(null, true);
  },
});

router.use(authenticate, requireRole(UserRole.ADMIN, UserRole.EDITOR));

/**
 * @swagger
 * /api/admin/uploads:
 *   post:
 *     summary: Upload a file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  uploadLimiter,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }

    const file = req.file;
    const relativePath = file.path.replace(UPLOADS_PATH, "");
    const url = `/uploads${relativePath}`;

    let thumbnailUrl: string | undefined;

    // Generate thumbnail for images
    if (file.mimetype.startsWith("image/") && !file.mimetype.includes("gif")) {
      const thumbFilename = `thumb_${file.filename}`;
      const thumbPath = path.join(path.dirname(file.path), thumbFilename);

      try {
        await generateThumbnail(file.path, thumbPath);
        thumbnailUrl = `/uploads${path.dirname(relativePath)}/${thumbFilename}`;
      } catch (error) {
        console.error("Thumbnail generation failed:", error);
      }
    }

    const asset = assetRepository().create({
      filename: file.originalname,
      url,
      mimeType: file.mimetype,
      size: file.size,
      thumbnailUrl,
      uploadedBy: { id: req.user!.userId },
    });

    await assetRepository().save(asset);

    res.status(201).json(asset);
  })
);

/**
 * @swagger
 * /api/admin/uploads:
 *   get:
 *     summary: List all assets
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page = "1", limit = "20", type } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const queryBuilder = assetRepository()
      .createQueryBuilder("asset")
      .leftJoinAndSelect("asset.uploadedBy", "user")
      .orderBy("asset.createdAt", "DESC")
      .skip((pageNum - 1) * limitNum)
      .take(limitNum);

    if (type) {
      queryBuilder.where("asset.mimeType LIKE :type", { type: `${type}%` });
    }

    const [assets, total] = await queryBuilder.getManyAndCount();

    res.json({
      data: assets.map((a) => ({
        ...a,
        uploadedBy: a.uploadedBy ? { id: a.uploadedBy.id, name: a.uploadedBy.name } : null,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  })
);

/**
 * @swagger
 * /api/admin/uploads/{id}:
 *   delete:
 *     summary: Delete an asset
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const asset = await assetRepository().findOne({ where: { id } });

    if (!asset) {
      throw new AppError("Asset not found", 404);
    }

    // Delete files
    const filePath = path.join(UPLOADS_PATH, asset.url.replace("/uploads", ""));
    try {
      await fs.unlink(filePath);
      if (asset.thumbnailUrl) {
        const thumbPath = path.join(UPLOADS_PATH, asset.thumbnailUrl.replace("/uploads", ""));
        await fs.unlink(thumbPath);
      }
    } catch (error) {
      console.error("File deletion failed:", error);
    }

    await assetRepository().remove(asset);

    res.json({ message: "Asset deleted successfully" });
  })
);

export default router;
