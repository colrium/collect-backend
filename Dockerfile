FROM node:18-alpine

RUN apk update && apk upgrade && apk add --no-cache \
    vim nano perl curl wget shadow busybox-extras su-exec sudo netcat-openbsd bash postgresql-client libmagic cairo-dev pango-dev gdk-pixbuf ttf-freefont git openssh

ARG UID
ARG GID
ARG PRODUCT_DIR
ARG USR
ARG GRP
ARG PORT
ENV UID ${UID:-1000}
ENV GID ${GID:-1000}
ENV USR ${USR:-node}
ENV GRP ${GRP:-node}
ENV PORT ${PORT:-3000}
ENV PS1='\u@\h  \w \$ '
ENV PRODUCT_DIR=${PRODUCT_DIR:-/usr/src/app}
ENV EDITOR="nano"

# Modify update user and group
RUN test -z $(getent group $GID | cut -d: -f1) || \
      groupmod --gid $((GID+1000)) --new-name "backup-$GRP" $(getent group $GID | cut -d: -f1)
RUN test -z $(getent passwd $UID | cut -d: -f1) || \
      usermod -u $((UID+1000)) -l "backup-$USR" -o $(getent passwd $UID | cut -d: -f1)
#
# create the group and user
RUN set -x ; addgroup -g "$GID" -S "$GRP" && \
	adduser \
	--disabled-password \
	-g "$GID" \
	-D \
	-s "/bin/bash" \
	-h "/home/$USR" \
	-u "$UID" \
	-G "$GRP" "$USR" && exit 0 ; exit 1
#
RUN chown -R ${UID}:${GID} /home/$USR

RUN mkdir -p $PRODUCT_DIR
RUN mkdir -p $PRODUCT_DIR/tmp
RUN chown -R ${UID}:${GID} $PRODUCT_DIR
WORKDIR $PRODUCT_DIR

USER $USR

COPY --chown=$USR:$GRP package*.json yarn.lock* ./

RUN yarn add glob rimraf

RUN yarn install

COPY --chown=$USR:$GRP . .


# RUN npx nestjs-command seed:users


CMD ["yarn", "start:dev"]
