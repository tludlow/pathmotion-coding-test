# Stage 1, building the application
FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn build


# Stage 2, running the application
FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 5000
RUN yarn run db-generate
CMD yarn start