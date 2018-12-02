#!/bin/bash
#
# Author:  Googleplex <yyoung2001 AT gmail.com>
# Description: Semi-auto Deploy Script for Laravel & Lumen
# Version: 1.2.1
#

#export PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin
clear
printf "
########################################################
#                    Lumen Deployer                    #
########################################################
"
mode="initial"
env="2"
app_key=""
db_name=""
db_user=""
db_pass=""
git_branch=""
web_user="www"
dev_group="musicdev"
default_mode="570"
writable_mode="770"
composer_args=""
yarn_args=""
# set -x
# set -e
function success() {
    echo -e "\033[32m$1\033[0m"
}
function info() {
    echo -e "\033[34m$1\033[0m"
}
function msg() {
    echo -e "\033[36m$1\033[0m"
}
function warning() {
    echo -e "\033[33m$1\033[0m"
}
function error() {
    echo -e "\033[31m$1\033[0m"
}
function writeConfig() {
    info 'Writing to .env...'
    if [[ "$env" == "1" ]]; then
        app_env="production"
        app_debug="false"
    else
        app_env="local"
        app_debug="true"
    fi
    app_key=`cat /dev/urandom | head -n 32 | md5sum | head -c 32`
    cp .env.example .env
    sed -i "s/{APP_ENV}/${app_env}/" .env
    sed -i "s/{APP_DEBUG}/${app_debug}/" .env
    sed -i "s/{APP_KEY}/${app_key}/" .env
    sed -i "s/{DB_NAME}/${db_name}/" .env
    sed -i "s/{DB_USER}/${db_user}/" .env
    sed -i "s/{DB_PASS}/${db_pass}/" .env
    success 'Done.'

    info 'Writing to config...'
    sed -i "s/{APP_KEY}/${app_key}/" ./config/app.php
    sed -i "s/{DB_NAME}/${db_name}/" ./config/database.php
    sed -i "s/{DB_USER}/${db_user}/" ./config/database.php
    sed -i "s/{DB_PASS}/${db_pass}/" ./config/database.php
    success 'Done.'
}
function backendConfigure() {
    info "Running migrations..."
    php artisan migrate
    info "Creating symlink..."
    cd public && ln -s ../storage/app/uploads uploads && cd ..
    success "Done."
}
function installDependencies() {
    if [[ "$env" == "1" ]]; then
        composer_args=${composer_args}"--no-dev"
        #yarn_args=${yarn_args}"--production"
    fi
    info 'Installing backend dependencies...'
    composer install $composer_args
    success 'Done.'
    info 'Installing frontend dependencies...'
    cd ./react && yarn $yarn_args && cd ..
    success 'Done.'
}
function buildAssets() {
    info 'Building frontend assets...'
    cd ./react && npm run build
    success 'Done.'
}
function setupPermissions() {
    info 'Setting up permissions...'
    chgrp -R $dev_group ./
    chown -R $web_user ./
    chmod -R $default_mode ./
    chmod -R $writable_mode ./storage/
    success 'Done.'
}
function usage() {
    info "Usage: $0 command ...[parameters]...
    --help -h         Show this help message
    --update -u       Set mode to [update](Non-interactive)
    --prod            Indicate production environment(Default dev)
    --branch          Specify git branch to checkout
    --db_name         Set database name
    --db_user         Set database username
    --db_pass         Set database password
    "
}
# Check if user is root
#[ $(id -u) != '0' ] && { error "Error: You must be root to run this script"; exit 1; }
ARG_SUM=$#
TEMP=`getopt -o hu --long help,update,prod,branch:,db_name:,db_user:,db_pass: -- "$@" 2>/dev/null`
[ $? != 0 ] && error "Unknown argument!" && exit 1
eval set -- "${TEMP}"
while :; do
    [[ "$1" == "--" ]] && break;
    case "$1" in
        -h|--help)
            usage && exit 0
            ;;
        -u|--update)
            info "Set mode to [update]."
            mode="update"
            shift 1
            ;;
        --prod)
            info "Set environment to [production]"
            env=1
            shift 1
            ;;
        --branch)
            git_branch=$2; shift $2
            ;;
        --db_name)
            db_name=$2; shift $2
            ;;
        --db_user)
            db_user=$2; shift $2
            ;;
        --db_pass)
            db_pass=$2; shift $2
            [[ -z $db_pass && "$env" == "1" ]] && { warning "Database password cannot be empty under production"; exit 1; }
            ;;
        *)
            warning "Wrong parameters!"; exit 1
            ;;
    esac
done

if [ $ARG_SUM == 0 ]; then #Interactive mode
    while :; do echo
        echo "Specify current environment:"
        msg "\t1. Production"
        msg "\t2. Development"
        read -p "Please input a number:(Default 1 press Enter) " env
        [ -z "${env}" ] && env=1
        if [[ ! ${env} =~ ^[1-3]$ ]]; then
            warning "Input error! Please only input number 1~3"
        else
            break
        fi
    done

    read -p "Specify git branch to checkout:(Default none press Enter) " git_branch

    read -p "Enter database name:(Default f1music press Enter) " db_name
    [ -z "${db_name}" ] && db_name='f1music'

    read -p "Enter database username:(Default f1music press Enter) " db_user
    [ -z "${db_user}" ] && db_user='f1music'

    while :; do echo
        read -p "Enter database password:" db_pass
        if [[ -z $db_pass && "$env" == "1" ]]; then
            warning "Input error! Database password cannot be empty under production"
        else
            break
        fi
    done
fi

case "$mode" in
    initial)
        if [[ "$git_branch" != "" ]]; then
            info "Checking out git branch..."
            git checkout $git_branch
            success "Done."
        fi
        writeConfig
        ;;
    update)
        info "Pulling latest code..."
        git pull
        success "Done."
        ;;
esac

installDependencies
buildAssets
setupPermissions
backendConfigure
