# Install dependencies only when needed
FROM node
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR '/app'

COPY .env.production /app
COPY .env.test /app
COPY default* /app
COPY domains.ext /app
COPY next.config.js /app
COPY package.json /app
COPY RootCA* /app
COPY server.js /app
COPY components/ /app/components/
COPY lib/ /app/lib/
COPY pages/ /app/pages/
COPY public/ /app/public/
COPY src/ /app/src/
RUN yarn --network-timeout 1000000

RUN yarn run build
EXPOSE 443 80

CMD ["yarn", "start"]