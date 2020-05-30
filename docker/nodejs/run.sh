#!/bin/sh

echo '==============================================='
echo 'Checking node and npm version'
echo '==============================================='
echo ''

node -v
npm -v

echo ''
echo '==============================================='
echo 'Install dependencies'
echo '==============================================='
echo ''


npm i -g ts-node
npm i -g typeorm
npm i

echo ''
echo '==============================================='
echo "Environment ${ENVIRONMENT}"
echo '==============================================='
echo ''

if [ "${ENVIRONMENT}" = 'dev' ]; then
  npm run start:dev
fi
