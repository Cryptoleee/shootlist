// Shootlist data — gebaseerd op timetable.jpg
// Tijden zijn een eerste inschatting; pas ze gerust aan in deze file als ze niet kloppen.

const ACTS = [
  {
    id: "paul-de-leeuw-njon",
    name: "Paul de Leeuw x NJON",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "wo", time: "19:30 – 21:00" }
    ]
  },
  {
    id: "hiigo-ereprijs",
    name: "Hiigo x De Ereprijs",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "do", time: "15:30 – 16:30" }
    ]
  },
  {
    id: "thijs-boontjes",
    name: "Thijs Boontjes",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "do", time: "22:00 – 23:00" }
    ]
  },
  {
    id: "jet-van-der-steen",
    name: "Jet van der Steen",
    priority: "high",
    location: "Mainstage (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "do", time: "19:30 – 20:30" }
    ]
  },
  {
    id: "waterqueens",
    name: "Waterqueens",
    priority: "high",
    location: "Kayersbeekhof",
    locationId: 5,
    slots: [
      { day: "wo", time: "17:30" },
      { day: "wo", time: "19:30" },
      { day: "do", time: "15:00" },
      { day: "do", time: "16:30" },
      { day: "do", time: "18:00" }
    ],
    note: "Meerdere slots — een is genoeg, tenzij eerste mislukt."
  },
  {
    id: "ripple",
    name: "Ripple",
    priority: "high",
    location: "Voormalig Verflokaal / Pleats Sophialaan",
    locationId: 6,
    slots: [
      { day: "do", time: "17:00" },
      { day: "do", time: "19:00" }
    ]
  },
  {
    id: "head2head",
    name: "HEAD2HEAD",
    priority: "high",
    location: "Drakenbootloods",
    locationId: 6,
    slots: [
      { day: "do", time: "18:00 – 21:00 (breakdance battles + hiphop showcases)" }
    ]
  },
  {
    id: "operatie-plop",
    name: "Operatie Plop",
    priority: "high",
    location: "Parkeerplaats Nettenfabriek",
    locationId: 2,
    slots: [
      { day: "do", time: "15:30" },
      { day: "do", time: "17:00" }
    ],
    note: "Spelen hierna ook op Oeverloos & Poolshoogte — back-up moment."
  },
  {
    id: "echt-zon-tiep",
    name: "Echt zo'n tiep",
    priority: "high",
    location: "Tuin AER Woning (Nettenfabriek)",
    locationId: 2,
    slots: [
      { day: "wo", time: "17:30" },
      { day: "wo", time: "19:00" },
      { day: "do", time: "14:30" },
      { day: "do", time: "16:00" }
    ],
    note: "Spelen hierna ook op Oeverloos & Poolshoogte — back-up moment."
  },
  {
    id: "glitch-copy-herken",
    name: "GLITCH / COPY COPY / Her-ken (8+)",
    priority: "high",
    location: "Parkeerplaats overkapping (Nettenfabriek)",
    locationId: 2,
    slots: [
      { day: "do", time: "COPY COPY — 14:30" },
      { day: "do", time: "GLITCH — 15:00" },
      { day: "do", time: "COPY COPY — 16:00" },
      { day: "do", time: "GLITCH — 17:00" }
    ],
    note: "Eén van de drie is top — pak de meest visuele."
  },
  {
    id: "aaischappij",
    name: "Aaischappij",
    priority: "high",
    location: "Freulebrug Apeldoorns Kanaal",
    locationId: 4,
    slots: [
      { day: "wo", time: "17:00" },
      { day: "wo", time: "19:00" },
      { day: "do", time: "14:30" },
      { day: "do", time: "16:00" },
      { day: "do", time: "17:30" }
    ]
  },
  {
    id: "treinpoezietheater",
    name: "Treinpoëzietheater",
    priority: "high",
    location: "Verhoging station / Onder de bomen",
    locationId: 1,
    slots: [
      { day: "wo", time: "16:30" },
      { day: "wo", time: "18:00" },
      { day: "do", time: "15:30" },
      { day: "do", time: "17:00" }
    ]
  },
  {
    id: "folding-unfolding",
    name: "Folding / Unfolding",
    priority: "high",
    location: "Stage Plein (Stationsplein)",
    locationId: 1,
    slots: [
      { day: "wo", time: "16:00" },
      { day: "wo", time: "17:30" },
      { day: "wo", time: "19:00" },
      { day: "do", time: "15:00" },
      { day: "do", time: "16:30" }
    ]
  },
  {
    id: "taart-voor-iedereen",
    name: "Maakactiviteit: Taart voor iedereen!",
    priority: "high",
    location: "Parkeerplaats overkapping (buiten, Nettenfabriekterrein)",
    locationId: 2,
    slots: [
      { day: "do", time: "14:30 – 17:30 (doorlopend)" }
    ],
    note: "Buiten op het Nettenfabriekterrein — pak handen/proces shots."
  },
  {
    id: "symphony-of-fire",
    name: "Symphony of Fire",
    priority: "high",
    location: "Stationsplein",
    locationId: 1,
    slots: [
      { day: "do", time: "22:00 (afsluiter)" }
    ],
    note: "Slotact — perfect voor aftermovie outro."
  },
  {
    id: "complex-compound",
    name: "Complex Compound",
    priority: "conditional",
    location: "Stationsplein (doorlopend)",
    locationId: 1,
    slots: [
      { day: "wo", time: "doorlopend" },
      { day: "do", time: "doorlopend" }
    ],
    note: "ALLEEN filmen als bezoekers er actief interactie mee hebben."
  }
];
