# ---------- Base ----------
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./


# ---------- Stage 1: Development ----------
FROM base AS development

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]


# ---------- Stage 2: Build ----------
FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build


# ---------- Stage 3: Production ----------
FROM nginx:stable-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
