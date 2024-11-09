FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --production 

COPY . .

RUN apt update && apt-get install -y iputils-ping postgresql-client

EXPOSE 8000

CMD ["node", "server.js"]


