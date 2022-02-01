FROM node:alpine

WORKDIR /usr/src/app

ENV PORT 5000

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install

COPY . /usr/src/app/

RUN npx prisma generate
RUN npm run build

EXPOSE 5000

ENTRYPOINT ["npm", "run", "start"]