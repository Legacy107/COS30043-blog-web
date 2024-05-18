FROM node:18-alpine

WORKDIR /app

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["yarn", "start", "--port", "3001"]
