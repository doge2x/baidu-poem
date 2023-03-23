FROM node:18-alpine AS base

FROM base AS builder

# Add registries
RUN rm /etc/apk/repositories && \
    echo "https://mirrors.cloud.tencent.com/alpine/v3.17/main" >>/etc/apk/repositories && \
    echo "https://mirrors.cloud.tencent.com/alpine/v3.17/community" >>/etc/apk/repositories && \
    echo "registry=http://registry.npm.taobao.org" >>/etc/npmrc

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat && \
    npm i -g pnpm

# Install dependencies
FROM builder AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM builder AS output
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$BASE_PATH

RUN pnpm build

# Copy build output to a standalone image
FROM scratch AS artifact
WORKDIR /app
COPY --from=output /app/public ./public
COPY --from=output /app/.next/standalone ./
COPY --from=output /app/.next/static ./.next/static

# Production image, copy all the files and run next
FROM base AS app
WORKDIR /app

# Add group and user
RUN addgroup --system --gid 1000 nodejs && \
    adduser --system --uid 1000 nextjs

COPY --from=artifact --chown=nextjs:nodejs /app ./

USER nextjs

ENV NODE_ENV production

CMD ["node", "server.js"]
