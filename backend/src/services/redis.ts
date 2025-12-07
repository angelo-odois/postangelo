import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

// In-memory fallback store
const memoryStore = new Map<string, { value: string; expiresAt: number }>();

function cleanupExpired() {
  const now = Date.now();
  for (const [key, data] of memoryStore.entries()) {
    if (data.expiresAt < now) {
      memoryStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupExpired, 5 * 60 * 1000);

let redis: Redis | null = null;
let useMemory = !redisUrl;

if (redisUrl) {
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });

    redis.on("error", (error) => {
      console.error("Redis connection error, falling back to memory:", error.message);
      useMemory = true;
    });

    redis.on("connect", () => {
      console.log("Connected to Redis");
      useMemory = false;
    });

    // Try to connect
    redis.connect().catch((err) => {
      console.warn("Redis not available, using in-memory store:", err.message);
      useMemory = true;
    });
  } catch (err) {
    console.warn("Redis initialization failed, using in-memory store");
    useMemory = true;
  }
} else {
  console.log("REDIS_URL not set, using in-memory store");
}

// Cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (useMemory) {
      const data = memoryStore.get(key);
      if (!data || data.expiresAt < Date.now()) {
        memoryStore.delete(key);
        return null;
      }
      return JSON.parse(data.value) as T;
    }
    const data = await redis!.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  },

  async set(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    if (useMemory) {
      memoryStore.set(key, {
        value: JSON.stringify(value),
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return;
    }
    await redis!.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    if (useMemory) {
      memoryStore.delete(key);
      return;
    }
    await redis!.del(key);
  },

  async invalidatePattern(pattern: string): Promise<void> {
    if (useMemory) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      for (const key of memoryStore.keys()) {
        if (regex.test(key)) {
          memoryStore.delete(key);
        }
      }
      return;
    }
    const keys = await redis!.keys(pattern);
    if (keys.length > 0) {
      await redis!.del(...keys);
    }
  },
};

// Refresh token store
export const refreshTokenStore = {
  async set(userId: string, token: string, expiresInSeconds: number): Promise<void> {
    const key = `refresh:${userId}:${token}`;
    if (useMemory) {
      memoryStore.set(key, {
        value: "valid",
        expiresAt: Date.now() + expiresInSeconds * 1000,
      });
      return;
    }
    await redis!.setex(key, expiresInSeconds, "valid");
  },

  async isValid(userId: string, token: string): Promise<boolean> {
    const key = `refresh:${userId}:${token}`;
    if (useMemory) {
      const data = memoryStore.get(key);
      if (!data || data.expiresAt < Date.now()) {
        memoryStore.delete(key);
        return false;
      }
      return data.value === "valid";
    }
    const result = await redis!.get(key);
    return result === "valid";
  },

  async revoke(userId: string, token: string): Promise<void> {
    const key = `refresh:${userId}:${token}`;
    if (useMemory) {
      memoryStore.delete(key);
      return;
    }
    await redis!.del(key);
  },

  async revokeAll(userId: string): Promise<void> {
    const pattern = `refresh:${userId}:`;
    if (useMemory) {
      for (const key of memoryStore.keys()) {
        if (key.startsWith(pattern)) {
          memoryStore.delete(key);
        }
      }
      return;
    }
    const keys = await redis!.keys(`refresh:${userId}:*`);
    if (keys.length > 0) {
      await redis!.del(...keys);
    }
  },
};

export { redis };
