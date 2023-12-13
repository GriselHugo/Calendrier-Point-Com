#!/bin/sh

container_name="cpc-db"

if [ "$( docker container inspect -f '{{.State.Running}}' $container_name )" = "true" ]; then
    echo "Importing database..."
    docker compose exec mariadb sh -c 'mariadb -uroot -pcest-ca-le-mdp < dump.sql'
    echo "Import done"
else
    echo "Container cpc-db is not running, please run it first (docker compose up -d mariadb)" >&2
fi
