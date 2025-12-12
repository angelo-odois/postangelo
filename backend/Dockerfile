# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Force development mode to install devDependencies (typescript, etc)
# This overrides any NODE_ENV ARG passed by the build system
ENV NODE_ENV=development

# Install ALL dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source
COPY . .

# Build TypeScript
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies
ENV NODE_ENV=production
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

# Create uploads directory
RUN mkdir -p /data/uploads

# Expose port
EXPOSE 3001

# Production command
CMD ["node", "dist/index.js"]
