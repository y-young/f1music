#!/bin/bash

# Modify php.ini for file upload
sed -i "0,/upload_max_filesize = 2M/s//upload_max_filesize = 20M/" "$PHP_INI_DIR/php.ini"
sed -i "0,/post_max_size = 8M/s//post_max_size = 20M/" "$PHP_INI_DIR/php.ini"

# Setup storage directories
mkdir -p storage/app/uploads
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
chown -R www-data:www-data storage
# Link media file storage to public directory
ln -s /var/www/html/storage/app/uploads /var/www/html/public/uploads