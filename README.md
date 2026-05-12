# Shootlist Festival

Interactieve mobiele shooting list voor het opnemen van een festival aftermovie.

## Wat het doet
- Lijst van acts die gefilmd moeten worden, gesorteerd per dag (Wo 13 / Do 14 mei)
- Vink af op act-niveau (snippet binnen — klaar) of per individueel tijdslot
- Filter op dag, status (todo/gedaan) en prioriteit (must-have / conditioneel)
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
Edit `data.js`. De tijden uit de timetable.jpg zijn een eerste inschatting — pas aan waar nodig.

## Save to home screen
Open de live URL op iPhone in Safari → Share → "Voeg toe aan beginscherm". Werkt dan als app.
