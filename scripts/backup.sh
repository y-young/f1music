#!/bin/bash

BACKUP_DIR=backup
[ ! -d "$(pwd)/$BACKUP_DIR" ] && mkdir $BACKUP_DIR

date=$(date +"%F %T %Z")

function dump_database() {
    filename="$date.sql"
    docker exec f1music-mysql sh -c 'exec mysqldump f1music -uroot -p"$MYSQL_ROOT_PASSWORD" --skip-add-drop-table' > "$(pwd)/$BACKUP_DIR/$filename"
    echo "Database dumped to $BACKUP_DIR/$filename"
}

function backup_storage() {
    STORAGE_MOUNTPOINT=/storage
    filename="$date.tar"
    docker run --rm \
    --volume f1music_storage:$STORAGE_MOUNTPOINT \
    --volume $(pwd)/$BACKUP_DIR:/$BACKUP_DIR \
    ubuntu \
    tar cvf "/$BACKUP_DIR/$filename" $STORAGE_MOUNTPOINT/app $STORAGE_MOUNTPOINT/logs
    echo "Storage backed up to $BACKUP_DIR/$filename"
}

function usage() {
    echo "Usage: $0 [flags]
Default: Back up database and storage
    --help -h         Show this help message
    --database -d     Dump database
    --storage -s      Back up storage
    "
}

ARG_SUM=$#

for arg in "$@"
do
    case $arg in
        -h|--help)
            usage && exit 0
        ;;
        -d|--database)
            echo "Dumping database..."
            dump_database
            shift
        ;;
        -s|--storage)
            echo "Backing up storage..."
            backup_storage
            shift
        ;;
    esac
done

if [ $ARG_SUM == 0 ]; then
    echo "Backing up database and storage..."
    dump_database
    backup_storage
fi