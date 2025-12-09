import { Router } from "express";
import authRoutes from "./auth.js";
import pagesRoutes from "./pages.js";
import uploadsRoutes from "./uploads.js";
import blockTemplatesRoutes from "./blockTemplates.js";
import profileRoutes from "./profile.js";
import experiencesRoutes from "./experiences.js";
import educationRoutes from "./education.js";
import skillsRoutes from "./skills.js";
import projectsRoutes from "./projects.js";
import portfolioRoutes from "./portfolio.js";
import pageTemplatesRoutes from "./pageTemplates.js";

const router: ReturnType<typeof Router> = Router();

router.use("/auth", authRoutes);
router.use("/pages", pagesRoutes);
router.use("/admin/uploads", uploadsRoutes);
router.use("/admin/block-templates", blockTemplatesRoutes);

// Portfolio routes
router.use("/profile", profileRoutes);
router.use("/experiences", experiencesRoutes);
router.use("/education", educationRoutes);
router.use("/skills", skillsRoutes);
router.use("/projects", projectsRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/page-templates", pageTemplatesRoutes);

export default router;
