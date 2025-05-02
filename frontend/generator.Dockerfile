FROM node:22.14.0-alpine3.21

WORKDIR /app

COPY package.json .
RUN npm i

COPY generate-api.sh .
COPY scripts scripts

CMD ["sh", "generate-api.sh"]
