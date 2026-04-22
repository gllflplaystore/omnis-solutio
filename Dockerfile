# Build stage
FROM node:24 as build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Production
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]