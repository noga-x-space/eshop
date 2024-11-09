# BUILD STAGE
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start"]
