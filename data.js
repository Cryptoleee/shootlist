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
    note: "STORY: beeld bij start vr 20:00 direct appen. Korte optredens uit theaterseizoen '26-'27 — briefing-highlight."
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
    note: "STORY: briefing zegt 12:30 parkje Marktstraat, maar volgens theaterindestad.nl starten de eerste acts om 12:00. Wees er dus 12:00 — briefing-highlight."
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
    note: "STORY: beeld bij start 13:00 direct appen. Tweede kans in de Grote Kerk."
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
    id: "grande-parade",
    name: "Grande Parade",
    priority: "high",
    location: "Binnenstad (start vanaf ACEC)",
    slots: [
      { day: "za", time: "14:00 – 15:00" }
    ],
    note: "STORY: beeld bij start 14:00 bij ACEC direct appen. Optocht van dieren/karakters door de binnenstad — briefing-highlight, ook voor kinderen-beeld."
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
    note: "STORY: beeld bij start 14:30 direct appen."
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
    note: "STORY: beeld bij start 16:15 direct appen. Meezingmoment — publiek in beeld!"
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
    ]
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
    ]
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
    note: "STORY: Doe-Het-Zelf Theater 12:30 bij parkje Marktstraat direct appen — klopt met site."
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
    note: "ALLEEN fotograferen mét mensen die echt naar het kunstwerk in de etalage kijken (anders niet) — etalage en omgeving herkenbaar in beeld."
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
    note: "Kroon op de taart! (kids), PRISMA — De keuze van Rikkie Kollé, WINWIN Hester Oerlemans, Cinema Khing, Mini-uitgeverij. Kunst-highlight: verwonderende bezoekers in beeld."
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
// PROJECT-REGISTER
// ============================================================

const PROJECTS = [
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
      { id: "leroy", name: "Leroy", color: "#0b7a3e", soft: "#e0f0e7" },
      { id: "cam2", name: "Cameraman 2", color: "#2563b8", soft: "#e3edfb" }
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
      { id: "leroy", name: "Leroy", color: "#0b7a3e", soft: "#e0f0e7" },
      { id: "cam2", name: "Cameraman 2", color: "#2563b8", soft: "#e3edfb" }
    ],
    days: [
      { key: "dag", label: "Shootdag" }
    ],
    info: BEDRIJFSVIDEO_INFO,
    acts: BEDRIJFSVIDEO_ACTS
  }
];
