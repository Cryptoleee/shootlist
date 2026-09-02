// Shootlist data — meerdere klussen (projecten).
// Elke klus heeft: id, name, subtitle, icon, stateKey (localStorage),
// doneMode ("any" = 1 slot is genoeg, "all" = alle shots nodig),
// days [{key, label, date?}] (date → "voorbij"-detectie), acts,
// en optioneel map {image, legend[]}, timetable {image}, info {title, groups[]}.

// ============================================================
// KLUS 1: De Opening 2026 (Apeldoorn, vr 28 – zo 30 augustus)
// Bronnen: blokkenschema A3-flyer (2e druk), briefing foto & video,
// https://uit.inapeldoorn.nl/de-opening/ + detailpagina's per act,
// https://theaterindestad.nl/programma/. Laatst gecheckt: 21 aug 2026.
// priority: "high" = must-have (story-momenten + highlights uit de briefing),
//           "normal" = overig programma, "conditional" = alleen onder voorwaarde.
// ============================================================

const DE_OPENING_ACTS = [
  // ---------- VRIJDAG ----------
  {
    id: "kinderkaravaan",
    name: "KinderKaravaan",
    priority: "high",
    location: "Park Zuidbroek (naast de voetbalcourt)",
    slots: [
      { day: "vr", time: "13:00 – 13:40" },
      { day: "vr", time: "15:00 – 15:40" }
    ],
    note: "STORY: beeld bij start 13:00 direct appen. Publiek kan half uur eerder komen voor mini-workshop — leuk voorprogramma-beeld."
  },
  {
    id: "rondleiding-kor",
    name: "Rondleiding Etalageroute — Museum voor KOR",
    priority: "high",
    location: "ACEC (vertrekpunt)",
    slots: [
      { day: "vr", time: "13:30 & 14:30 & 15:30" },
      { day: "za", time: "13:30 & 14:30 & 15:30" },
      { day: "zo", time: "13:30 & 14:30 & 15:30" }
    ],
    note: "STORY vr 14:30: als er geen bezoekers zijn, film de rondleiders die klaarstaan (tijden worden dan doorgegeven)."
  },
  {
    id: "kinderpraatpaal",
    name: "De KinderPraatPaal Praatshow",
    priority: "high",
    location: "GIGANT",
    slots: [
      { day: "vr", time: "15:00 – 16:00" }
    ],
    note: "STORY: beeld bij start 15:00 direct appen."
  },
  {
    id: "orpheus-openingsshow",
    name: "Orpheus' Openingsshow (€)(R)",
    priority: "high",
    location: "Theater Orpheus",
    slots: [
      { day: "vr", time: "20:00 – 21:15" },
      { day: "za", time: "14:00 – 15:15" },
      { day: "za", time: "20:00 – 21:15" }
    ],
    note: "STORY: beeld bij start vr 20:00 direct appen. Korte optredens uit theaterseizoen '26-'27 — briefing-highlight. WETHOUDER za bij de 20:00-show aanwezig."
  },
  {
    id: "vier-de-vrijdag",
    name: "Vier de Vrijdag — Lumesti",
    priority: "normal",
    location: "Theater Orpheus",
    slots: [
      { day: "vr", time: "21:15 – 22:30" }
    ]
  },

  // ---------- ZATERDAG ----------
  {
    id: "forces-sweathearts",
    name: "The Forces Sweathearts",
    priority: "high",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "12:00 – 12:45" }
    ],
    note: "STORY: beeld bij start 12:00 direct appen."
  },
  {
    id: "theater-in-de-stad-za",
    name: "Theater in de Stad (zaterdag)",
    priority: "high",
    location: "Binnenstad (Marktstraat / Grote Markthof / mobiel)",
    slots: [
      { day: "za", time: "Animal Love — 12:00, 13:30, 15:15 (Marktstraat)" },
      { day: "za", time: "Alex Barti Show — 12:00, 13:45, 15:30 (Grote Markthof)" },
      { day: "za", time: "Smallest Show on Earth — 13:00, 14:30, 15:30 (mobiel)" }
    ],
    note: "NIET alles nodig: 1 à 2 acts pakken is genoeg, dit zijn alle kansen van de middag. STORY: briefing zegt 12:30 parkje Marktstraat, maar volgens theaterindestad.nl starten de eerste acts al om 12:00. WETHOUDER za 13:30–13:40 bij Animal Love (Marktstraat) en 13:40–13:50 bij Smallest Show on Earth (Grote Markthof)."
  },
  {
    id: "apoppoldro",
    name: "aPOPpoldro popkoor",
    priority: "high",
    location: "Parkje Marktstraat / Grote Kerk",
    slots: [
      { day: "za", time: "13:00 – 14:00 (parkje Marktstraat)" },
      { day: "za", time: "14:30 – 15:00 (Grote Kerk)" }
    ],
    note: "STORY: beeld bij start 13:00 direct appen. Tweede kans in de Grote Kerk. WETHOUDER za 13:20–13:30 bij het koor (programma wethouder noemt Grote Markthof)."
  },
  {
    id: "linedance",
    name: "Linedance Apeldoorn",
    priority: "high",
    location: "Paslaan / parkje Marktstraat / Grote Kerk",
    slots: [
      { day: "za", time: "13:00 – 14:00 (hoek Paslaan/Hoofdstraat)" },
      { day: "za", time: "14:00 – 15:00 (parkje Marktstraat)" },
      { day: "za", time: "16:30 – 17:00 (Grote Kerk)" }
    ],
    note: "STORY: briefing zegt 13:30 Paslaan — klopt binnen het blok, maar start is al 13:00 (flyer + site). Om 13:30 zit je sowieso goed op de Paslaan."
  },
  {
    id: "frankey-onthulling",
    name: "Onthulling kunstwerk Streetart Frankey",
    priority: "high",
    location: "Grote Markthof",
    slots: [
      { day: "za", time: "14:00 – 14:10 (onthulling door wethouder)" }
    ],
    note: "Uit programma wethouder: onthulling/unboxing kunstwerk door Streetart Frankey, wethouder heeft actieve rol — nieuwsmoment. LET OP: valt samen met de start van de Grande Parade (14:00 bij ACEC) — splitsen met tweede cameraman of parade iets later oppakken (loopt 14:10–14:30 zelf langs de Grote Markthof-route)."
  },
  {
    id: "grande-parade",
    name: "Grande Parade",
    priority: "high",
    location: "Binnenstad (start vanaf ACEC)",
    slots: [
      { day: "za", time: "14:00 – 15:00" }
    ],
    note: "STORY: beeld bij start 14:00 bij ACEC direct appen. Optocht van dieren/karakters door de binnenstad — briefing-highlight, ook voor kinderen-beeld. WETHOUDER loopt za 14:10–14:30 met de parade mee richting Binnenstad-Noord."
  },
  {
    id: "acec-kinderconcert",
    name: "Kinderconcert & Showcase Orkest De Ereprijs",
    priority: "high",
    location: "ACEC",
    slots: [
      { day: "za", time: "Kinderconcert — 14:30" },
      { day: "za", time: "Showcase Orkest De Ereprijs — 17:00" }
    ],
    note: "STORY: beeld bij start 14:30 direct appen. WETHOUDER za 14:30–14:50 bij het kinderconcert."
  },
  {
    id: "njon-stallenplein",
    name: "NJON presenteert op het Stallenplein",
    priority: "high",
    location: "Paleis Het Loo — Stallenplein (overdekt)",
    slots: [
      { day: "za", time: "12:00 (± 45 min)" },
      { day: "za", time: "15:00 (± 45 min)" }
    ],
    note: "STORY: beeld bij start 15:00 direct appen. Let op: de site vermeldt ook zondag 12:00 & 15:00, de flyer (2e druk) alleen zaterdag — za 15:00 is de zekere keuze."
  },
  {
    id: "dialectkoor",
    name: "Dialectkoor",
    priority: "high",
    location: "Grote Kerk",
    slots: [
      { day: "za", time: "15:30 – 16:00" }
    ],
    note: "STORY: beeld bij start 15:30 direct appen."
  },
  {
    id: "ramses-shaffy",
    name: "Zing mee met Ramses Shaffy",
    priority: "high",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "16:15 – 16:45" }
    ],
    note: "STORY: beeld bij start 16:15 direct appen. Meezingmoment — publiek in beeld! WETHOUDER za 16:30–16:45 aanwezig op het Caterplein."
  },
  {
    id: "mensen-zeggen-dingen",
    name: "Mensen Zeggen Dingen",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "13:00 – 13:30" }
    ]
  },
  {
    id: "riley-ramos",
    name: "Riley Ramos de Almeida",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "13:45 – 14:05" }
    ]
  },
  {
    id: "ballet",
    name: "Ballet uit Het Zwanenmeer en De Notenkraker",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "14:30 – 14:45" },
      { day: "za", time: "15:45 – 16:00" }
    ]
  },
  {
    id: "musical-hits",
    name: "Musical Hits",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "15:00 – 15:45" }
    ]
  },
  {
    id: "silvesters-silent",
    name: "Silvesters 'SILENT' Comedy Club",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "17:00 & 18:00" }
    ],
    note: "WETHOUDER za 17:00–17:30 aanwezig (bij de 17:00-show)."
  },
  {
    id: "hollandse-hits",
    name: "Hollandse Hits",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "17:45 – 18:15" }
    ]
  },
  {
    id: "seventies-unplugged",
    name: "The 70's Unplugged",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "za", time: "19:45 – 20:30" }
    ]
  },
  {
    id: "in-the-mood",
    name: "In The Mood",
    priority: "normal",
    location: "Grote Kerk",
    slots: [
      { day: "za", time: "13:30 – 14:00" }
    ]
  },
  {
    id: "popkoor-powerpop",
    name: "Popkoor Powerpop",
    priority: "normal",
    location: "Grote Kerk / binnenstad",
    slots: [
      { day: "za", time: "14:00 – 14:30 (Grote Kerk)" },
      { day: "za", time: "15:00 & 16:30 (binnenstad)" }
    ]
  },
  {
    id: "rechts-van-het-midden",
    name: "Rechts van het Midden",
    priority: "normal",
    location: "Grote Kerk",
    slots: [
      { day: "za", time: "15:00 – 15:30" }
    ]
  },
  {
    id: "duo-bagage",
    name: "Duo Bagage",
    priority: "normal",
    location: "Grote Kerk",
    slots: [
      { day: "za", time: "16:00 – 16:30" }
    ],
    note: "WETHOUDER za 16:00–16:20 bij het optreden in de Grote Kerk."
  },
  {
    id: "kindertheateractiviteit",
    name: "Kindertheateractiviteit met mini-workshop",
    priority: "normal",
    location: "GIGANT",
    slots: [
      { day: "za", time: "13:30 – 14:30" }
    ],
    note: "Kinderen-beeld (briefing noemt Gigant bij kinderactiviteiten)."
  },
  {
    id: "acec-open",
    name: "ACEC OPEN",
    priority: "normal",
    location: "ACEC",
    slots: [
      { day: "za", time: "Open 12:00 – 19:00" }
    ]
  },
  {
    id: "live-podcast-orpheus-jong",
    name: "Live Podcast Orpheus Jong (R)",
    priority: "normal",
    location: "Theater Orpheus",
    slots: [
      { day: "za", time: "15:45 – 16:30" }
    ],
    note: "Jonge doelgroep — goed voor de briefing-wens (jongeren in beeld)."
  },
  {
    id: "kor-hoebe",
    name: "Kor Hoebe (€)(R)",
    priority: "normal",
    location: "Theater Orpheus",
    slots: [
      { day: "za", time: "20:00 – 21:40" }
    ]
  },
  {
    id: "matthijn-buwalda",
    name: "Matthijn Buwalda Live (R)",
    priority: "normal",
    location: "Lighthouse Jongerencafé (Van Kinsbergenstraat 8)",
    slots: [
      { day: "za", time: "18:15 – 19:15" }
    ],
    note: "Flyer zegt 'binnenstad', site: jubileumavond 100 jaar Stichting Williams in het Lighthouse (aanmelden vereist). Check vooraf of je binnen mag fotograferen."
  },

  // ---------- ZONDAG ----------
  {
    id: "sokken-samba",
    name: "Sokken, Samba & Schotse Klanken",
    priority: "high",
    location: "Raadhuisplein",
    slots: [
      { day: "zo", time: "12:00 – 15:00" }
    ],
    note: "STORY: beeld bij start 12:00 direct appen."
  },
  {
    id: "theater-in-de-stad-zo",
    name: "Theater in de Stad (zondag)",
    priority: "high",
    location: "Binnenstad (Marktstraat / Oranjerie / mobiel)",
    slots: [
      { day: "zo", time: "Doe-Het-Zelf Theater — 12:30, 14:00, 15:30 (mobiel)" },
      { day: "zo", time: "Animaltroniek — 12:15, 15:00 (Grote Markthof)" },
      { day: "zo", time: "Jøttnjøl — 12:30, 14:00, 15:30" },
      { day: "zo", time: "DJ Fanfare — 12:45, 14:15, 15:45 (mobiel)" },
      { day: "zo", time: "Alex Barti Show — 13:00, 15:00 (ingang Oranjerie)" },
      { day: "zo", time: "Sisters of Soap — 13:15 – 16:15 (mobiel, Marktstraat)" }
    ],
    note: "NIET alles nodig: alleen het story-moment is vast, de rest zijn kansen voor onderweg (elke act speelt 2-3 rondes). STORY: Doe-Het-Zelf Theater 12:30 bij parkje Marktstraat direct appen."
  },
  {
    id: "anansi",
    name: "Anansi de Spin viert feest!",
    priority: "high",
    location: "Theater Orpheus",
    slots: [
      { day: "zo", time: "13:00 – 13:40" },
      { day: "zo", time: "15:00 – 15:40" }
    ],
    note: "STORY: beeld bij start 13:00 direct appen."
  },
  {
    id: "dansviool",
    name: "Vertelvoorstelling: De Dansviool van Thé Tjong-Khing",
    priority: "high",
    location: "CODA",
    slots: [
      { day: "zo", time: "14:00" },
      { day: "zo", time: "15:00" }
    ],
    note: "STORY: beeld bij start 14:00 direct appen."
  },
  {
    id: "stadsoase",
    name: "StadsOase: Dio + BEATS BY BUNKER",
    priority: "high",
    location: "GIGANT / Van Reekumplein",
    slots: [
      { day: "zo", time: "14:00 – 22:00 (doorlopend)" },
      { day: "zo", time: "BEATS BY BUNKER — 15:15 – 16:00" },
      { day: "zo", time: "Dio — 17:00 – 17:45" }
    ],
    note: "STORY: briefing zegt 14:30 — programma start om 14:00, dus 14:30 is prima voor sfeerbeeld. Jonge doelgroep!"
  },
  {
    id: "steven-faber",
    name: "Steven Faber Trio",
    priority: "high",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "zo", time: "15:00 – 15:45" }
    ],
    note: "STORY: beeld bij start 15:00 direct appen."
  },
  {
    id: "magische-kast",
    name: "Huubs Magische Kast",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "zo", time: "14:00 – 14:45" }
    ],
    note: "Kinderen-beeld."
  },
  {
    id: "broodje-aap",
    name: "Broodje Aap",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "zo", time: "16:00 – 16:30" }
    ]
  },
  {
    id: "bert-louissen",
    name: "Bert Louissen",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "zo", time: "16:45 – 17:15" }
    ]
  },
  {
    id: "john-denver",
    name: "A Tribute To John Denver",
    priority: "normal",
    location: "Caterplein, buitenpodium",
    slots: [
      { day: "zo", time: "17:30 – 18:00" }
    ]
  },
  {
    id: "zondagmiddagconcerten",
    name: "Zondagmiddagconcerten",
    priority: "normal",
    location: "Oranjepark",
    slots: [
      { day: "zo", time: "14:00 – 17:00" }
    ]
  },
  {
    id: "mini-play-in",
    name: "Mini Play In — ervaar een orkestrepetitie",
    priority: "normal",
    location: "Grote Kerk",
    slots: [
      { day: "zo", time: "Start 13:30 | Concert 16:00" }
    ],
    note: "Repetitieproces + slotconcert — leuk verhaal in twee beelden."
  },
  {
    id: "njon-orpheus",
    name: "NJON Presenteert in Theater Orpheus",
    priority: "normal",
    location: "Theater Orpheus",
    slots: [
      { day: "zo", time: "14:00 – 14:45" }
    ]
  },
  {
    id: "open-podium",
    name: "Open Podium",
    priority: "normal",
    location: "Theater Orpheus",
    slots: [
      { day: "zo", time: "15:00 – 16:30" }
    ]
  },
  {
    id: "orpheus-safari",
    name: "Orpheus Safari (R)",
    priority: "normal",
    location: "Theater Orpheus",
    slots: [
      { day: "zo", time: "10:30 – 11:30" },
      { day: "zo", time: "13:00 – 14:00" },
      { day: "zo", time: "14:30 – 15:30" },
      { day: "zo", time: "16:00 – 17:00" }
    ]
  },
  {
    id: "frits-verduin",
    name: "Theatervoorstelling Frits (over Frits Verduin)",
    priority: "normal",
    location: "CODA",
    slots: [
      { day: "zo", time: "15:00 – 16:30" }
    ]
  },

  // ---------- DOORLOPEND / MEERDERE DAGEN ----------
  {
    id: "etalageroute",
    name: "Etalageroute Apeldoorn (18 etalages)",
    priority: "conditional",
    location: "Binnenstad (o.a. Hoofdstraat, Marktstraat, Beekstraat)",
    slots: [
      { day: "vr", time: "Doorlopend" },
      { day: "za", time: "Doorlopend" },
      { day: "zo", time: "Doorlopend" }
    ],
    note: "ALLEEN fotograferen mét mensen die echt naar het kunstwerk in de etalage kijken (anders niet) — etalage en omgeving herkenbaar in beeld. WETHOUDER za 13:00–13:20 Binnenstad-Zuid (o.a. Guusje, Nawijn & Polak, Flierefluiter) en 14:20–14:30 Binnenstad-Noord (Lab02, Koafe, Bar Goût, Alfred Kookt) langs de etalages."
  },
  {
    id: "pim-pom",
    name: "Pim & Pom Festival (€)(R)",
    priority: "high",
    location: "Zwitsalhal",
    slots: [
      { day: "vr", time: "Open 09:00 – 16:30" },
      { day: "za", time: "Open 09:00 – 16:30" },
      { day: "zo", time: "Open 09:00 – 16:30" }
    ],
    note: "Kinderactiviteiten-highlight uit de briefing. Let extra op toestemming bij herkenbare kinderen."
  },
  {
    id: "hoe-het-nu",
    name: "Hoe = Het Nu 2026 (expositie)",
    priority: "high",
    location: "ACEC",
    slots: [
      { day: "vr", time: "Open 12:00 – 17:00" },
      { day: "za", time: "Open 12:00 – 19:00" },
      { day: "zo", time: "Open 12:00 – 17:00" }
    ],
    note: "Kunst-highlight: 'verwonderende mensen' bij de kunst vastleggen, niet alleen het werk."
  },
  {
    id: "coda-museum",
    name: "CODA Museum & exposities",
    priority: "high",
    location: "CODA",
    slots: [
      { day: "vr", time: "Open 10:00 – 17:30" },
      { day: "za", time: "Open 10:00 – 17:00 (gratis toegang)" },
      { day: "zo", time: "Open 10:00 / 11:00 – 17:00" }
    ],
    note: "Kroon op de taart! (kids), PRISMA — De keuze van Rikkie Kollé, WINWIN Hester Oerlemans, Cinema Khing, Mini-uitgeverij. Kunst-highlight: verwonderende bezoekers in beeld. WETHOUDER za 15:00–15:50 bij CODA: prijsuitreiking WRYTA aan Merlijn Toby (actieve rol) — fotomoment."
  },
  {
    id: "verenigde-apeldoorners",
    name: "Tentoonstelling Verenigde Apeldoorners",
    priority: "normal",
    location: "Theehuis Berg & Bos",
    slots: [
      { day: "vr", time: "Open 07:00 – 21:00 (vrije inloop)" },
      { day: "za", time: "Open 07:00 – 21:00 (vrije inloop)" },
      { day: "zo", time: "Open 07:00 – 21:00 (vrije inloop)" }
    ],
    note: "Tentoonstelling, geen optreden — hele dag te bezoeken. Buiten de binnenstad, alleen als de route het toelaat."
  },
  {
    id: "informatiewinkel",
    name: "Informatiewinkel Platform Amateurkunst",
    priority: "normal",
    location: "Hoofdstraat 141",
    slots: [
      { day: "za", time: "Doorlopend" }
    ]
  }
];

