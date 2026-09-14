FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

FROM node:24-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

EXPOSE 3001

CMD ["node", "./src/server.js"]