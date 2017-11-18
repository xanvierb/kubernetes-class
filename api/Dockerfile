FROM node:9-alpine

EXPOSE 1337

WORKDIR /app

COPY main.js ./
COPY package.json ./
COPY package-lock.json ./

RUN npm install

CMD node main.js