// ============================================================
// KLUS 2: Bedrijfsvideo (lijmproductie, panden 5/7/9)
// Bron: Bedrijfsvideo_shots.xlsx (tabbladen "shots" en "akkoord").
// doneMode "all": een blok is pas klaar als álle shots binnen zijn.
// ============================================================

const BEDRIJFSVIDEO_ACTS = [
  {
    id: "productie-label",
    name: "Productie: labelen",
    priority: "high",
    location: "Pand 5",
    slots: [
      { day: "dag", time: "08:15 · Labelrol wordt in de labelmachine geïnstalleerd (50 ml & 220 ml) — Salih" },
      { day: "dag", time: "08:15 · De machine wordt bediend — Salih" },
      { day: "dag", time: "08:15 · Verschillende labelmachines in actie (50 ml & 220 ml)" },
      { day: "dag", time: "08:15 · Cartridges (50 & 220 ml) worden in een krat gestopt — Salih" },
      { day: "dag", time: "08:15 · Close-ups: cartridges in doos + doos dichttapen (camera ín de doos!)" }
    ],
    note: "LET OP: Salih = akkoord maar NIET herkenbaar in beeld (handen/rug). Beschikbare labels: Plastgrip ME 6520B (50ml), 6523B & 6525B (220ml), 2K-Epoxy 6160B (195ml), MMA 6207W (220ml), 6203C (50ml)."
  },
  {
    id: "logistiek-sealen",
    name: "Logistiek: pallets sealen",
    priority: "high",
    location: "Pand 5",
    slots: [
      { day: "dag", time: "09:15 · Pallets met dozen worden geseald — Bert" }
    ],
    note: "Maandag checken bij Bert hoe we dit het beste kunnen doen."
  },
  {
    id: "productie-vullen",
    name: "Productie: vullen",
    priority: "high",
    location: "Pand 7",
    slots: [
      { day: "dag", time: "09:30 · Cartridges (24/50/195/220 ml) gaan door de vulmachine" },
      { day: "dag", time: "09:30 · De dop gaat erop — Hans Hoegen, Adje" },
      { day: "dag", time: "09:30 · Volle cartridges worden in een krat gelegd — Hans Hoegen, Adje" }
    ],
    note: "LET OP: Hans Hoegen én Adje = akkoord maar NIET herkenbaar in beeld — film handen/rug/detail."
  },
  {
    id: "opslag",
    name: "Opslag",
    priority: "high",
    location: "Pand 7",
    slots: [
      { day: "dag", time: "±09:30-blok · Hans Hoegen rijdt met heftruck langs de stellingen — regie: Bert" },
      { day: "dag", time: "±09:30-blok · Close-ups van lege cartridges en onderdelen in doos of krat" }
    ],
    note: "LET OP: Hans Hoegen mag NIET herkenbaar — film de heftruck van achteren/afstand of onherkenbaar."
  },
  {
    id: "training",
    name: "Training",
    priority: "high",
    location: "Pand 9 — trainingsruimte",
    slots: [
      { day: "dag", time: "10:30 · Brent geeft een training — Brent + figurant" }
    ],
    note: "Zwarte handschoenen + lijm klaarleggen."
  },
  {
    id: "klantafspraak",
    name: "Klantafspraak",
    priority: "high",
    location: "Pand 9 — boardroom",
    slots: [
      { day: "dag", time: "±10:30-blok · Klant komt binnen in de boardroom en geeft Brent een hand — Brent + figurant" }
    ]
  },
  {
    id: "kantoor",
    name: "Kantoor",
    priority: "high",
    location: "Pand 9",
    slots: [
      { day: "dag", time: "±10:30-blok · Kantoorwerkzaamheden: salesoverleg, werken achter de computer, sales + R&D kijken samen mee — Theo, Joeri, Bertus, Jarno" },
      { day: "dag", time: "±10:30-blok · Theo is aan het bellen op kantoor — Theo" }
    ]
  },
  {
    id: "rd",
    name: "R&D",
    priority: "high",
    location: "Pand 9 — lab",
    slots: [
      { day: "dag", time: "11:30 · Collega's gebruiken machines: labmenger (zwart), trekbank lapshears (zwart), dumbells (grijs), kokers in klimaatkast, zuurkast, UV-kast (wit) — Jarno, Mathijs (Bertus)" },
      { day: "dag", time: "11:30 · Werken aan lange tafel, iemand loopt door de ruimte; 200 gr potje vullen met vloeistoffen en poeders in verschillende kleuren — Jarno, Mathijs (Bertus)" }
    ],
    note: "Klaarleggen: poeders, weegschaal, kleurpigment, vloeistoffen. Eventueel plantenspuit meenemen."
  },
  {
    id: "qc",
    name: "QC (kwaliteitscontrole)",
    priority: "high",
    location: "Pand 9",
    slots: [
      { day: "dag", time: "±11:30-blok · Infraroodscan, viscositeitsmeting door Bertus (zwart), controle cartridge: testen op naloop, uitspuiten (400 of 600 ml) — Bertus (Jarno), Arent" },
      { day: "dag", time: "±11:30-blok · Bertus loopt met clipboard naar de mengafdeling en overlegt met Arent" }
    ],
    note: "Infraroodscan-software staat alléén op de laptop van Bertus."
  },
  {
    id: "productie-mengen",
    name: "Productie: mengen",
    priority: "high",
    location: "Pand 9 (→ 7)",
    slots: [
      { day: "dag", time: "±11:30-blok · Gemengde lijm gaat van productie naar pand 7 — buitenshot: heftruck rijdt van 9 naar 7 — Paul" },
      { day: "dag", time: "±11:30-blok · Paul haalt grondstof met heftruck en rijdt naar de weegschaal — Paul" },
      { day: "dag", time: "±11:30-blok · Grondstoffen gaan in de ketel: vloeistof en poeders — Arent, Brian" },
      { day: "dag", time: "±11:30-blok · Ketel wordt onder de mengmachine geschoven — Arent, Brian" },
      { day: "dag", time: "±11:30-blok · Lijm mengen, zichtbaar door het raampje" },
      { day: "dag", time: "±11:30-blok · Mengmachine gaat open en dicht, Arent bedient het paneel — Arent" },
      { day: "dag", time: "±11:30-blok · Afdrummen" }
    ],
    note: "LET OP: toestemming van Paul is nog onbekend (?) — hij is maandag terug van vakantie. Eerst checken vóór hij herkenbaar in beeld komt."
  },
  {
    id: "drone-panden",
    name: "Drone: panden",
    priority: "conditional",
    location: "Buiten — panden 5, 7 & 9",
    slots: [
      { day: "dag", time: "Wanneer de zon doorkomt · Drone-totaalshot van alle 3 de panden" },
      { day: "dag", time: "Wanneer de zon doorkomt · Drone-shot van Eddie en Brent voor het pand — Eddie, Brent" }
    ],
    note: "Alleen bij zon. LET OP: toestemming van Eddie is nog onbekend (?) — eerst checken."
  }
];

