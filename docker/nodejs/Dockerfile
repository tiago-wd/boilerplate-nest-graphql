FROM node:10-alpine

RUN apk add --no-cache --virtual .gyp \
  python \
  make \
  g++

WORKDIR /var/www
ARG ENVIRONMENT
ENV ENVIRONMENT ${ENVIRONMENT}

ADD run.sh /run.sh
RUN chmod -v +x /run.sh

CMD ["/run.sh"]
