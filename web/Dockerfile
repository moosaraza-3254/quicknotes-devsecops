# Stage 1: Install production dependencies
FROM node:22.14.0-alpine3.21 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Minimal hardened runtime image
FROM node:22.14.0-alpine3.21

ENV NODE_ENV=production
WORKDIR /app

RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /opt/yarn* /usr/local/bin/yarn /usr/local/bin/yarnpkg

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY public ./public

RUN chown -R node:node /app

USER 1000

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["node", "src/index.js"]
