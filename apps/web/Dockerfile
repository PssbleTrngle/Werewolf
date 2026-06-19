FROM oven/bun:1 AS base
WORKDIR /app
ENV CI=true

RUN bun --global add turbo@^2

FROM base AS prepare

COPY . .
RUN turbo prune --scope=web --docker

FROM base AS installer

COPY --from=prepare /app/out/bun.lock .
COPY --from=prepare /app/out/json/ .
RUN bun install --frozen-lockfile --production

COPY --from=prepare /app/out/full/ .
RUN bun run build --filter=web...

FROM nginx:stable-alpine AS runner

COPY --from=installer /apps/web/dist /usr/share/nginx/html
COPY --from=installer /apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]