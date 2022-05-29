FROM node:16 as base

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./
COPY src/ ./

RUN npm config set unsafe-perm true

RUN npm install -g typescript
RUN npm install -g ts-node
USER node

COPY --chown=node:node . .


FROM base as build

RUN npm install --save-dev sequelize-cli
RUN npm install --production
CMD ["npm","run","build"]

FROM base as dev

RUN npm install
CMD ["npm","run","dev"]
