FROM node:20-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm i --omit=dev

CMD ["ng", "serve", "--host", "0.0.0.0"]
