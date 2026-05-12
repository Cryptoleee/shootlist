// Shootlist data — tijden uit https://www.maaiveldfestival.nl/programma
// + detail-pagina's per act. Laatst gecheckt: 12 mei 2026.

const ACTS = [
  {
    id: "paul-de-leeuw-njon",
    name: "Paul de Leeuw x NJO Poporkest",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "wo", time: "20:00 – 21:00" }
    ]
  },
  {
    id: "hiigo-ereprijs",
    name: "Hiigo x Orkest De Ereprijs",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "do", time: "15:30 – 16:30" }
    ]
  },
  {
    id: "jet-van-der-steen",
    name: "Jet van der Steen",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "do", time: "18:30 – 19:30" }
    ]
  },
  {
    id: "thijs-boontjes",
    name: "Thijs Boontjes",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "do", time: "21:30 – 22:30" }
    ]
  },
  {
    id: "waterqueens",
    name: "Waterqueens",
    priority: "high",
    location: "Freulebrug Apeldoorns Kanaal",
    locationId: 4,
    slots: [
      { day: "wo", time: "17:30 – 18:00" },
      { day: "wo", time: "19:00 – 19:30" },
      { day: "do", time: "15:15 – 15:45" },
      { day: "do", time: "16:45 – 17:15" }
    ],
    note: "Eén goede snippet is genoeg — meerdere kansen."
  },
  {
    id: "ripple",
    name: "Ripple",
    priority: "high",
    location: "Parkeerplaats Sophialaan (Verffabriek)",
    locationId: 6,
    slots: [
      { day: "do", time: "14:00 – 14:35" },
      { day: "do", time: "16:00 – 16:35" }
    ]
  },
  {
    id: "head2head",
    name: "HEAD2HEAD",
    priority: "high",
    location: "Drakenbootloods (Verffabriek)",
    locationId: 6,
    slots: [
      { day: "do", time: "14:00 – 17:30 (breakdance battles + hiphop showcases)" }
    ],
    note: "Lang blok — pak goede shots van de battles."
  },
  {
    id: "operatie-plop",
    name: "Operatie Plop",
    priority: "high",
    location: "Parkeerplaats Nettenfabriek",
    locationId: 2,
    slots: [
      { day: "do", time: "15:15 – 15:40" },
      { day: "do", time: "16:45 – 17:10" }
    ],
    note: "Spelen hierna ook op Oeverloos & Poolshoogte — back-up."
  },
  {
    id: "echt-zon-tiep",
    name: "Echt zo'n tiep",
    priority: "high",
    location: "Tuin AER Woning (Nettenfabriek)",
    locationId: 2,
    slots: [
      { day: "wo", time: "16:45 – 17:15" },
      { day: "wo", time: "18:15 – 18:45" },
      { day: "do", time: "14:00 – 14:30" },
      { day: "do", time: "16:00 – 16:30" }
    ],
    note: "Spelen hierna ook op Oeverloos & Poolshoogte — back-up."
  },
  {
    id: "glitch-copy-herken",
    name: "GLITCH / COPY COPY / Her-ken (8+)",
    priority: "high",
    location: "Parkeerplaats overkapping (Nettenfabriek)",
    locationId: 2,
    slots: [
      { day: "do", time: "COPY COPY — 14:30 – 15:00" },
      { day: "do", time: "Her-ken — 15:10 – 15:20" },
      { day: "do", time: "GLITCH — 15:30 – 16:00" },
      { day: "do", time: "COPY COPY — 16:30 – 17:00" },
      { day: "do", time: "Her-ken — 17:10 – 17:20" },
      { day: "do", time: "GLITCH — 17:30 – 18:00" }
    ],
    note: "Eén van de drie is top — pak de meest visuele. Opeenvolgend in 2 blokken."
  },
  {
    id: "aaischappij",
    name: "Aaischappij door Club Echt",
    priority: "high",
    location: "Kayersbeekhof (Kanaalzone)",
    locationId: 5,
    slots: [
      { day: "wo", time: "16:45 – 17:10" },
      { day: "wo", time: "18:15 – 18:40" },
      { day: "wo", time: "19:45 – 20:10" },
      { day: "do", time: "14:30 – 14:55" },
      { day: "do", time: "16:00 – 16:25" },
      { day: "do", time: "17:30 – 17:55" }
    ]
  },
  {
    id: "treinpoezietheater",
    name: "Treinpoëzietheater",
    priority: "high",
    location: "Verhoging station (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "wo", time: "16:00 – 16:30" },
      { day: "wo", time: "17:00 – 17:30" },
      { day: "wo", time: "18:00 – 18:30" },
      { day: "do", time: "14:00 – 14:30" },
      { day: "do", time: "15:15 – 15:45" },
      { day: "do", time: "16:30 – 17:00" }
    ]
  },
  {
    id: "folding-unfolding",
    name: "Folding / Unfolding",
    priority: "high",
    location: "Stage Plein (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "wo", time: "16:00 – 16:20" },
      { day: "wo", time: "18:00 – 18:20" },
      { day: "do", time: "15:00 – 15:20" },
      { day: "do", time: "16:30 – 16:50" },
      { day: "do", time: "19:30 – 19:50" }
    ]
  },
  {
    id: "taart-voor-iedereen",
    name: "Maakactiviteit: Taart voor iedereen!",
    priority: "high",
    location: "Parkeerplaats Nettenfabriek (buiten)",
    locationId: 2,
    slots: [
      { day: "do", time: "14:00 – 18:00 (doorlopend)" }
    ],
    note: "Buiten, doorlopend. Pak handen / proces / sfeer shots."
  },
  {
    id: "symphony-of-fire",
    name: "Symphony of Fire",
    priority: "high",
    location: "Stationsplein",
    locationId: 1,
    slots: [
      { day: "do", time: "22:30 – 23:00" }
    ],
    note: "Afsluiter donderdag — perfect voor aftermovie outro."
  },
  {
    id: "complex-compound",
    name: "Complex Compound",
    priority: "conditional",
    location: "Stationsplein (doorlopend)",
    locationId: 1,
    slots: [
      { day: "wo", time: "14:00 – 23:00 (doorlopend)" },
      { day: "do", time: "14:00 – 22:30 (doorlopend)" }
    ],
    note: "ALLEEN filmen als bezoekers er actief interactie mee hebben."
  }
];
