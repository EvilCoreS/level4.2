FROM node as development

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["make", "start-dev"]

FROM node as production

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["make", "start"]