FROM node:16 AS build-stage
WORKDIR /temp

COPY . .
RUN npm rebuild node-sass
RUN yarn
RUN yarn build

FROM node:16

RUN yarn add serve --global
WORKDIR /app
COPY --from=build-stage temp/build ./build
COPY --from=build-stage temp/package.json ./package.json
ENV NODE_ENV production
ENV PORT 4000
EXPOSE 4000
RUN yarn global add serve 

CMD ["npm","run", "serve"]






