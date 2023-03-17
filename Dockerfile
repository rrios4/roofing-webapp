FROM node:16.14.2
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
## EXPOSE [Port you mentioned in the vite.config file]
EXPOSE 5173
CMD ["npm", "run", "preview"]