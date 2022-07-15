FROM node:lts as node

RUN mkdir /home/node/app && chown node:node /home/node/app
RUN mkdir /home/node/app/node_modules && chown node:node /home/node/app/node_modules
WORKDIR  /home/node/app
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --quiet
COPY --chown=node:node . .

RUN node --max_old_space_size=4096 node_modules/.bin/ng build --prod


FROM nginx:alpine

COPY --from=node /home/node/app/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
