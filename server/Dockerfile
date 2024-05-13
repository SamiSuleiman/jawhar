ARG IMG=node:20-alpine

# prod build stage
FROM ${IMG} AS prod-build
WORKDIR /app
COPY . .
RUN npm i 
RUN npm run build
RUN npm prune --production

# prod stage
FROM ${IMG} AS prod
COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
# COPY --chown=node:node --from=prod-build /app/.env /app/dist/.env

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD [ "node", "--max-old-space-size=8192", "/app/dist/main.js" ]

