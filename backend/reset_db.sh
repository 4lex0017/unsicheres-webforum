#!/usr/bin/env bash

# reset tables
docker exec php php artisan migrate:reset --path=/database/migrations/secure/ --path=/database/migrations/insecure &&

# migrate them again
docker exec php php artisan migrate --path=/database/migrations/secure/ --path=/database/migrations/insecure &&

# fill with our seeders
docker exec php php artisan db:seed
