FROM node:alpine

WORKDIR /usr/src/app

COPY ./app/package*.json ./
RUN npm install

COPY . .
RUN npm run tsc

CMD ["npm", "start"]