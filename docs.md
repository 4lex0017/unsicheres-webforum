# Unsicheres Web-Forum für die Lehre - Dokumentation
Daniel Becker

Chris Reichel

## Filtering, Monitoring und das Scoreboard

### Unterstützte Schwachstellen und Einstellungen

Da diese Anwendung für Vorlesungen gedacht ist, kann ein\*e Administrator\*in (im Regelfall der/die Professor\*in) die Schwierigkeit für bestimmte Verwundbarkeiten nach Wunsch einstellen.

Die folgenden Verwundbarkeiten und anderweitigen Schwierigkeitseinstellungen werden unterstützt:

#### SQL Injection

Da das Back-End eine SQL-Datenbank nutzt, kann ein Angreifer die SQL-Grammatik in Anfragen ausnutzen, um eigene Datenbankanfragen auszuführen.
Würde man beispielsweise den Nutzer mit der ID 1 anfordern, würde das SQL-Statement, das an die Datenbank geschickt wird, etwa "SELECT * FROM users WHERE id = 1" lauten.
Fragt man nun stattdessen den Nutzer mit der ID "1 OR 1=1" an, so liest sich der WHERE-Teil des Statements als "WHERE id = 1 OR 1=1", was überall wahr ist, weshalb dann jeder Eintrag zurückgegeben wird.

Die verschiedenen unterstützten Schwierigkeitsgrade werden in der "Filtering"-Sektion genauer behandelt.

#### Blind SQL Injection

Blind SQL Injection ist eine Unterart von SQL Injection, bei der keine Informationen direkt herausgezogen werden, sondern indirekt herausgefunden werden, indem Antworten beispielsweise verzögert werden, wenn bestimmte Bedingungen erfüllt werden.

Blind SQLI hat keine eigenen Schwierigkeitsstufen oder Filter, sondern wird bei SQL Injection mitgefiltert.

#### Cross-Site-Scripting(XSS)

Da das Forum nutzergenerierte Inhalte enthält, kann ein Angreifer in veröffentlichte Inhalte HTML-Tags einfügen, um eigenen Code ausführen zu können.
So könnte man beispielsweise einen Nutzernamen wie ``Albert<script>alert('Hallo!')</script>`` wählen, was auf einer unsicheren Webseite ein Pop-Up mit dem Text "Hallo!" erzeugen würde, wann immer der Nutzername angezeigt wird.

Die verschiedenen unterstützten Schwierigkeitsgrade werden in der "Filtering"-Sektion genauer behandelt.

#### Unsicherer File Upload

Da Nutzer für ihre Konten Profilbilder hochladen können, kann man versuchen, nicht-Bilddateien (wie z.B. ausführbare Dateien mit böswilligem Code) statt Bildern hochzuladen.

Die verschiedenen unterstützten Schwierigkeitsgrade werden in der "Filtering"-Sektion genauer behandelt.

#### Password Hashing

Passwords aren't (always) stored in plain text - for security reasons, most websites store encrypted("hashed") versions.
The administrator can choose between different algorithms, most of which are reversible by now.
These hashed passwords can then be extracted via other means, such as SQL injection.

Passwörter werden (meistens) nicht als Klartext gespeichert, sondern mit einer Hashfunktion verschlüsselt, die im Idealfall nicht reversibel sein sollte.
Diese gehashten Passwörter können von Angreifern auf andere Methoden, wie beispielsweise SQL Injection, aus der Datenbank geholt werden und bei einem reversiblen Algorithmus wieder in Klartextpasswörter übersetzt werden.
Die folgenden (größtenteils) reversiblen Hash-Algorithmen werden unterstützt:

##### Schwierigkeitsgrade:

- 1: Keine Hash-Funktion. Passwörter werden als Klartext gespeichert.
- 2: Der (veraltete) Message-Digest 5 (MD5) Hash-algorithmus wird verwendet, um Passwörter zu verschlüsseln.
- 3: Der (veraltete) Salted Hash Algorithm 1 (SHA-1) Hash-algorithmus wird verwendet, um Passwörter zu verschlüsseln.
- 4: Der Salted Hash Algorithm 256 (SHA-256) Hash-algorithmus wird verwendet, um Passwörter zu verschlüsseln. Dieser Algorithmus ist zwar nicht unmöglich, aber schwer rückgängig zu machen, gerade im Kontext einer Vorlesung.

#### User Enumeration

Attempting to find log-ins via brute force is easier when an attacker knows whether the account they are trying to log into exists,
as they might otherwise spend time and energy trying to brute force the password to a non-existent account.
Thus, the administrator can choose different ways of how attackers know about whether an account exists.

