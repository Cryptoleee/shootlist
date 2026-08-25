# Shootlist

Interactieve mobiele shooting list voor meerdere klussen. Start op een openingsscherm met alle klussen; tik op een klus om de bijbehorende shootlist te openen.

## Klussen
1. **De Opening 2026** — Apeldoorn, vr 28 – zo 30 aug. Acts met `STORY:` in de notitie zijn de momenten waarvan de organisatie bij de start een beeld geappt wil hebben (06 22808236). Eén slot afvinken = act klaar (`doneMode: "any"`).
2. **Bedrijfsvideo lijmproductie** — panden 5/7/9, tijdblokken 08:15–±12:30 uit `Bedrijfsvideo_shots.xlsx`. Alle shots per blok nodig (`doneMode: "all"`). De Info-tab toont de toestemmingslijst van figuranten — let op de mensen die alleen onherkenbaar in beeld mogen.

## Wat het doet
- Openingsscherm met voortgang per klus; state wordt per klus apart opgeslagen
- Vink af op act-niveau of per individueel tijdslot/shot
- Filter op dag, status (todo/gedaan) en prioriteit (must-have / overig / conditioneel)
- Tabs per klus configureerbaar: Plattegrond, Timetable en/of Info
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

## Klussen / acts aanpassen
Edit `data.js` — voeg een object toe aan `PROJECTS` (id, name, stateKey, doneMode, days, acts, optioneel map/timetable/info). De Opening-tijden zijn gecheckt tegen het blokkenschema (A3-flyer, 2e druk), uit.inapeldoorn.nl/de-opening en theaterindestad.nl/programma (laatst gecheckt 21 aug 2026). `timetable.jpg` is het blokkenschema, `Locaties.jpg` de plattegrond-zijde van de flyer.

## Save to home screen
Open de live URL op iPhone in Safari → Share → "Voeg toe aan beginscherm". Werkt dan als app.
