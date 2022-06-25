#!/bin/sh

docker-compose -f docker-compose-prod.yml run --rm composer update