const BEDRIJFSVIDEO_INFO = {
  title: "Toestemming figuranten (uit akkoord-lijst)",
  groups: [
    {
      label: "✅ Akkoord — herkenbaar in beeld mag",
      names: ["Alex", "Amber", "Arent", "Bert", "Bertus", "Brent", "Brian", "Jarno", "Joeri", "Marc", "Mascha", "Matthijs", "Theo"]
    },
    {
      label: "⚠️ Akkoord, maar NIET herkenbaar in beeld",
      names: ["Adje", "Hans Hoegen", "Salih"]
    },
    {
      label: "❌ GEEN akkoord — niet in beeld",
      names: ["Jolande", "Kees"]
    },
    {
      label: "❓ Toestemming nog onbekend — eerst checken",
      names: ["Eddie", "Grietje", "Jan-Willem", "Paul (ma terug van vakantie)"]
    },
    {
      label: "⬜ Nog niet gevraagd",
      names: ["Elroy", "Gertie", "Richard", "Vincent"]
    },
    {
      label: "🚫 Niet aanwezig",
      names: ["Charlotte", "Dorieke", "Elles", "Hans de Haan", "Jasper", "Kitty", "Pablo", "Sanne"]
    }
  ]
};

// ============================================================
// KLUS 3: Univé adviseursvideo's (LinkedIn kennisvideo's, USL)
// Bron: PDF "Univé LinkedIn adviseursvideo's" (draaiboek wo 26 aug 2026
// + scripts) en Google Doc met definitieve autocue-teksten.
// 3 adviseurs × 3 onderwerpen (verzuim, cybercrime, batterijopslag),
// ochtend kantoor USL (verzekeringswinkel), middag Your Own Studio.
// ============================================================

