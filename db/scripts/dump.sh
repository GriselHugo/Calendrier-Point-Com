#!/bin/sh

container_name="cpc-db"

if [ "$( docker container inspect -f '{{.State.Running}}' $container_name )" = "true" ]; then
    echo "Dumping database..."
    docker compose exec mariadb sh -c 'mariadb-dump -uroot -pcest-ca-le-mdp --databases cpc-db > dump.sql'
    echo "Dump done"
else
    echo "Container cpc-db is not running, please run it first (docker compose up -d mariadb)" >&2
fi
