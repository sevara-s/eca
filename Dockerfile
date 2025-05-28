# 1. Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# 2. Run stage
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "start"]