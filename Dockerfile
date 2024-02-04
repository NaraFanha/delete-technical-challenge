FROM node:18.11-alpine as builder

WORKDIR /builder
COPY . .

RUN npm ci && \
    npm run compile

FROM node:18.11-alpine
ENV NODE_ENV production
ENV NODE_NO_WARNINGS 1

WORKDIR /app
RUN chown -R node:node /app
USER node

COPY . .
COPY --from=builder /builder/out ./out

USER root

RUN npm ci --production

CMD ["node", "out/bin/serve"]