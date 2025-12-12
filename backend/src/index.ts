import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler, requestIdMiddleware } from "./middlewares/errorHandler.js";
import { swaggerSpec } from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.resolve(__dirname, "..", "uploads");

// Trust proxy for rate limiting behind reverse proxy (Coolify/Traefik)
app.set("trust proxy", 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
const allowedOrigins = [
  "http://localhost:3000",
  "https://revuu.com.br",
  "https://www.revuu.com.br",
  "https://angelo.odois.com.br",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Request ID middleware for error tracking
app.use(requestIdMiddleware);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files for uploads
app.use("/uploads", express.static(UPLOADS_PATH));

// Swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API docs available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