Versuche, sich via Brute-Force-Attacke einzuloggen, sind einfacher, wenn ein Angreifer weiß, ob ein Konto überhaupt existiert.
Ansonsten kann es passieren, dass mit viel Zeit und Energie versucht wird, das Passwort eines nichtexistenten Kontos zu erraten.
Daher gibt es verschiedene Optionen, wie Angreifer wissen können, ob ein Konto existiert:

##### Schwierigkeitsgrade:

- 1: Einige Nutzer werden an der Seite der Website aufgelistet. Bei fehlgeschlagenen Anmeldeversuchen wird dem Nutzer mitgeteilt, ob der Nutzername oder das Passwort falsch war.
- 2: Bei fehlgeschlagenen Anmeldeversuchen wird dem Nutzer mitgeteilt, ob der Nutzername oder das Passwort falsch war.
- 3: Bei fehlgeschlagenen Anmeldeversuchen wird dem Nutzer eine generische "Login fehlgeschlagen!"-Nachricht ausgegeben.

#### Rate Limiting

Attempting to find log-ins via brute force is harder when the rate at which requests are sent to a server is limited.
The administrator can choose different levels of rate limiting - none of these should limit a legitimate user scrolling the site.

Brute-Force-Attacken können ausgebremst werden, indem die Geschwindigkeit, in der Anfragen geschickt werden dürfen, limitiert wird.
Daher werden verschiedene Stufen an Rate-Limiting unterstützt - keine davon sollte einen legitimen Nutzer beeinträchtigen.

##### Schwierigkeitsgrade:

- 1: Jeder Nutzer darf bis zu 10000 Anfragen pro Minute schicken. Da diese Zahl unrealistisch hoch ist, kann das als "unbegrenzt" verstanden werden.
- 2: Jeder Nutzer darf bis zu 120 Anfragen pro Minute schicken.
- 3: Jeder Nutzer darf bis zu 60 Anfragen pro Minute schicken.

### Middleware

Damit die Schwierigkeitseinstellungen und das Scoreboard funktionieren können, müssen alle gesendeten Anfragen nach den entsprechenden Verwundbarkeiten gefiltert und geprüft werden.

Umgesetzt wird das mit Laravels "Middleware"-Feature:
Jede Anfrage geht eine Sammlung an Middlewares durch, die sie verarbeiten, bevor sie an die Controller durchgereicht wird, die dann die gesendeten Daten in der Datenbank speichern o.Ä., wie an anderen Orten in dieser Dokumentation erklärt wird.

Für Filtering und Monitoring wurden zwei Middlewares geschrieben, ein dedizierter Filter und ein dedizierter Monitor.

### Filtering von Anfragen

#### SQL Injection

SQL injection is filtered in two different ways - the filter and monitor check for "--" and "##" as an escape string as well as certain SQLite keywords.

The "--" and "##" strings are used to comment out the end of a line in SQL - for some forms of SQL Injection, it's necessary to do so in order for the resulting arbitrary SQL to not throw syntax errors.

SQL Injection wird auf zweierlei Arten gefiltert:

Erstens prüft der Filter nach den Zeichenfolgen "--" und "##" - diese kommentieren in SQLite das Ende einer Zeile aus, was bei manchen Formen von SQL Injection notwendig ist, damit das resultierende SQL-Statement noch syntaktisch korrekt ist.

Zweitens wird nach der untenstehenden Liste von SQLite-Schlüsselwörtern gefiltert:

"and", "or", "not", "union", "benchmark", "sleep"

Diese könnten genutzt werden, um aus einer Anfrage zusätzliche Informationen zu ziehen.

##### Schwierigkeitsgrade:

- 1: Keinerlei Filter.
- 2: Der Filter durchsucht den Textkörper der Anfrage sowie die Query-Parameter einmal nach "--" und "##" und entfernt den entsprechenden Text einmal. Eine Anfrage mit "----" würde nach dem Filter also wieder korrekt "--" beinhalten.
- 3: Der Filter durchsucht den Textkörper der Anfrage sowie die Query-Parameter wiederholt nach "--" und "##" und entfernt alle Vorkommnisse davon. Die URI der Anfrage wird einmalig nach SQLite-Schlüsselwörtern gefiltert - eine Anfrage mit "oorr" würde also an dieser Stelle nach dem Filter "or" beinhalten.
- 4: Der Filter durchsucht den Textkörper der Anfrage sowie die Query-Parameter wiederholt nach "--" und "##" sowie die URI wiederholt nach SQLite-Schlüsselwörtern und entfernt alle Vorkommnisse davon.

Findet man andere für bestimmte Arten von Anfragen (z.B. POST-Anfragen) relevante Escape-Strings (wie hier "--" oder "##"), lassen sich diese im Filter und Monitor recht einfach einfügen, indem man das $escape_strings-Array entsprechend abändert.

