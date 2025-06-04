ARG REGISTRY_HOSTNAME
ARG NODE_VERSION

FROM ${REGISTRY_HOSTNAME}/node:${NODE_VERSION}-slim as build
COPY ./ /app
WORKDIR /app

COPY --from=sanofi-docker-innersource-local.jfrog.io/debian:bookworm /etc/ssl/certs/ca-certificates.crt /app/certs/ca

ENV CURL_CA_BUNDLE /app/certs/ca
ENV NODE_EXTRA_CA_CERTS /app/certs/ca

COPY package*.json ./
RUN npm ci --quiet

RUN npm run build

FROM ${REGISTRY_HOSTNAME}/node:${NODE_VERSION}-slim as release
COPY --from=build /app /app
COPY --from=sanofi-docker-innersource-local.jfrog.io/debian:bookworm /etc/ssl/certs/ca-certificates.crt /app/certs/ca

ENV CURL_CA_BUNDLE /app/certs/ca
ENV NODE_EXTRA_CA_CERTS /app/certs/ca

WORKDIR /app

RUN apt-get update && apt-get install curl -y
#Pining instana version, to match node version, for more details please check this link
#https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-nodejs#supported-nodejs-versions
COPY --from=icr.io/instana/aws-fargate-nodejs:3.21.0 /instana /instana
RUN /instana/setup.sh
ENV NODE_OPTIONS="--require /instana/node_modules/@instana/aws-fargate --require ./node_modules/@instana/collector/src/immediate"
RUN npm install pm2 -g
EXPOSE 3000
CMD [ "pm2-runtime", "--json", "pm2.config.js" ]