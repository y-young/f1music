#!/bin/bash
# Deploy a production version of the app

cp -f .env.prod .env
# Generate APP_KEY
sed -i "0,/{APP_KEY}/s//$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 | md5sum | head -c 32)/" .env

docker-compose up -d

# Initialize database
docker exec -it f1music_app_1 php artisan migrate