FROM node:18-alpine

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "npx sequelize-cli db:migrate && node app.js"]