const UNIVE_ACTS = [
  {
    id: "setup-kantoor",
    name: "Opbouw & verkenning kantoor USL",
    priority: "normal",
    location: "Kantoor USL — Christiaan Geurtsweg 8",
    slots: [
      { day: "dag", time: "08:30 – 09:00 · Locatie verkennen + apparatuur klaarzetten (Fatma, Leroy, Jeroen, Jorrit)" }
    ]
  },
  {
    id: "logo-pand",
    name: "Opening: Univé-logo & pand",
    priority: "high",
    location: "Buiten — pand USL Apeldoorn",
    slots: [
      { day: "dag", time: "±08:45 · Shot Univé-logo voor het pand, doordraai naar de verzekeringswinkel" }
    ],
    note: "Dit is het openingsshot van élk script — één keer goed schieten is genoeg, herbruikbaar voor alle 9 video's."
  },
  {
    id: "miranda-kantoor",
    name: "Miranda — kantoor/winkel",
    priority: "high",
    location: "Kantoor USL — verzekeringswinkel",
    slots: [
      { day: "dag", time: "09:00 – 10:00 · Verzuim: hook in winkel (kijkt in camera) → loopt/leunt op balie → shot met Univé-signing" },
      { day: "dag", time: "09:00 – 10:00 · Cybercrime: hook in winkel → balie → signing-shot (titel: AI-risico's)" },
      { day: "dag", time: "09:00 – 10:00 · Batterijopslag: hook in winkel (wijst naar boven) → balie → signing-shot" }
    ],
    note: "Miranda aanwezig 08:45. Autocue-teksten staan in de Info-tab."
  },
  {
    id: "jacqueline-kantoor",
    name: "Jacqueline — kantoor/winkel",
    priority: "high",
    location: "Kantoor USL — verzekeringswinkel",
    slots: [
      { day: "dag", time: "10:00 – 11:00 · Verzuim: hook in winkel → balie → signing-shot" },
      { day: "dag", time: "10:00 – 11:00 · Cybercrime: hook in winkel → balie → signing-shot (titel: AI-risico's)" },
      { day: "dag", time: "10:00 – 11:00 · Batterijopslag: hook in winkel (wijst naar boven) → balie → signing-shot" }
    ],
    note: "Jacqueline aanwezig 09:45."
  },
  {
    id: "wilrieke-kantoor",
    name: "Wilrieke — kantoor/winkel",
    priority: "high",
    location: "Kantoor USL — verzekeringswinkel",
    slots: [
      { day: "dag", time: "11:00 – 12:00 · Verzuim: hook in winkel → balie → signing-shot" },
      { day: "dag", time: "11:00 – 12:00 · Cybercrime: hook in winkel → balie → signing-shot (titel: AI-risico's)" },
      { day: "dag", time: "11:00 – 12:00 · Batterijopslag: hook in winkel (wijst naar boven) → balie → signing-shot" }
    ],
    note: "Wilrieke aanwezig 10:45. Daarna 12:00 – 13:00 uitloop & lunch bij Your Own Studio."
  },
  {
    id: "props-studio",
    name: "Props klaarzetten studio (Jorrit)",
    priority: "normal",
    location: "Your Own Studio — Jean Monnetpark 73",
    slots: [
      { day: "dag", time: "10:30 – 11:30 · Props klaarzetten in de studio" }
    ]
  },
  {
    id: "miranda-studio",
    name: "Miranda — studio",
    priority: "high",
    location: "Your Own Studio (witte achtergrond)",
    slots: [
      { day: "dag", time: "13:00 – 14:30 · Verzuim: zit op kruk/stoel → staat op + stappen → afsluiter: wijst in camera" },
      { day: "dag", time: "13:00 – 14:30 · Cybercrime: kruk → opstaan + stappen → wijst in camera" },
      { day: "dag", time: "13:00 – 14:30 · Batterijopslag: kruk → opstaan + stappen → wijst in camera" }
    ],
    note: "Witte achtergrond; grafische elementen/titels komen in post. Ruimte laten in het kader."
  },
  {
    id: "wilrieke-studio",
    name: "Wilrieke — studio",
    priority: "high",
    location: "Your Own Studio (witte achtergrond)",
    slots: [
      { day: "dag", time: "14:30 – 16:00 · Verzuim: kruk → opstaan + stappen → wijst in camera" },
      { day: "dag", time: "14:30 – 16:00 · Cybercrime: kruk → opstaan + stappen → wijst in camera" },
      { day: "dag", time: "14:30 – 16:00 · Batterijopslag: kruk → opstaan + stappen → wijst in camera" }
    ]
  },
  {
    id: "jacqueline-studio",
    name: "Jacqueline — studio",
    priority: "high",
    location: "Your Own Studio (witte achtergrond)",
    slots: [
      { day: "dag", time: "16:00 – 17:30 · Verzuim: kruk → opstaan + stappen → wijst in camera" },
      { day: "dag", time: "16:00 – 17:30 · Cybercrime: kruk → opstaan + stappen → wijst in camera" },
      { day: "dag", time: "16:00 – 17:30 · Batterijopslag: kruk → opstaan + stappen → wijst in camera" }
    ]
  }
];

