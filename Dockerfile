# Use the official Node.js LTS image with Alpine for smaller size
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Use a non-root user for security
RUN chown -R node:node .
USER node

# Expose the application port
EXPOSE 3000

# Command to run the application (use start:prod for production)
CMD ["npm", "run", "start:prod"]