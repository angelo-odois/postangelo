import { Router } from "express";
import crypto from "crypto";
import { AppDataSource } from "../data-source.js";
import { User, PageView, ViewType, Page } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate } from "../middlewares/auth.js";
import { Between, MoreThanOrEqual } from "typeorm";

const router: ReturnType<typeof Router> = Router();
const userRepository = () => AppDataSource.getRepository(User);
const pageViewRepository = () => AppDataSource.getRepository(PageView);
const pageRepository = () => AppDataSource.getRepository(Page);

// Helper to hash IP address for privacy
function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "analytics-salt").digest("hex").slice(0, 16);
}

// Helper to detect device type from user agent
function detectDevice(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet/i.test(userAgent)) return "tablet";
  return "desktop";
}

// Helper to detect browser from user agent
function detectBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent)) return "Chrome";
  if (/firefox/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  if (/edge/i.test(userAgent)) return "Edge";
  if (/opera/i.test(userAgent)) return "Opera";
  return "Other";
}

// ============================================
// PUBLIC ROUTES - Track Views
// ============================================

/**
 * @swagger
 * /api/analytics/track:
 *   post:
 *     summary: Track a page view
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *               pageSlug:
 *                 type: string
 *               referrer:
 *                 type: string
 *     responses:
 *       200:
 *         description: View tracked successfully
 */
router.post(
  "/track",
  asyncHandler(async (req, res) => {
    const { username, pageSlug, referrer } = req.body;

    if (!username) {
      throw new AppError("Username is required", 400);
    }

    // Find the user
    const user = await userRepository().findOne({ where: { username } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get client info
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const ipHash = hashIp(String(ip));

    // Rate limiting: Don't count multiple views from same IP within 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentView = await pageViewRepository().findOne({
      where: {
        userId: user.id,
        ipHash,
        createdAt: MoreThanOrEqual(thirtyMinutesAgo),
      },
    });

    if (recentView) {
      res.json({ tracked: false, reason: "recent_view" });
      return;
    }

    // Create page view
    const pageView = pageViewRepository().create({
      userId: user.id,
      viewType: pageSlug ? ViewType.PAGE : ViewType.PORTFOLIO,
      referrer: referrer?.slice(0, 500),
      userAgent: userAgent.slice(0, 500),
      device: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      ipHash,
    });

    // If tracking a specific page
    if (pageSlug) {
      const page = await pageRepository().findOne({
        where: { slug: pageSlug, createdBy: { id: user.id } },
      });
      if (page) {
        pageView.pageId = page.id;
      }
    }

    await pageViewRepository().save(pageView);
    res.json({ tracked: true });
  })
);

// ============================================
// PROTECTED ROUTES - View Analytics
// ============================================
router.use(authenticate);

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get analytics overview for current user
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d, all]
 *         description: Time period
 *     responses:
 *       200:
 *         description: Analytics overview
 */
router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const period = (req.query.period as string) || "30d";

    let startDate: Date;
    const now = new Date();

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    // Get total views
    const totalViews = await pageViewRepository().count({
      where: {
        userId,
        createdAt: MoreThanOrEqual(startDate),
      },
    });

    // Get portfolio views
    const portfolioViews = await pageViewRepository().count({
      where: {
        userId,
        viewType: ViewType.PORTFOLIO,
        createdAt: MoreThanOrEqual(startDate),
      },
    });

    // Get page views
    const pageViews = await pageViewRepository().count({
      where: {
        userId,
        viewType: ViewType.PAGE,
        createdAt: MoreThanOrEqual(startDate),
      },
    });

    // Get unique visitors (by ipHash)
    const uniqueVisitors = await pageViewRepository()
      .createQueryBuilder("pv")
      .select("COUNT(DISTINCT pv.ip_hash)", "count")
      .where("pv.user_id = :userId", { userId })
      .andWhere("pv.created_at >= :startDate", { startDate })
      .getRawOne();

    // Get views by device
    const deviceStats = await pageViewRepository()
      .createQueryBuilder("pv")
      .select("pv.device", "device")
      .addSelect("COUNT(*)", "count")
      .where("pv.user_id = :userId", { userId })
      .andWhere("pv.created_at >= :startDate", { startDate })
      .groupBy("pv.device")
      .getRawMany();

    // Get views by browser
    const browserStats = await pageViewRepository()
      .createQueryBuilder("pv")
      .select("pv.browser", "browser")
      .addSelect("COUNT(*)", "count")
      .where("pv.user_id = :userId", { userId })
      .andWhere("pv.created_at >= :startDate", { startDate })
      .groupBy("pv.browser")
      .getRawMany();

    // Get top referrers
    const topReferrers = await pageViewRepository()
      .createQueryBuilder("pv")
      .select("pv.referrer", "referrer")
      .addSelect("COUNT(*)", "count")
      .where("pv.user_id = :userId", { userId })
      .andWhere("pv.created_at >= :startDate", { startDate })
      .andWhere("pv.referrer IS NOT NULL")
      .andWhere("pv.referrer != ''")
      .groupBy("pv.referrer")
      .orderBy("count", "DESC")
      .limit(10)
      .getRawMany();

    res.json({
      period,
      totalViews,
      portfolioViews,
      pageViews,
      uniqueVisitors: parseInt(uniqueVisitors?.count || "0"),
      byDevice: deviceStats,
      byBrowser: browserStats,
      topReferrers,
    });
  })
);

/**
 * @swagger
 * /api/analytics/chart:
 *   get:
 *     summary: Get views chart data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *     responses:
 *       200:
 *         description: Chart data
 */
router.get(
  "/chart",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const period = (req.query.period as string) || "30d";

    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get daily views
    const dailyViews = await pageViewRepository()
      .createQueryBuilder("pv")
      .select("DATE(pv.created_at)", "date")
      .addSelect("COUNT(*)", "views")
      .where("pv.user_id = :userId", { userId })
      .andWhere("pv.created_at >= :startDate", { startDate })
      .groupBy("DATE(pv.created_at)")
      .orderBy("date", "ASC")
      .getRawMany();

    // Fill in missing days with 0 views
    const chartData: { date: string; views: number }[] = [];
    const viewsMap = new Map(dailyViews.map((v) => [v.date, parseInt(v.views)]));

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      chartData.push({
        date: dateStr,
        views: viewsMap.get(dateStr) || 0,
      });
    }

    res.json({ chartData });
  })
);

/**
 * @swagger
 * /api/analytics/pages:
 *   get:
 *     summary: Get views per page
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Page view statistics
 */
router.get(
  "/pages",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const period = (req.query.period as string) || "30d";

    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get views per page
    const pageStats = await pageViewRepository()
      .createQueryBuilder("pv")
      .leftJoin("pv.page", "page")
      .select("page.id", "pageId")
      .addSelect("page.title", "title")
      .addSelect("page.slug", "slug")
      .addSelect("COUNT(*)", "views")
      .where("pv.user_id = :userId", { userId })
      .andWhere("pv.created_at >= :startDate", { startDate })
      .andWhere("pv.page_id IS NOT NULL")
      .groupBy("page.id")
      .addGroupBy("page.title")
      .addGroupBy("page.slug")
      .orderBy("views", "DESC")
      .getRawMany();

    res.json({ pages: pageStats });
  })
);

export default router;
