# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the application (runs tsc and vite build)
RUN npm run build

# Stage 2: Serve the build using Nginx
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the builder stage (assumes output is in "dist")
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
