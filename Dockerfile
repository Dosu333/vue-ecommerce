FROM node:16-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

EXPOSE 8080

RUN npm run build



FROM nginx:1.19

COPY ./nginx/nginx.conf etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html
