FROM node:12.18.3

WORKDIR /givefree-api

COPY package*.json ./

RUN npm install

COPY . /givefree-api/

ENV PORT=8000

EXPOSE 8000

CMD [ "npm", "start" ]