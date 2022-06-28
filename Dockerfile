# Install dependencies only when needed
FROM node:14.17.3
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR '/app'

COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "dev"]