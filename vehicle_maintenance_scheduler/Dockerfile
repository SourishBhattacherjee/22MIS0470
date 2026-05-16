FROM node:20-alpine

WORKDIR /app

COPY logging_middleware ./logging_middleware
COPY vehicle_maintenance_scheduler/package*.json ./vehicle_maintenance_scheduler/
COPY vehicle_maintenance_scheduler/tsconfig.json ./vehicle_maintenance_scheduler/

WORKDIR /app/logging_middleware
RUN npm install
RUN npm run build

WORKDIR /app/vehicle_maintenance_scheduler
RUN npm install

COPY vehicle_maintenance_scheduler/src ./src
COPY vehicle_maintenance_scheduler/.env ./.env

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
