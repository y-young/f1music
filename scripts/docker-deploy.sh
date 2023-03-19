#!/bin/bash
# Deploy a production version of the app

cp -f .env.prod .env
# Generate APP_KEY
sed -i "0,/{APP_KEY}/s//"base64:$(head /dev/urandom -c 32 | base64 | sed -e 's/[]\/$*.^[]/\\&/g')"/" .env

docker-compose up -d

# Cache config
docker exec -it f1music_app_1 php artisan config:cache

# Initialize database
docker exec -it f1music_app_1 php artisan migrate