const UNIVE_INFO = {
  title: "Univé adviseursvideo's — wo 26 augustus",
  groups: [
    {
      label: "📋 Draaiboek",
      text: "08:30 – 09:00  Verkenning kantoor USL, apparatuur klaarzetten (Fatma, Leroy, Jeroen, Jorrit)\n08:45  Miranda aanwezig\n09:00 – 10:00  Opnames kantoor — Miranda\n09:45  Jacqueline aanwezig\n10:00 – 11:00  Opnames kantoor — Jacqueline\n10:30 – 11:30  Props klaarzetten studio (Jorrit)\n10:45  Wilrieke aanwezig\n11:00 – 12:00  Opnames kantoor — Wilrieke\n12:00 – 13:00  Uitloop & lunch (Your Own Studio)\n13:00 – 14:30  Studio — Miranda\n14:30 – 16:00  Studio — Wilrieke\n16:00 – 17:30  Studio — Jacqueline"
    },
    {
      label: "📍 Locaties",
      text: "Kantoor Univé Stad en Land: Christiaan Geurtsweg 8, 7335 JV Apeldoorn\nYour Own Studio: Jean Monnetpark 73, 7336 BB Apeldoorn"
    },
    {
      label: "📞 Contactpersonen",
      text: "Fatma Aydoğdu (USL): 06-18785877\nLeroy Filon (Wijzijnwolf.nl): 06-46158387\nJeroen Hardenberg (Creators Connect): 06-53769558\nJorrit Drieënhuizen (Social Selling Coach): 06-57481119"
    },
    {
      label: "🎥 Specs",
      text: "Verticaal · max 1 minuut · dynamisch (paar standpunten) · ondertiteld · eindkaart. Univé-beeldmerk komt rechtsboven in beeld — hou die hoek vrij."
    },
    {
      label: "🗒️ Autocue — Verzuim",
      text: "WINKEL:\nHeb jij veel zieke medewerkers? Je bent niet de enige.\nHet landelijk ziekteverzuim kost de samenleving zo'n 29 miljard euro! Voor jou betekent het extra werkdruk, meer kosten en soms zelfs omzetverlies.\nEn weet je wat nou zo jammer is? De aandacht gaat vooral naar het begeleiden van dat verzuim. Maar voorkomen is nog altijd beter dan genezen.\n\nSTUDIO:\nDrukte, gedoe thuis, gebrek aan scherpte: daar begint het vaak mee. Ik zie dat veel bij mijn eigen klanten. Het zijn de eerste signalen.\nAls je daar scherp op bent, voorkom je al heel wat. Denk er eens over na: wanneer heb je voor het laatst gevraagd hoe het écht met je collega's gaat?\nOp de langere termijn is het slim om te investeren in mentale gezondheid, vitaliteit en duurzame inzetbaarheid. Al snel goedkoper dan een uitgebreid re-integratietraject. En je krijgt er blije medewerkers van! Meer weten? Ik denk graag met je mee."
    },
    {
      label: "🗒️ Autocue — Cybercrime",
      text: "WINKEL:\nHet gaat keihard met AI. Je bent er vast al volop mee bezig. Bijvoorbeeld om tijd te besparen of processen te optimaliseren. Maar kijk je ook weleens naar de risico's?\nDe ontwikkelingen gaan zo snel, dat de beveiliging en het bewustzijn onder collega's bij veel bedrijven achterlopen.\nIk zie het regelmatig. Gevoelige bedrijfsinformatie die zomaar in een AI-tool verdwijnt. Klantgegevens die in een openbare database belanden: dat wil je niet!\n\nSTUDIO:\nWacht niet tot er iets misgaat, maar kom snel in actie. Maak bijvoorbeeld duidelijke afspraken over AI-gebruik in het bedrijf. En zorg dat je mensen zich bewust worden van de risico's. Techniek houdt veel tegen, maar de zwakste schakel is meestal gewoon een mens met iets te veel haast.\nCheck ook of een cyberverzekering bij jouw onderneming past. Of doe onze gratis Cyber Fit Service.\nMeer weten? Ik help je graag op weg."
    },
    {
      label: "🗒️ Autocue — Batterijopslag",
      text: "WINKEL:\nHeb je zonnepanelen op het dak van je bedrijf? Dan heb je er misschien ook wel eens aan gedacht om al die opgewekte energie op te slaan. Batterijen worden steeds interessanter, ook voor ondernemers. Niet zo gek want de energieprijzen rijzen de pan uit. En je stroom terugleveren voor een habbekrats? Dat klinkt niet erg aanlokkelijk. Dus installeren maar, zo'n energie-opslag-systeem! Slim én duurzaam. Toch? Nou, er zitten wel wat addertjes onder het gras.\n\nSTUDIO:\nWant niet elk EOS-systeem is automatisch verzekerbaar. Er zijn eisen aan de plaatsing, de installatie, de beveiliging. Dat wil je helder in kaart hebben. Mijn advies? Betrek je installateur, je verzekeraar en eventueel je verhuurder vóóraf bij je plannen. Vraag na welke eisen er gelden. Dat voorkomt discussie als er ooit schade komt. Want verduurzamen is belangrijk, maar laten we het wel veilig doen. En dus goed verzekerbaar. Zullen we samen eens door je plannen lopen?"
    }
  ]
};

// ============================================================
// KLUS 4: Apeldoorn Business Awards 2026 (bedrijfsbezoeken)
// 18 genomineerden, geclusterd op geografie vanaf startpunt
// Oranjelaan 2. Adressen geverifieerd via bedrijfssites + officiële
// stemlijst (stemmen.apeldoornbusinessawards.nl), geocodering OSM.
// Per bedrijf 3 statussen: Gemaild → Bevestigd → Gefilmd (doneMode all).
// act.order = routevolgorde (sortering 'Tijd' volgt deze volgorde).
// ============================================================

function abaAct(order, id, name, cat, cluster, addr, email, tel, note) {
  return {
    id, order,
    name,
    priority: "normal",
    location: `${cluster} — ${addr}`,
    slots: [
      { day: "dag", time: "Gemaild" },
      { day: "dag", time: "Bevestigd" },
      { day: "dag", time: "Gefilmd" }
    ],
    note: `${cat} · ${email} · ${tel}${note ? " · " + note : ""}`
  };
}

