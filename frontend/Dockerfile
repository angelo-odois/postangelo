FROM node:20-alpine

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

# Switch to production mode
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Production command
CMD ["pnpm", "start"]
