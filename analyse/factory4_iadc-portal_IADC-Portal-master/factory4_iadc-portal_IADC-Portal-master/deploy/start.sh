#!/bin/bash

# set -euo pipefail
# datesec=$(date +%s)
# url="https://emea-aws-gitlab.sanofi.com:3001/api/v4/projects/3258/jobs/artifacts/${VERSION_SRM_ENV}/download?job=create_version_badge_${VERSION_ENV}&date=${datesec}"
# curl -L -o version.zip -H "PRIVATE-TOKEN: dRLaEsQfz72ch1___H71" -H "Cache-Control: no-cache" "${url}"
# unzip version.zip
# export VUE_APP_VERSION=$(cat current.version)
# echo ${VUE_APP_VERSION}

find /app/environment /app/dist /app/.nuxt \
  -type f \
  -exec sed -i "s+%%VUE_APP_CONFLUENCE_READER_BASE_API_PLACEHOLDER%%+${VUE_APP_CONFLUENCE_READER_BASE_API:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_CONFLUENCE_READER_BASE_URL_PLACEHOLDER%%+${VUE_APP_CONFLUENCE_READER_BASE_URL:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_MATOMO_BASE_URL_PLACEHOLDER%%+${VUE_APP_MATOMO_BASE_URL:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_API_MATOMO_TOKEN_PLACEHOLDER%%+${VUE_APP_API_MATOMO_TOKEN:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_WHISPR_BASE_URL_PLACEHOLDER%%+${VUE_APP_WHISPR_BASE_URL:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_WHISPR_BASE_WS_PLACEHOLDER%%+${VUE_APP_WHISPR_BASE_WS:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_COGNITO_APP_DOMAIN_PLACEHOLDER%%+${VUE_APP_COGNITO_APP_DOMAIN:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_COGNITO_CLIENT_ID_PLACEHOLDER%%+${VUE_APP_COGNITO_CLIENT_ID:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_COGNITO_PROVIDER_NAME_PLACEHOLDER%%+${VUE_APP_COGNITO_PROVIDER_NAME:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_INSTANA_API_KEY_PLACEHOLDER%%+${VUE_APP_INSTANA_API_KEY:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_CONFLUENCE_API_TOKEN_PLACEHOLDER%%+${VUE_APP_CONFLUENCE_API_TOKEN:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_CONFLUENCE_API_USERNAME_PLACEHOLDER%%+${VUE_APP_CONFLUENCE_API_USERNAME:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_CONFLUENCE_BASE_URL_PLACEHOLDER%%+${VUE_APP_CONFLUENCE_BASE_URL:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_SELF_SERVICE_STRUCTURE_PAGE_ID_PLACEHOLDER%%+${VUE_APP_SELF_SERVICE_STRUCTURE_PAGE_ID:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_GOOGLE_ANALYTICS_ID_PLACEHOLDER%%+${VUE_APP_GOOGLE_ANALYTICS_ID:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_GOOGLE_ANALYTICS_PRIVATE_KEY_PLACEHOLDER%%+${VUE_APP_GOOGLE_ANALYTICS_PRIVATE_KEY:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_GOOGLE_ANALYTICS_CLIENT_EMAIL_PLACEHOLDER%%+${VUE_APP_GOOGLE_ANALYTICS_CLIENT_EMAIL:?}+g" '{}' \; \
  -exec sed -i "s+%%VUE_APP_FEATURE_JIRA_ISSUE_ENABLED_PLACEHOLDER%%+${VUE_APP_FEATURE_JIRA_ISSUE_ENABLED:?}+g" '{}' \; \

npm start