const ABA_ACTS = [
  // Cluster A — Centrum (alles op loopafstand van Oranjelaan 2, ±2 km totaal)
  abaAct(1, "aba-de-kap", "De Kap", "Maatschappelijke Organisaties", "A · Centrum", "Regentesselaan 2B, Apeldoorn", "info@dekap.nl", "055 529 55 20", "Contact: Lineke Maat · 300 m van je startpunt"),
  abaAct(2, "aba-zenzez", "ZenZeZ Hotel & Lounge", "Horeca en Toerisme", "A · Centrum", "Canadalaan 26, Apeldoorn", "info@zenzezhotel.nl", "055 522 24 33", "Contact: Petra Bangma"),
  abaAct(3, "aba-tm-vastgoed", "TM Vastgoedpromotie", "Starters", "A · Centrum", "Paslaan 9B, Apeldoorn", "info@tmvastgoedpromotie.nl", "055 234 08 10", "Contact: Taina Monteiro"),
  abaAct(4, "aba-teun", "Teun", "Horeca en Toerisme", "A · Centrum", "Kapelstraat 5, Apeldoorn", "info@teunapeldoorn.nl", "06 20 69 02 06", "Contact: Elise Teunissen · Feestlocatie, alleen op afspraak open — afspraak dus essentieel"),
  abaAct(5, "aba-mr-boost", "Mr Boost", "Groothandel en Dienstverlening", "A · Centrum", "Leienplein 5, Apeldoorn", "dennis@mrboost.nl", "06 37 34 45 70", "Contact: Dennis Kraus"),
  abaAct(6, "aba-sandmann", "Sandmann Optiek", "Detailhandel", "A · Centrum", "Mariastraat 4, Apeldoorn", "blij@sandmannoptiek.nl + paul@sandmannoptiek.nl", "055 521 74 67", "Contact: Paul Mol & Patrick Sterenberg · LET OP: verhuisd van Hoofdstraat naar Mariastraat 4; maandag gesloten"),
  abaAct(7, "aba-house-of-tall", "House of Tall", "Detailhandel", "A · Centrum", "Brinklaan 9-11, Apeldoorn", "inez.scheper@houseoftall.nl", "055 301 77 23", "Contact: Inez Scheper · Nieuwe winkel (sinds feb 2026)"),

  // Cluster B — Zuid (RTV → VRM → SPL → Cabinespecialist → Spelderholt, ±10 km)
  abaAct(8, "aba-rtv", "RTV Apeldoorn", "Maatschappelijke Organisaties", "B · Zuid", "Arnhemseweg 82, Apeldoorn", "stationmanager@rtv-apeldoorn.nl", "055 533 51 66", "Contact: Theo Witlox"),
  abaAct(9, "aba-vrm", "VRM (Van Reekum Materials)", "Industrie en Technologie", "B · Zuid", "Oude Apeldoornseweg 36, Apeldoorn", "f.padmos@vrm.nl", "055 533 54 66", "Contact: Fernando Padmos"),
  abaAct(10, "aba-spl", "SPL (Scholten Panelen)", "Industrie en Technologie", "B · Zuid", "Curacao 42, Apeldoorn", "verkoop@scholtenpanelen.nl", "055 505 14 41", "Contact: Frans Kuijpers · Pal tegenover De Cabinespecialist — combineer"),
  abaAct(11, "aba-cabinespecialist", "De Cabinespecialist", "Industrie en Technologie", "B · Zuid", "Curacao 41, Apeldoorn", "m.huiskamp@cabinespecialist.nl", "055 533 48 77", "Contact: Martijn & Hans Huiskamp · Pal tegenover SPL — combineer"),
  abaAct(12, "aba-spelderholt", "Parc Spelderholt", "Maatschappelijke Organisaties", "B · Zuid", "Spelderholt 9, Beekbergen", "info@parcspelderholt.nl", "055 506 88 00", "Contact: Robert Porskamp · Beekbergen, eindpunt van de zuidroute"),

  // Cluster C — Noord & Oost (Kabath → STOOM → Peroli → Talen → Retro Empire, ±11 km)
  abaAct(13, "aba-kabath", "De Kabath", "Groothandel en Dienstverlening", "C · Noord & Oost", "Kanaalpad 69, Apeldoorn", "info@dekabath.nl", "085 130 64 94", "Contact: Joost Hamming"),
  abaAct(14, "aba-stoom", "STOOM", "Horeca en Toerisme", "C · Noord & Oost", "Vlijtseweg 114, Apeldoorn", "info@stoom-apeldoorn.nl", "06 14 46 81 82", "Contact: Sabine de Jong & Chiel van Tongeren · Ketelhuis Zwitsal-terrein"),
  abaAct(15, "aba-peroli", "Peroli", "Starters", "C · Noord & Oost", "Lage Kamp 4-2, Apeldoorn", "info@peroli.nl", "06 28 26 99 10", "Contact: Rudo Baksteen"),
  abaAct(16, "aba-talen", "Talen Vastgoed", "Groothandel en Dienstverlening", "C · Noord & Oost", "Laan van de Kreeft 180, Apeldoorn", "info@talen.nl", "055 529 82 98", "Contact: Emiel Talen"),
  abaAct(17, "aba-retro-empire", "Retro Empire Gaming", "Starters", "C · Noord & Oost", "Eglantier 141, Apeldoorn (wc De Eglantier)", "hr@retro-empire.nl", "06 34 00 75 74", "Contact: Remy & Judith van de Scheur · Winkelcentrum De Maten — slotstop van de noordroute"),

  // Cluster D — uitschieter west
  abaAct(18, "aba-fonteyn", "De Fonteyn", "Detailhandel", "D · Uddel", "Meervelderweg 52, Uddel", "dolf@fonteyn.nl", "0577 456 040", "Contact: Dolf Nieland · ±20 min rijden — apart inplannen of aan een route vastplakken"),
  // Studenten (uit adressenlijst klant, 27 aug 2026)
  abaAct(19, "aba-getnailed", "GetNailed JMC", "Studenten", "S · Studenten", "Molenstraat-Centrum 263, Apeldoorn", "info@getnailedjmc.nl", "-", "Contact: Jeppe Marce · Ligt in het centrum — kan makkelijk mee met Route A"),
  abaAct(20, "aba-nxtlvl", "NXT LVL Dansstudio", "Studenten", "S · Studenten", "Leslocatie: GIGANT, Nieuwstraat 377, Apeldoorn", "info@nextleveldansstudio.nl", "-", "Contact: Daan Aggenbach · Eigen vestigingsadres niet gepubliceerd — filmen op leslocatie GIGANT (centrum)"),
  abaAct(21, "aba-muteba", "Muteba Fitt", "Studenten", "S · Studenten", "Adres onbekend — opvragen bij ondernemer", "info@mutebafitt.com", "-", "Contact: Aaron Muteba Beya · Vestigingsadres niet gepubliceerd, eerst adres opvragen")
];

const ABA_INFO = {
  title: "ABA 2026 — routes vanaf Oranjelaan 2",
  groups: [
    {
      label: "Routes (open in Google Maps)",
      links: [
        { label: "Route A · Centrum (7 stops, 2 km — lopend/fiets)", url: "https://www.google.com/maps/dir/Oranjelaan+2,+Apeldoorn/Regentesselaan+2B,+Apeldoorn/Canadalaan+26,+Apeldoorn/Paslaan+9,+Apeldoorn/Kapelstraat+5,+Apeldoorn/Leienplein+5,+Apeldoorn/Mariastraat+4,+Apeldoorn/Brinklaan+9,+Apeldoorn" },
        { label: "Route B · Zuid (5 stops, 10 km)", url: "https://www.google.com/maps/dir/Oranjelaan+2,+Apeldoorn/Arnhemseweg+82,+Apeldoorn/Oude+Apeldoornseweg+36,+Apeldoorn/Curacao+42,+Apeldoorn/Curacao+41,+Apeldoorn/Spelderholt+9,+Beekbergen" },
        { label: "Route C · Noord & Oost (5 stops, 11 km)", url: "https://www.google.com/maps/dir/Oranjelaan+2,+Apeldoorn/Kanaalpad+69,+Apeldoorn/Vlijtseweg+114,+Apeldoorn/Lage+Kamp+4,+Apeldoorn/Laan+van+de+Kreeft+180,+Apeldoorn/Eglantier+141,+Apeldoorn" },
        { label: "Route D · De Fonteyn, Uddel (13 km)", url: "https://www.google.com/maps/dir/Oranjelaan+2,+Apeldoorn/Meervelderweg+52,+Uddel" }
      ]
    },
    {
      label: "Dagindeling (voorstel)",
      text: "Dag 1 — Route A · Centrum: 7 bedrijven op loopafstand, à 45 min ben je de dag zoet.\nDag 2 — Route B · Zuid: RTV → VRM → SPL + Cabinespecialist (tegenover elkaar!) → Parc Spelderholt.\nDag 3 — Route C · Noord & Oost: De Kabath → STOOM → Peroli → Talen → Retro Empire.\nDe Fonteyn (Uddel, 20 min): apart moment of als vroege start vóór een route.\n\nWerkwijze per bedrijf: max 45 min sfeerbeelden, afsluiten met juichshot van het team, video krijgt voice-over."
    },
    {
      label: "Aandachtspunten",
      text: "Contactpersonen en e-mailadressen komen uit de adressenlijst van de klant (27 aug 2026) — die is leidend.\nSandmann Optiek is verhuisd: NIET Hoofdstraat maar Mariastraat 4. Maandag gesloten.\nTeun is een feestlocatie, alleen op afspraak open — zonder bevestiging niet langsgaan.\nHouse of Tall zit sinds feb 2026 op Brinklaan 9-11.\nSPL en De Cabinespecialist liggen tegenover elkaar — plan aansluitend.\nStudenten: GetNailed JMC en NXT LVL (leslocatie GIGANT) zitten allebei in het centrum — kunnen mee met Route A. Muteba Fitt: eerst adres opvragen.\nConcept-mail 2026 staat klaar in Gmail Drafts (BCC volgens klantlijst)."
    }
  ]
};

