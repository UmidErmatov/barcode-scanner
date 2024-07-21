FROM node:18-alpine AS base

FROM base AS deps

#RUN /bin/sh -c apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./

RUN npm install

# If you want yarn update and  install uncomment the bellow

# RUN yarn install &&  yarn upgrade

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 9080

ENV PORT 9080

CMD ["node", "server.js"]
