#!/usr/bin/env bash
./update_composer.sh && ./toggle_env.sh -p && ./backend.sh --start && ./reset_db.sh
