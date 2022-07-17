#!/usr/bin/env bash
help_fn() {
    echo -e "Usage:  backend [OPTION]\n"
    echo -e "Script to start and stop the backend.\n"
    echo -e "Options:"
    echo -e "    --start\tStart the backend."
    echo -e "    --stop\tStop the backend."
    echo -e "-h, --help\tShow this dialog."

    exit 0
}

if [ $# = 0 ]; then
    help_fn
    exit 0
fi

if [ $1 = "--start" ]; then
    docker-compose -f docker-compose-prod.yml up -d --build backend
    echo "Started backend"
    exit 0
fi

if [ $1 = "--stop" ]; then
    docker-compose -f docker-compose-prod.yml down
    echo "Stopped backend"
    exit 0
fi

if [ $1 = "--help" ] || [ $1 = "-h" ]; then
    help_fn
fi
