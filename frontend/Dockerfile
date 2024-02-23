FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json .
RUN npm install 

COPY . .
RUN npm run build

FROM nginx
RUN apt update && apt install -y vim

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d