// ============================================================
// KLUS 5: De Passerel — onboarding-/wervingsvideo's
// Bron: "Onboarding script AH" (3 scripts: welkomstvideo ±3:30,
// De Passerel in 1 minuut, wervingsvideo ±1:20) + draaidagen klant.
// Shots per locatie gegroepeerd zodat je voor alle 3 video's
// tegelijk schiet. Overal 30 min vooraf aanwezig.
// ============================================================

const PASSEREL_ACTS = [
  // ---------- MA 8 SEP · ORDEN (Wonen / volwassenen) ----------
  {
    id: "ps-orden-setup", order: 1,
    name: "Orden — aankomst & opbouw",
    priority: "normal",
    location: "Ordenplein 56, Apeldoorn",
    slots: [ { day: "d8", time: "14:30 aanwezig · filmen 15:00 – 19:00" } ],
    note: "Wonen / volwassenenzorg. Kennismaken met begeleiders en bewoners vóór je draait — rustig opstarten werkt hier het best."
  },
  {
    id: "ps-orden-begeleiding", order: 2,
    name: "Orden — begeleiding (kernshots)",
    priority: "high",
    location: "Ordenplein 56 — woonsetting",
    slots: [
      { day: "d8", time: "Warm contact close-up: hand op schouder, oogcontact, kleine glimlach (opener 1-min video)" },
      { day: "d8", time: "Dagelijks moment: begeleider helpt cliënt (ontbijt/avondeten, jas aantrekken, activiteit starten)" },
      { day: "d8", time: "Eén-op-één begeleiding: aandachtig luisteren, bevestigende knik, kleine lach" },
      { day: "d8", time: "Geduld & groei: begeleider wacht bewust, cliënt zet zelf een stap — iets lukt, hoe klein ook" },
      { day: "d8", time: "Structuur & vertrouwen: begeleider legt uit, helpt bij planning — rustige stabiele shots" }
    ],
    note: "Dit zijn de dragende beelden van alle 3 de video's. Rustig gefilmd, geen snelle montagebeelden."
  },
  {
    id: "ps-orden-momenten", order: 3,
    name: "Orden — kleine momenten & sfeer",
    priority: "high",
    location: "Ordenplein 56 — binnen & buiten",
    slots: [
      { day: "d8", time: "Goed gesprek: zittend naast elkaar" },
      { day: "d8", time: "Samen iets maken of koken" },
      { day: "d8", time: "Korte wandeling / gezamenlijke lach" },
      { day: "d8", time: "Doelgroep-shot: volwassene in woonsetting of gesprek (voor doelgroepen-sequentie)" },
      { day: "d8", time: "Eindshot-optie: medewerker en cliënt samen, weglopend of naast elkaar (ruimte voor logo)" }
    ]
  },
  {
    id: "ps-orden-team", order: 4,
    name: "Orden — team & echte werkmomenten",
    priority: "high",
    location: "Ordenplein 56",
    slots: [
      { day: "d8", time: "Teamoverleg / korte interactie tussen collega's" },
      { day: "d8", time: "Ontspannen teammoment: koffie, samen lachen" },
      { day: "d8", time: "Inwerkmoment: iemand wordt op weg geholpen (voor wervingsvideo)" },
      { day: "d8", time: "Eerlijk moment: iets gaat mis / improviseren → daarna lach (opening wervingsvideo)" }
    ],
    note: "De wervingsvideo opent met 'niet altijd perfect' — vang bewust een onhandig/echt moment mét de lach erna."
  },
  {
    id: "ps-orden-interview", order: 5,
    name: "Orden — interview",
    priority: "high",
    location: "Ordenplein 56 — rustige plek",
    slots: [
      { day: "d8", time: "Interview medewerker en/of cliënt volwassenenzorg (±15–20 sec bruikbaar)" },
      { day: "d8", time: "1–2 korte quotes over meedoen in de wijk / er zijn voor elkaar" }
    ]
  },

  // ---------- DI 9 SEP · HET MATENVELD (Dagbesteding) ----------
  {
    id: "ps-maten-setup", order: 6,
    name: "Matenveld — aankomst & opbouw",
    priority: "normal",
    location: "Rakkersveld 313, Apeldoorn",
    slots: [ { day: "d9", time: "09:30 aanwezig · filmen 10:00 – 13:00" } ],
    note: "Dagbesteding — ochtendactiviteiten lopen dan al, dus direct sfeer te pakken."
  },
  {
    id: "ps-maten-dagbesteding", order: 7,
    name: "Matenveld — dagbesteding in actie",
    priority: "high",
    location: "Rakkersveld 313",
    slots: [
      { day: "d9", time: "Creatieve activiteit: cliënt doet wat hij/zij leuk vindt en goed kan" },
      { day: "d9", time: "Werken op een beschutte plek" },
      { day: "d9", time: "Succesmoment: iets lukt — blik van trots/vertrouwen" },
      { day: "d9", time: "Doelgroep-shot dagbesteding: creatief of werkmoment (voor doelgroepen-sequentie)" },
      { day: "d9", time: "Begeleider start activiteit / helpt op weg" }
    ]
  },
  {
    id: "ps-maten-interview", order: 8,
    name: "Matenveld — interview",
    priority: "high",
    location: "Rakkersveld 313 — rustige plek",
    slots: [
      { day: "d9", time: "Interview medewerker + cliënt samen (±15 sec bruikbaar)" }
    ]
  },
  {
    id: "ps-maten-team", order: 9,
    name: "Matenveld — team & sfeer",
    priority: "high",
    location: "Rakkersveld 313",
    slots: [
      { day: "d9", time: "Kort overleg / schakelen tussen collega's" },
      { day: "d9", time: "Samen lachen / ontspannen moment" },
      { day: "d9", time: "Eerlijk moment: dag loopt anders dan gepland → improviseren" }
    ]
  },

  // ---------- DI 15 SEP · AVENTURIJN (Kind, Jeugd en Gezin) ----------
  {
    id: "ps-avent-setup", order: 10,
    name: "Aventurijn — aankomst & opbouw",
    priority: "normal",
    location: "Kanaal Noord 350C, Apeldoorn (Aquamarijn & Serpentijn)",
    slots: [ { day: "d15", time: "13:30 aanwezig · filmen 14:00 – 17:00" } ],
    note: "Kind, Jeugd en Gezin — twee groepen: Aquamarijn & Serpentijn."
  },
  {
    id: "ps-avent-kind", order: 11,
    name: "Aventurijn — kind & jeugd",
    priority: "high",
    location: "Kanaal Noord 350C",
    slots: [
      { day: "d15", time: "Kind in begeleiding of spel" },
      { day: "d15", time: "Ontwikkelmoment: extra hulp, kind ontwikkelt zich op eigen manier — iets lukt" },
      { day: "d15", time: "Korte sfeerbeelden kinderen (±10–15 sec bruikbaar voor welkomstvideo)" },
      { day: "d15", time: "Structuurmoment: begeleider legt uit / dagritme" },
      { day: "d15", time: "Doelgroep-shot kind (voor doelgroepen-sequentie)" }
    ],
    note: "EXTRA ALERT op toestemming: kinderen herkenbaar in beeld alleen met akkoord ouders/verzorgers — vooraf checken met de locatie."
  },
  {
    id: "ps-avent-interview", order: 12,
    name: "Aventurijn — interview",
    priority: "high",
    location: "Kanaal Noord 350C — rustige plek",
    slots: [
      { day: "d15", time: "Interview medewerker kind & jeugd (±10–15 sec bruikbaar)" }
    ]
  },
  {
    id: "ps-avent-team", order: 13,
    name: "Aventurijn — team & afsluiting",
    priority: "high",
    location: "Kanaal Noord 350C",
    slots: [
      { day: "d15", time: "Teammoment / overleg" },
      { day: "d15", time: "Eindshot-optie: medewerker + cliënt, warme blik (slot wervings- en 1-min video)" },
      { day: "d15", time: "Restshots checken: wat mist er nog uit de 3 scripts? (laatste draaidag!)" }
    ],
    note: "Dit is de laatste draaidag — loop vooraf de shotlijst van alle drie de locaties na op gaten."
  }
];

