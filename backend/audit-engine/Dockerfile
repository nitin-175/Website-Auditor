# ---------- Runtime Stage ----------

FROM node:22-bookworm-slim

WORKDIR /app

# Install Chromium and required runtime dependencies

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        ca-certificates \
        fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Production environment

ENV NODE_ENV=production

# Tell chrome-launcher/Lighthouse which browser executable to use

ENV CHROME_PATH=/usr/bin/chromium

# Copy dependency manifests first for Docker layer caching

COPY package*.json ./

# Install production dependencies only

RUN npm ci --omit=dev

# Copy application source

COPY src ./src

# Run as a non-root user

USER node

EXPOSE 3001

CMD ["npm", "start"]