#### Cross-Site-Scripting(XSS)

Cross-Site-Scripting wird auf zwei Arten gefiltert, sowohl nur nach ``<script>``- bzw. ``</script>``-Tags spezifisch als auch nach allen ``<``/``>``-Zeichen, je nach Schwierigkeit.

Es gibt insgesamt drei XSS-Filter:
- Einer, der den Textkörper einer Anfrage prüft, falls z.B. ein Nutzer mit XSS im Nutzernamen erstellt werden soll ("stored XSS")
- Einer, der die Query-Parameter durchsucht, falls z.B. eine Suchanfrage XSS enthält ("reflected XSS")
- Einer, der im Front-End den Textkörper überprüft - dieser Filter könnte mithilfe von Man-In-The-Middle-Attacken, bei denen eine Anfrage über einen Client wie Postman statt über die Website selbst geschickt wird, vermieden werden.

##### Schwierigkeitsgrade:

- 1: Keinerlei Filter.
- 2: Der Filter durchsucht den Text einmal nach ``<script>``- und ``</script>``-Tags und entfernt sie einmal - eine Anfrage, die ``<scr<script>ipt>`` enthält, würde nach dem Filter also ``<script>`` enthalten, ein einfacher ``<script>``-Tag würde herausgefiltert werden.
- 3: Der Filter durchsucht den Text wiederholt nach ``<script>``- und ``</script>``-Tags und entfernt sie wiederholt. Andere HTML-Tags wie ``<button>`` werden weiterhin ignoriert.
- 4: All ``<`` and ``>`` characters are filtered out. Additionally, the frontend prevents tags being injected into the website.
- 4: Alle ``<`` und ``>`` werden ausgefiltert und das Front-End verhindert, dass Tags in die DOM eingefügt werden, wie im Frontend-Teil dieser Dokumentation genauer erklärt.

#### Insecure File Upload

Profilbilder werden je nach Schwierigkeit auf verschiedene Arten gefiltert.
Erkennt der Filter eine illegale Datei (die also weder vom Typ GIF, noch JPEG, noch PNG ist), wird eine Fehlermeldung zurückgegeben und die Anfrage nicht weiter bearbeitet.

##### Difficulties:

- 1: Keinerlei Filter.
- 2: The filter checks for the data type of the encoded file using the file ending.
- 2: Der Filter prüft den Datentyp der versendeten Datei, indem die Dateiendung überprüft wird.
- 3: Der Filter überprüft die Magic Bytes der Datei, also die ersten paar Bytes - diese definieren den tatsächlichen Datentyp unabhängig von der Dateiendung.

### Monitoring ausgenutzter Schwachstellen

#### SQL Injection

Eingehende Anfragen werden wie beim Filter nach "##", "--" sowie SQLite-Schlagwörtern durchsucht.
Dadurch kann es zwar theoretisch zu falsch positiven Ergebnissen bei fehlschlagenden Versuchen von SQL-Injection kommen, das zu verhindern würde allerdings eine weitaus komplexere Lösung außerhalb des Scopes dieses Projekts erfordern - 
entweder durch Ausführen der Anfrage ohne tatsächlichen Effekt auf die Datenbank und Abgleich mit erwarteten Ergebnissen oder durch einen komplexeren SQL-Parser.

Werden in einer Anfrage mit SQL Injection Schlagwörter wie "DROP", die die Datenbank kaputt machen könnten, erkannt, 
kriegt der Angreifer zwar Punkte, allerdings wird die Anfrage nicht weiter bearbeitet, damit die Datenbank nicht durchgängig zurückgesetzt werden muss.

#### Blind SQL Injection

Bei jeder Anfrage, die keine SQL Injection enthält, wird die Bearbeitungszeit der Anfrage in der sicheren Datenbank gespeichert.

Enthält eine Anfrage SQL Injection und eins der für blind SQL Injection wichtigen Schlüsselworte "SLEEP" oder "BENCHMARK" wird verwendet, wird die Bearbeitungszeit der Anfrage mit dem durchschnitt der Anfragen ohne SQL Injection abgeglichen.
Dauert die Bearbeitung der Anfrage mehr als das fünffache der durchschnittlichen Zeit, so geht der Monitor davon aus, dass es sich um erfolgreiche Blind SQL Injection handelt.

#### Cross-Site-Scripting (XSS)

Für Cross-Site-Scripting wird mithilfe von zwei Regular Expressions nach validen HTML-Tags gesucht:

``<.*>.*</.*>`` erkennt Tags, die einen öffnenden und schließenden Tag haben, wie zum Beispiel ``<script>alert('Hallo!')</script>``.

