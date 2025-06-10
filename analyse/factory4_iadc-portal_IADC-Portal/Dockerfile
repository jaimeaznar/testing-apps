ARG REGISTRY_HOSTNAME
ARG NODE_VERSION
FROM ${REGISTRY_HOSTNAME}/node:${NODE_VERSION}-slim

ARG ARTIFACTORY_NPM_REGISTRY_AUTHURL
ARG ARTIFACTORY_REGISTRY_USERNAME
ARG ARTIFACTORY_REGISTRY_PASSWORD

# Create app directory
WORKDIR /app

COPY --from=sanofi-docker-innersource-local.jfrog.io/debian:bookworm /etc/ssl/certs/ca-certificates.crt /app/certs/ca

ENV CURL_CA_BUNDLE /app/certs/ca
ENV NODE_EXTRA_CA_CERTS /app/certs/ca

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY tsconfig*.json ./
RUN apt-get update && apt-get install build-essential libffi-dev openssl libssl-dev curl -y
RUN curl -u "$ARTIFACTORY_REGISTRY_USERNAME:$ARTIFACTORY_REGISTRY_PASSWORD" "$ARTIFACTORY_NPM_REGISTRY_AUTHURL" >> ~/.npmrc

RUN npm ci --quiet

# Build .ts files
COPY . .
ENV NODE_ENV production
ENV MODE build
RUN npm run build

EXPOSE 80
# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=80

CMD ["sh", "/app/deploy/start.sh"]
