# Installation und Informationen

### Wichtig: Die Backend-Skripte müssen in ./backend, die Frontend-Skripte in ./frontend ausgeführt werden, sonst funktionieren die Befehle hier nicht.

## Backend

Zuerst muss das Backend gestartet werden, da es das docker-network für das frontend erstellt:

- `./install` Übernimmt die komplette Installation und führt die nachfolgenden Skripte in dieser Reihenfolge aus.
- `./update_composer.sh` Lädt dependencies herunter
- `./toggle_env.sh -p` Ändert `.env` zur **P**roduction config. Weitere Parameter: `-d` **D**evelopment config, heißt
  es werden unter anderem Debug informationen ausgegeben.
- `./backend.sh --start` Startet Laravel. Weitere Parameter: `--stop` Stoppt Laravel.
- `./reset_db.sh` Resettet die DB vollständig, heißt alle Daten werden auf den Anfangszustand gesetzt.

## Frontend

Nachdem Backend gestartet wurde, kann das Frontend starten.

- `./frontend.sh --start` Baut Angular, Kopiert gebautes Angular in nginx container und startet Angular.
  Weitere Parameter: `--stop` Stoppt Angular.

## Login für den Admin
### URL: [http://localhost/adminLogin](http://localhost/adminLogin)
### Name: Biedermann
### Passwort: H0chSchUl3_01-FhWs44
Für Passwortänderung siehe Dokumentation von Peter im Punkt "Admin-Seeder"