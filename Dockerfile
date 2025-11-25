# Step 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package info and install deps
COPY package*.json ./
RUN npm install --force

# Copy the rest of the app
COPY . .

# Build the Next.js project
RUN npm run build

# Step 2: Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the desired port
EXPOSE 5200

# Start the app
CMD ["npm", "start"]