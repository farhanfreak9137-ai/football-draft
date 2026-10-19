# Multi-stage production Dockerfile
# Stage 1: Build client and server
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json tsconfig*.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
RUN npm ci

# Copy source code and data
COPY data ./data
COPY src ./src

# Build client and server
RUN npm run build:client
RUN npm run build:server

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY migrations ./migrations

EXPOSE 3001

CMD ["node", "dist/server/server/index.js"]