const PASSEREL_INFO = {
  title: "De Passerel — 3 video's, 3 draaidagen",
  groups: [
    {
      label: "Draaidagen",
      text: "Ma 8 sep · Orden (Wonen) — Ordenplein 56, Apeldoorn · aanwezig 14:30, filmen 15:00–19:00\nDi 9 sep · Het Matenveld (Dagbesteding) — Rakkersveld 313, Apeldoorn · aanwezig 09:30, filmen 10:00–13:00\nDi 15 sep · Aventurijn (Kind, Jeugd en Gezin — Aquamarijn & Serpentijn) — Kanaal Noord 350C, Apeldoorn · aanwezig 13:30, filmen 14:00–17:00"
    },
    {
      label: "De 3 video's uit het script",
      text: "1. Welkomst-/onboardingvideo (±3:15–3:45): voice-over + per doelgroep beeld en kort interview; eindigt met 'je staat er niet alleen voor' (team/inwerk-beelden).\n2. De Passerel in 1 minuut: rustige, warme shots — warm contact, dagelijkse begeleiding, geduld & groei, doelgroepen-sequentie (kind/volwassene/dagbesteding), kleine momenten, teammoment, eindshot met logo.\n3. Wervingsvideo (±1:20): eerlijk & herkenbaar — imperfecte momenten mét lach, schakelen, succesmomentje, doelgroepen, inwerken; slogan 'niet 100% perfect, wel de leukste baan of stage van de wereld' + Werkenbijdepasserel.nl."
    },
    {
      label: "Aandachtspunten",
      text: "Toestemming: zorglocaties — check per locatie wie herkenbaar in beeld mag; bij Aventurijn (kinderen) alleen met akkoord van ouders/verzorgers.\nHet script noemt ook beelden van 'Meedoen in de wijk / Buurtwinkel (Epe)' en locaties Aalscholver en Doggersbank — daar is GEEN draaidag voor gepland. Check bij De Passerel of die beelden vervallen, aangeleverd worden of dat er een extra moment komt.\nInterviews: overal een rustige plek regelen; quotes kort houden (10–20 sec bruikbaar).\nStijl: rustig, warm, geen snelle montagebeelden — de kracht zit in kleine echte momenten."
    }
  ]
};

// ============================================================
// PROJECT-REGISTER
// ============================================================

const PROJECTS = [
  {
    id: "passerel",
    name: "De Passerel",
    subtitle: "Onboarding-, 1-minuut- en wervingsvideo · 3 draaidagen · 8, 9 en 15 sep",
    icon: "🤝",
    stateKey: "passerel_v1",
    doneMode: "all", // alle shots per blok nodig
    days: [
      { key: "d8", label: "Ma 8 sep", date: "2026-09-08" },
      { key: "d9", label: "Di 9 sep", date: "2026-09-09" },
      { key: "d15", label: "Di 15 sep", date: "2026-09-15" }
    ],
    crew: [
      { id: "leroy", name: "Leroy", color: "#3ddc84", soft: "" },
      { id: "cam2", name: "Cameraman 2", color: "#5b9bff", soft: "" }
    ],
    info: PASSEREL_INFO,
    acts: PASSEREL_ACTS
  },
  {
    id: "aba-2026",
    name: "Apeldoorn Business Awards 2026",
    subtitle: "18 genomineerden + 3 studenten · routes vanaf Oranjelaan 2 · gemaild → bevestigd → gefilmd",
    icon: "🏆",
    stateKey: "aba2026_v1",
    doneMode: "all", // bedrijf pas klaar als gemaild + bevestigd + gefilmd
    days: [
      { key: "dag", label: "Planning" }
    ],
    crew: [
      { id: "leroy", name: "Leroy", color: "#3ddc84", soft: "" },
      { id: "jason", name: "Jason", color: "#5b9bff", soft: "" }
    ],
    info: ABA_INFO,
    acts: ABA_ACTS
  },
  {
    id: "unive",
    name: "Univé adviseursvideo's",
    subtitle: "USL Apeldoorn · wo 26 aug · 3 adviseurs × 3 kennisvideo's",
    icon: "🛡️",
    stateKey: "unive_v1",
    doneMode: "all", // alle onderwerpen per adviseur moeten binnen zijn
    days: [
      { key: "dag", label: "Wo 26 aug", date: "2026-08-26" }
    ],
    crew: [
      { id: "leroy", name: "Leroy", color: "#3ddc84", soft: "" },
      { id: "jeroen", name: "Jeroen", color: "#5b9bff", soft: "" }
    ],
    info: UNIVE_INFO,
    acts: UNIVE_ACTS
  },
  {
    id: "de-opening",
    name: "De Opening 2026",
    subtitle: "Apeldoorn · vr 28 – zo 30 augustus · foto & video",
    icon: "🎭",
    stateKey: "v2_deopening", // behoudt bestaande vinkjes
    doneMode: "any", // festival: één goede snippet per act is genoeg
    // Crew: acts kunnen in de app aan iemand worden toegewezen (via detail-modal).
    // Toegewezen kaarten krijgen de kleur van het crewlid. Namen hier aanpassen.
    crew: [
      { id: "leroy", name: "Leroy", color: "#3ddc84", soft: "" },
      { id: "cam2", name: "Cameraman 2", color: "#5b9bff", soft: "" }
    ],
    days: [
      { key: "vr", label: "Vr 28 aug", date: "2026-08-28" },
      { key: "za", label: "Za 29 aug", date: "2026-08-29" },
      { key: "zo", label: "Zo 30 aug", date: "2026-08-30" }
    ],
    map: {
      image: "Locaties.jpg",
      legend: [
        ["Binnenstad", "Caterplein (buitenpodium), Raadhuisplein, parkje Marktstraat, hoek Paslaan/Hoofdstraat, Grote Markthof, Etalageroute"],
        ["Cultuurkwartier", "ACEC, CODA, GIGANT (+ Van Reekumplein), Grote Kerk"],
        ["Theater Orpheus", ""],
        ["Oranjepark", ""],
        ["Paleis Het Loo", "Stallenplein (overdekt)"],
        ["Park Zuidbroek", "naast de voetbalcourt (KinderKaravaan)"],
        ["Zwitsalhal", "Pim & Pom Festival"],
        ["Theehuis Berg & Bos", "Tentoonstelling Verenigde Apeldoorners"],
        ["Lighthouse Jongerencafé", "Van Kinsbergenstraat 8 (Matthijn Buwalda)"]
      ]
    },
    timetable: { image: "timetable.jpg" },
    acts: DE_OPENING_ACTS
  },
  {
    id: "bedrijfsvideo",
    name: "Bedrijfsvideo lijmproductie",
    subtitle: "Panden 5, 7 & 9 · productie, R&D, kantoor · blokken 08:15 – ±12:30",
    icon: "🏭",
    stateKey: "bedrijfsvideo_v1",
    doneMode: "all", // bedrijfsvideo: alle shots per blok moeten binnen zijn
    crew: [
      { id: "leroy", name: "Leroy", color: "#3ddc84", soft: "" },
      { id: "cam2", name: "Cameraman 2", color: "#5b9bff", soft: "" }
    ],
    days: [
      { key: "dag", label: "Shootdag" }
    ],
    info: BEDRIJFSVIDEO_INFO,
    acts: BEDRIJFSVIDEO_ACTS
  }
];
