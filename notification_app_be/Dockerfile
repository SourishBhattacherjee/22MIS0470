FROM node:20-alpine

WORKDIR /app

# Copy logging_middleware first as it's a local dependency
COPY logging_middleware ./logging_middleware

# Copy notification_app_be package files
COPY notification_app_be/package*.json ./notification_app_be/
COPY notification_app_be/tsconfig.json ./notification_app_be/

# Install and build logging_middleware
WORKDIR /app/logging_middleware
RUN npm install
RUN npm run build

# Install notification_app_be dependencies
WORKDIR /app/notification_app_be
RUN npm install

# Copy source code and env file
COPY notification_app_be/src ./src
COPY notification_app_be/.env ./.env

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
