FROM node:18-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 5005
CMD ["node", "index.js"]