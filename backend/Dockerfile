FROM node:20-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Copy package files first (for caching)
COPY package.json ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install

# Copy source
COPY . .

# Build TypeScript
RUN pnpm build

# Expose port
EXPOSE 3001

# Production command
CMD ["pnpm", "start"]
