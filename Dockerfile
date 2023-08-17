FROM node as development

WORKDIR /app

COPY . .

RUN make install

EXPOSE 3000

CMD ["make", "start-dev"]

FROM node as production

WORKDIR /app

COPY . .

RUN make install

EXPOSE 3000

CMD ["make", "start"]