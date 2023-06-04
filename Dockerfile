# FROM node:alpine
# WORKDIR /app
# COPY package.json .
# RUN npm i
# COPY . .
# # RUN npm run build
# ## EXPOSE [Port you mentioned in the vite.config file]
# EXPOSE 5173
# CMD ["npm", "run", "preview"]

FROM node as build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]