FROM node:latest

WORKDIR /app

COPY /frontend .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]