FROM node:16.13.1 AS build
WORKDIR /build

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY public/ public
COPY src/ src
COPY .env .
RUN npm run build

FROM nginx:alpine
COPY --from=build /build/build/ /usr/share/nginx/html