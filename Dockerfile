# Frontend builder
FROM node:16-slim as frontend

WORKDIR /app/react

COPY react/ /app/react/

RUN mkdir /app/public

RUN yarn config set registry https://registry.npmmirror.com/ && \
    yarn install

RUN yarn run build


# Backend dependency builder for production
FROM php:8.2-apache as build

RUN sed -i s/deb.debian.org/mirrors.aliyun.com/g /etc/apt/sources.list && \
    sed -i s/security.debian.org/mirrors.aliyun.com/g /etc/apt/sources.list && \
    apt-get update

# Required for composer
RUN apt-get install -y --no-install-recommends git unzip

WORKDIR /app

COPY . .
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN composer install --prefer-dist --no-dev --optimize-autoloader --no-interaction


# Backend dependency builder for development
FROM php:8.2-apache as build-dev

RUN sed -i s/deb.debian.org/mirrors.aliyun.com/g /etc/apt/sources.list && \
    sed -i s/security.debian.org/mirrors.aliyun.com/g /etc/apt/sources.list && \
    apt-get update

# Required for composer
RUN apt-get install -y --no-install-recommends git unzip

WORKDIR /app

COPY . .
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN composer install --prefer-dist --no-interaction


# Application builder for development
FROM php:8.2-apache as dev

RUN docker-php-ext-install bcmath pdo_mysql

WORKDIR /var/www/html

COPY --from=frontend /app/public ./public
COPY --from=build-dev --chown=www-data:www-data ./app .

COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite && \
    mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini" && \
    bash ./docker/configure.sh


# Application builder for production
FROM php:8.2-apache as production

RUN docker-php-ext-install bcmath pdo_mysql

WORKDIR /var/www/html

COPY --from=frontend /app/public ./public
COPY --from=build --chown=www-data:www-data /app .

COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite && \
    mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    bash ./docker/configure.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1