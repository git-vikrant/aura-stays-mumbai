FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npx prisma db push
RUN node src/data/seed.js

EXPOSE 5000

CMD ["npm", "start"]
