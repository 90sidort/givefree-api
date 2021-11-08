FROM node:12.18.3

WORKDIR /givefree-api

COPY package*.json ./

RUN npm install

COPY . /givefree-api/

ENV PORT=4000

EXPOSE 4000

CMD [ "npm", "start" ]