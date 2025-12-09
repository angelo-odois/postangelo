import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Profile } from "../entities/index.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { UserRole } from "../entities/index.js";
import { cache } from "../services/redis.js";

const router: ReturnType<typeof Router> = Router();
const profileRepository = () => AppDataSource.getRepository(Profile);

/**
 * @swagger
 * /api/profile/{username}:
 *   get:
 *     summary: Get public profile by username
 *     tags: [Profile]
 */
router.get(
  "/by-username/:username",
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    const cacheKey = `profile:${username}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const profile = await profileRepository().findOne({
      where: { user: { username } },
      relations: ["user"],
    });

    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    const response = {
      ...profile,
      user: {
        id: profile.user.id,
        name: profile.user.name,
        username: profile.user.username,
      },
    };

    await cache.set(cacheKey, response, 300);
    res.json(response);
  })
);

// Protected routes - require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const profile = await profileRepository().findOne({
      where: { userId },
    });

    res.json(profile || null);
  })
);

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create or update current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const {
      fullName,
      title,
      bio,
      location,
      avatarUrl,
      coverImageUrl,
      linkedinUrl,
      githubUrl,
      twitterUrl,
      websiteUrl,
      dribbbleUrl,
      behanceUrl,
      instagramUrl,
      youtubeUrl,
      contactEmail,
      phone,
      isAvailableForWork,
      availabilityStatus,
    } = req.body;

    let profile = await profileRepository().findOne({ where: { userId } });

    if (profile) {
      Object.assign(profile, {
        fullName: fullName ?? profile.fullName,
        title: title ?? profile.title,
        bio: bio ?? profile.bio,
        location: location ?? profile.location,
        avatarUrl: avatarUrl ?? profile.avatarUrl,
        coverImageUrl: coverImageUrl ?? profile.coverImageUrl,
        linkedinUrl: linkedinUrl ?? profile.linkedinUrl,
        githubUrl: githubUrl ?? profile.githubUrl,
        twitterUrl: twitterUrl ?? profile.twitterUrl,
        websiteUrl: websiteUrl ?? profile.websiteUrl,
        dribbbleUrl: dribbbleUrl ?? profile.dribbbleUrl,
        behanceUrl: behanceUrl ?? profile.behanceUrl,
        instagramUrl: instagramUrl ?? profile.instagramUrl,
        youtubeUrl: youtubeUrl ?? profile.youtubeUrl,
        contactEmail: contactEmail ?? profile.contactEmail,
        phone: phone ?? profile.phone,
        isAvailableForWork: isAvailableForWork ?? profile.isAvailableForWork,
        availabilityStatus: availabilityStatus ?? profile.availabilityStatus,
      });
    } else {
      if (!fullName) {
        throw new AppError("Full name is required", 400);
      }

      profile = profileRepository().create({
        userId,
        fullName,
        title,
        bio,
        location,
        avatarUrl,
        coverImageUrl,
        linkedinUrl,
        githubUrl,
        twitterUrl,
        websiteUrl,
        dribbbleUrl,
        behanceUrl,
        instagramUrl,
        youtubeUrl,
        contactEmail,
        phone,
        isAvailableForWork: isAvailableForWork ?? true,
        availabilityStatus,
      });
    }

    await profileRepository().save(profile);
    await cache.invalidatePattern("profile:*");

    res.json(profile);
  })
);

/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Delete current user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const profile = await profileRepository().findOne({ where: { userId } });

    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    await profileRepository().remove(profile);
    await cache.invalidatePattern("profile:*");

    res.json({ message: "Profile deleted successfully" });
  })
);

export default router;
