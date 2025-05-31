# For Vite or React with static build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Use Nginx to serve static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
