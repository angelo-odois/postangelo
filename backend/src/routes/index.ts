import { Router } from "express";
import authRoutes from "./auth.js";
import pagesRoutes from "./pages.js";
import uploadsRoutes from "./uploads.js";
import blockTemplatesRoutes from "./blockTemplates.js";

const router: ReturnType<typeof Router> = Router();

router.use("/auth", authRoutes);
router.use("/pages", pagesRoutes);
router.use("/admin/uploads", uploadsRoutes);
router.use("/admin/block-templates", blockTemplatesRoutes);

export default router;