``<.*/>`` erkennt Tags, die nur aus einem Tag bestehen, wie zum Beispiel ``<button onClick="alert('Hallo!')">``

#### Unsicherer File Upload

Dateien werden wie bei maximaler Schwierigkeit beim Filter auf ihre Magic Bytes überprüft.

#### Log-ins in vorgefertigte Konten

Dieses Tracking passiert nicht in der Monitor-Middleware, sondern im für Logins verantwortlichen Controller -
bei erfolgreichem Login wird geprüft, ob der eingeloggte Nutzer einer der vordefinierten Nutzer ist.
Dadurch wird Scoring für Fälle wie erfolgreiches Brute-Forcing realisiert - da es hier keine direkt filter- oder erkennbare Aktion gibt (wie z.B. bei XSS),
werden diese Fälle dadurch abgefangen.

### Scoreboard

Damit das Scoreboard angezeigt werden kann, müssen zwei Aufgaben vom Back-End erfüllt werden: Ausnutzung von Schwachstellen muss gespeichert und einem Angreifer zugeordnet werden können.

#### Angreifer identifizieren

Ursprünglich sollten Angreifer mithilfe ihrer IP-Adresse identifiziert werden, da diese praktisch einzigartig ist.
Da der Frontend-Server von Angular allerdings einen Reverse-Proxy nutzt und damit die IP-Adresse von Nutzern maskiert,
war das keine Option. Stattdessen wird nun ein Cookie verwendet, der Angreifern beim ersten Betreten der Webseite zugeteilt wird.

Sämtliche Anfragen ohne diesen Cookie werden vom Back-End ignoriert, um nicht zuzuordnende Angriffe zu vermeiden.

#### Ausnutzung von Schwachstellen speichern

Wird im Monitor eine Schwachstelle erkannt, so wird der Erfolg in die Datenbank geschrieben. Hierbei wird der Angreifer, die Route, die Schwierigkeit und die Art der Schwachstelle vermerkt.
Fürs Scoreboard selbst relevant sind dabei nur Angreifer, Schwierigkeit und Art der Schwachstelle - die Route wird noch hinzugegeben, damit Doppelungen zwar verhindert werden können
(ein Angreifer also nicht unendlich Punkte erhalten kann, indem er wiederholt die gleiche Schwachstelle ausnutzt), allerdings die gleiche Verwundbarkeit mit der gleichen Schwierigkeit an verschiedenen Stellen ausgenutzt werden kann.

#### Ausgabe des Scoreboards

Die Ausgabe des Scoreboards läuft relativ simpel ab - Der Controller geht alle eingetragenen Attacker durch, lädt die spezifischen Informationen zu ihren gefundenen Verwundbarkeiten
(so wird z.B. die ID einer Route, mit der sie gespeichert wird, aufgelöst und mit der URI ersetzt) und gibt diese dann zurück.

### Konfiguration

Die Einstellungen für Administratoren werden in zwei Gruppen unterteilt: routenabhängige Schwierigkeiten wie zum Beispiel die SQL-Schwierigkeit und routenunabhängige Schwierigkeiten wie das Passwort-Hashing.
Für routenabhängige Schwierigkeiten sind mehrere Optionen gleichzeitig möglich - so kann z.B. stored XSS für Nutzereinstellungen auf "1" und für Thread-Titel auf "3" gestellt sein.

#### Konfiguration laden

Es gibt zwei Arten, die Konfiguration zu laden:

##### admin/vulnerabilities

Hier wird Information über alle Verwundbarkeiten, die in backend\storage\app\config\vulnerabilities.json hardcoded ist, ausgegeben.
Im Feld "checked" wird dafür gespeichert, welche Schwierigkeiten aktuell aktiv sind. Dafür werden alle Routen, für die eine bestimmte
Verwundbarkeit eine Option ist (gespeichert in backend\storage\app\config\vulnRoutes.json), durchgegangen und die entsprechenden Schwierigkeiten
auf "true" gesetzt. Für routenunabhängige ("statische") Schwierigkeiten, bei denen nur eine Option gleichzeitig aktiv sein kann, wird diese stattdessen
einfach aus der Datenbank gezogen.

##### admin/config

Hier wird spezifische Information darüber, auf welchen Routen welche Verwundbarkeiten aktiv sind, geladen.
Die Logik hierfür ist simpler als für admin/vulnerabilities - es werden einfach alle Routen durchgegangen und die
Schwierigkeiten geladen, danach werden die statischen Schwierigkeiten geladen und angehängt.

#### Setting configuration

Lukas Hein

Alexander Kern

Daniel Katzenberger

Peter Weiß

