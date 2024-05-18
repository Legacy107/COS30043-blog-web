FROM nikolaik/python-nodejs:python3.10-nodejs18-alpine

RUN apk add make gcc g++

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

WORKDIR /app

COPY yarn.lock package.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "preview", "--port", "3000", "--host"]
