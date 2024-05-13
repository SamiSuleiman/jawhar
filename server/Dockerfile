ARG IMG=node:20-alpine

# prod build stage
FROM ${IMG} AS prod-build
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build

# prod stage
FROM ${IMG} AS prod
COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
# COPY --chown=node:node --from=prod-build /app/.env /app/dist/.env

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD [ "node", "--max-old-space-size=8192", "/app/dist/src/main.js" ]

