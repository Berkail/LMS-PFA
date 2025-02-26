#!/bin/bash
set -a
source ./back-end/.env
set +a
docker-compose up --build -d
