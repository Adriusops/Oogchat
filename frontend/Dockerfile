#multi-stage build
#stage 1: Node
FROM node:alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

#stage 2: Nginx
FROM nginx:latest

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
