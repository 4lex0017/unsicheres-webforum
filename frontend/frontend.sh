#!/usr/bin/env bash
help_fn() {
    echo -e "Usage:  frontend [OPTION]\n"
    echo -e "Script to start and stop the frontend.\n"
    echo -e "Options:"
    echo -e "    --start\tStart the frontend."
    echo -e "    --stop\tStop the frontend."
    echo -e "-h, --help\tShow this dialog."

    exit 0
}

if [ $# = 0 ]; then
    help_fn
    exit 0
fi

if [ $1 = "--start" ]; then
    docker-compose up -d --build
    echo "Started frontend"
    exit 0
fi

if [ $1 = "--stop" ]; then
    docker-compose down
    echo "Stopped frontend"
    exit 0
fi

if [ $1 = "--help" ] || [ $1 = "-h" ]; then
    help_fn
    exit 0
fi

help_fn
