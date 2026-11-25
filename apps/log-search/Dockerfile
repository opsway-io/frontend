FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.6.10 --activate

FROM base AS builder
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY packages/shell ./packages/shell
COPY apps/log-search ./apps/log-search

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --filter log-search... --frozen-lockfile
RUN pnpm --filter log-search build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/log-search/public ./apps/log-search/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/log-search/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/log-search/.next/static ./apps/log-search/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/log-search/server.js"]
