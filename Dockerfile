FROM node:10.16.2-alpine

ENV PORT=80

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY ./src ./src
COPY tsconfig.json ./

# Install app dependencies
RUN npm install

# Compile app
RUN npm run build

# Remove dev-dependencies
RUN npm prune --production

EXPOSE 80

CMD [ "npm", "start" ]