# Shootlist De Opening

Interactieve mobiele shooting list voor foto & video van **De Opening** (Apeldoorn, vr 28 – zo 30 augustus 2026).

## Wat het doet
- Lijst van acts die vastgelegd moeten worden, gesorteerd per dag (Vr 28 / Za 29 / Zo 30 aug)
- Acts met `STORY:` in de notitie zijn de momenten waarvan de organisatie bij de start een beeld geappt wil hebben (06 22808236)
- Vink af op act-niveau (snippet binnen — klaar) of per individueel tijdslot
- Filter op dag, status (todo/gedaan) en prioriteit (must-have / overig / conditioneel)
- Notities per act voor shot-ideeën / details
- State wordt opgeslagen in localStorage van je telefoon
- Plattegrond en timetable als reference tabs

## Stack
Pure HTML / CSS / JS — geen build step. Deployt direct als static site naar Vercel.

## Lokaal testen
```
python3 -m http.server 8000
# of
npx serve .
```
Open http://localhost:8000

## Acts aanpassen
Edit `data.js`. Tijden zijn gecheckt tegen het blokkenschema (A3-flyer, 2e druk), uit.inapeldoorn.nl/de-opening en theaterindestad.nl/programma (laatst gecheckt 21 aug 2026). `timetable.jpg` is het blokkenschema, `Locaties.jpg` de plattegrond-zijde van de flyer.

## Save to home screen
Open de live URL op iPhone in Safari → Share → "Voeg toe aan beginscherm". Werkt dan als app.
