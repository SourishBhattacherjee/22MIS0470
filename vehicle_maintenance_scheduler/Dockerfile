FROM node:20-alpine

WORKDIR /app

# Copy logging_middleware first as it's a local dependency
COPY logging_middleware ./logging_middleware

# Copy vehicle_maintenance_scheduler package files
COPY vehicle_maintenance_scheduler/package*.json ./vehicle_maintenance_scheduler/
COPY vehicle_maintenance_scheduler/tsconfig.json ./vehicle_maintenance_scheduler/

# Install and build logging_middleware
WORKDIR /app/logging_middleware
RUN npm install
RUN npm run build

# Install vehicle_maintenance_scheduler dependencies
WORKDIR /app/vehicle_maintenance_scheduler
RUN npm install

# Copy source code and env file
COPY vehicle_maintenance_scheduler/src ./src
COPY vehicle_maintenance_scheduler/.env ./.env

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
