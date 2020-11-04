FROM node:alpine

WORKDIR /user/app
COPY package.json .
RUN npm install --only=prod
COPY . .

USER node
CMD [ "npm", "start" ]