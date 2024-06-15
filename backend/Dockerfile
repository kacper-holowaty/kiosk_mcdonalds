FROM node:14

WORKDIR /app

COPY backend/ .

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]