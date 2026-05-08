# Base image
FROM node:24-alpine AS base

WORKDIR /app

# -----------------------------
# Stage 1: Install dependencies
# -----------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable pnpm \
  && pnpm install --frozen-lockfile

# -----------------------------
# Stage 2: Build the application
# -----------------------------
FROM base AS builder

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm \
  && pnpm run build

# --------------------------------
# Stage 3: Production runtime image
# --------------------------------
FROM base AS runner

ENV NODE_ENV=production

# Copy only what is needed at runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]