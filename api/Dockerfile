# Stage 1: Install production dependencies
FROM node:22.14.0-alpine3.21 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Minimal hardened runtime image
FROM node:22.14.0-alpine3.21

ENV NODE_ENV=production
WORKDIR /app

RUN npm install -g npm@latest && npm cache clean --force \
    && addgroup -g 1001 -S appgroup \
    && adduser -u 1000 -S appuser -G appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

RUN chown -R appuser:appgroup /app

USER 1000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/index.js"]
