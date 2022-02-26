FROM node:16.13.1
WORKDIR /usr/app/roofing-app
COPY client ./client
COPY server ./server
WORKDIR /usr/app/roofing-app/client
RUN npm install
RUN npm run build
WORKDIR /usr/app/roofing-app/server
RUN npm install
EXPOSE 8081
CMD [ "node", "app.js" ]