#!/usr/bin/env bash
help_fn() {
    echo -e "Usage:  toggle_env [OPTION]\n"
    echo -e "Script to toggle between production and development .env file\n"
    echo -e "Options:"
    echo -e "-p, --prod\tSwitch to production."
    echo -e "-d, --dev\tSwitch to development."
    echo -e "-h, --help\tShow this dialog."

    exit 0
}

if [ $# = 0 ]; then
    help_fn
    exit 0
fi

if [ $1 = "-p" ] || [ $1 = "--prod" ]; then
    cp ./.env.prod ./.env
    echo "Set to production config"
    exit 0
fi

if [ $1 = "-d" ] || [ $1 = "--dev" ]; then
    cp ./.env.dev ./.env
    echo "Set to development config"
    exit 0
fi

if [ $1 = "--help" ] || [ $1 = "-h" ]; then
    help_fn
    exit 0
fi

help_fn
