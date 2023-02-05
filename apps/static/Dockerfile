FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json yarn.lock* ./

RUN yarn install

COPY . .

RUN npm run build static

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock* ./

RUN yarn install --production

COPY ../ .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/static/main"]
