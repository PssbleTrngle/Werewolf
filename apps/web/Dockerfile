FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV CI=true

RUN apk add --no-cache libc6-compat && apk update

FROM base AS builder

# Set working directory
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer

COPY .gitignore .gitignore
COPY . .
#COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
#COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/apps/web/setup/ ./apps/web/setup
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --shamefully-hoist

RUN ls apps/web/node_modules
RUN ls apps/web/node_modules/@csstools
RUN ls apps/web/node_modules/eslint
RUN ls apps/web/node_modules/typescript
RUN ls apps/web/node_modules/typescript/bin

#COPY --from=builder /app/out/full/ .
#COPY turbo.json turbo.json

RUN pnpm turbo run build --filter=web...

# Serve enviroment
FROM nginx:stable-alpine AS runner

# Copy build application
COPY --from=installer /apps/web/dist /usr/share/nginx/html

# Copy config file
COPY --from=installer /apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]