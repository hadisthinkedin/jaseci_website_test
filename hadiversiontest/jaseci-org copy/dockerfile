# Build stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

ADD . .

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build the application (includes JSON generation)
RUN pnpm build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]