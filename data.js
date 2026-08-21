// Shootlist data — De Opening 2026, Apeldoorn (vr 28 – zo 30 augustus).
// Bronnen: blokkenschema A3-flyer (2e druk), briefing foto & video,
// https://uit.inapeldoorn.nl/de-opening/ + detailpagina's per act,
// https://theaterindestad.nl/programma/. Laatst gecheckt: 21 aug 2026.
//
// priority: "high" = must-have (story-momenten + highlights uit de briefing),
//           "normal" = overig programma, "conditional" = alleen onder voorwaarde.
// story: true = organisatie wil beeld bij de start appen (06 22808236).

const ACTS = [
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
      { day: "za", time: "12:00 – 19:00" }
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
      { day: "vr", time: "09:00 – 16:30" },
      { day: "za", time: "09:00 – 16:30" },
      { day: "zo", time: "09:00 – 16:30" }
    ],
    note: "Kinderactiviteiten-highlight uit de briefing. Let extra op toestemming bij herkenbare kinderen."
  },
  {
    id: "hoe-het-nu",
    name: "Hoe = Het Nu 2026 (expositie)",
    priority: "high",
    location: "ACEC",
    slots: [
      { day: "vr", time: "12:00 – 17:00" },
      { day: "za", time: "12:00 – 19:00" },
      { day: "zo", time: "12:00 – 17:00" }
    ],
    note: "Kunst-highlight: 'verwonderende mensen' bij de kunst vastleggen, niet alleen het werk."
  },
  {
    id: "coda-museum",
    name: "CODA Museum & exposities",
    priority: "high",
    location: "CODA",
    slots: [
      { day: "vr", time: "10:00 – 17:30" },
      { day: "za", time: "10:00 – 17:00 (gratis toegang)" },
      { day: "zo", time: "10:00 / 11:00 – 17:00" }
    ],
    note: "Kroon op de taart! (kids), PRISMA — De keuze van Rikkie Kollé, WINWIN Hester Oerlemans, Cinema Khing, Mini-uitgeverij. Kunst-highlight: verwonderende bezoekers in beeld."
  },
  {
    id: "verenigde-apeldoorners",
    name: "Tentoonstelling Verenigde Apeldoorners",
    priority: "normal",
    location: "Theehuis Berg & Bos",
    slots: [
      { day: "vr", time: "07:00 – 21:00" },
      { day: "za", time: "07:00 – 21:00" },
      { day: "zo", time: "07:00 – 21:00" }
    ],
    note: "Buiten de binnenstad — alleen als de route het toelaat."
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

// Datums per festival-dag (Europe/Amsterdam) — gebruikt voor "is voorbij" check
const FESTIVAL_DATES = { vr: "2026-08-28", za: "2026-08-29", zo: "2026-08-30" };
