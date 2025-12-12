# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package files first (for caching)
COPY package.json ./

# Install ALL dependencies (force dev mode to include typescript/eslint)
ENV NODE_ENV=development
RUN pnpm install

# Copy source
COPY . .

# Build Next.js
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install curl for health check
RUN apk add --no-cache curl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package files
COPY package.json ./

# Install only production dependencies
ENV NODE_ENV=production
RUN pnpm install --prod

# Copy built files from builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.mjs ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Production command
CMD ["pnpm", "start"]
