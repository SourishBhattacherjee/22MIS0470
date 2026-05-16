FROM node:20-alpine

WORKDIR /app

COPY logging_middleware ./logging_middleware
COPY notification_app_be/package*.json ./notification_app_be/
COPY notification_app_be/tsconfig.json ./notification_app_be/

WORKDIR /app/logging_middleware
RUN npm install
RUN npm run build

WORKDIR /app/notification_app_be
RUN npm install

COPY notification_app_be/src ./src
COPY notification_app_be/.env ./.env

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
