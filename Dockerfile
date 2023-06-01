FROM node:lts-alpine

RUN mkdir /app
COPY package*.json /app

WORKDIR /app

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
