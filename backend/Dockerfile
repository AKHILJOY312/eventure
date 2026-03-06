# ---------- Base ----------
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./


# ---------- Stage 1: Development ----------
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--legacy-watch"]


# ---------- Stage 2: Build ----------
FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build


# ---------- Stage 3: Production ----------
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/infra/web/server.js"]
