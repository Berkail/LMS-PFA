#!/bin/bash

if [[ "$1" == "--reset" ]]; then
  echo "Resetting Docker environment..."
  docker-compose down -v
else
  docker-compose down
fi

set -a
source ./back-end/.env
set +a

docker-compose up --build -d
