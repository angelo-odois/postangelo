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
import analyticsRoutes from "./analytics.js";
import adminRoutes from "./admin.js";
import subscriptionRoutes from "./subscription.js";

const router: ReturnType<typeof Router> = Router();

router.use("/auth", authRoutes);
router.use("/pages", pagesRoutes);
router.use("/admin/uploads", uploadsRoutes);
router.use("/admin/block-templates", blockTemplatesRoutes);
router.use("/admin", adminRoutes);

// Portfolio routes
router.use("/profile", profileRoutes);
router.use("/experiences", experiencesRoutes);
router.use("/education", educationRoutes);
router.use("/skills", skillsRoutes);
router.use("/projects", projectsRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/page-templates", pageTemplatesRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/subscription", subscriptionRoutes);

export default router;
