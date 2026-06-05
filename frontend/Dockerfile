# Stage 1 — Build the React app using Node
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first — Docker caches node_modules if unchanged
COPY package*.json .
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2 — Serve the built files with Nginx (lightweight web server)
FROM nginx:alpine

# Copy built React files to Nginx's serve folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx runs on port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]