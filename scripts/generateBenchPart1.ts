import { BenchPlayerInput } from './benchTypes.js';

export const benchPart1: BenchPlayerInput[] = [
  // 1. Barcelona 1991-92 (Dream Team)
  {
    id: "carles-busquets-barca-1992", identityId: "carles-busquets", editionId: "barcelona-1991-92",
    name: "Carles Busquets", commonName: "Carles Busquets", nationality: "Spain", birthYear: 1967, canonicalPosition: "GK",
    squadNumber: 13, ovr: 78, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 6, goals: 0, cleanSheets: 3, ratingRationale: "Reliable backup goalkeeper in Cruyff's Dream Team squad.",
    sourceId: "uefa-cl-history", sourceFact: "European Cup winning squad member 1992"
  },
  {
    id: "cristobal-parralo-barca-1992", identityId: "cristobal-parralo", editionId: "barcelona-1991-92",
    name: "Cristóbal Parralo", commonName: "Cristóbal", nationality: "Spain", birthYear: 1967, canonicalPosition: "RB",
    squadNumber: 14, ovr: 81, naturalPositions: ["RB"], secondaryPositions: ["CB"],
    appearances: 34, goals: 2, cleanSheets: 14, ratingRationale: "Dependable right-back featuring heavily across the European Cup season.",
    sourceId: "rsssf-global", sourceFact: "1992 European Cup & La Liga winner"
  },
  {
    id: "miguel-angel-nadal-barca-1992", identityId: "miguel-angel-nadal", editionId: "barcelona-1991-92",
    name: "Miguel Ángel Nadal", commonName: "Miguel Ángel Nadal", nationality: "Spain", birthYear: 1966, canonicalPosition: "CB",
    squadNumber: 5, ovr: 85, naturalPositions: ["CB"], secondaryPositions: ["CDM"],
    appearances: 38, goals: 5, cleanSheets: 15, ratingRationale: "The 'Beast of Manacor', towering defensive powerhouse.",
    sourceId: "uefa-cl-history", sourceFact: "Crucial starter in Wembley final defense"
  },
  {
    id: "guillermo-amor-barca-1992", identityId: "guillermo-amor", editionId: "barcelona-1991-92",
    name: "Guillermo Amor", commonName: "Guillermo Amor", nationality: "Spain", birthYear: 1967, canonicalPosition: "CM",
    squadNumber: 8, ovr: 86, naturalPositions: ["CM"], secondaryPositions: ["CAM"],
    appearances: 43, goals: 8, assists: 6, ratingRationale: "La Masia pioneer, heart and relentless work ethic of the midfield.",
    sourceId: "rsssf-global", sourceFact: "Started 1992 European Cup campaign"
  },
  {
    id: "jon-andoni-goikoetxea-barca-1992", identityId: "jon-andoni-goikoetxea", editionId: "barcelona-1991-92",
    name: "Jon Andoni Goikoetxea", commonName: "Goikoetxea", nationality: "Spain", birthYear: 1965, canonicalPosition: "RM",
    squadNumber: 7, ovr: 85, naturalPositions: ["RM"], secondaryPositions: ["RW", "RB"],
    appearances: 39, goals: 8, assists: 7, ratingRationale: "Dynamic wide midfielder with relentless speed and pinpoint crossing.",
    sourceId: "uefa-cl-history", sourceFact: "Started 1992 European Cup final"
  },
  {
    id: "jose-ramon-alexanko-barca-1992", identityId: "jose-ramon-alexanko", editionId: "barcelona-1991-92",
    name: "José Ramón Alexanko", commonName: "Alexanko", nationality: "Spain", birthYear: 1956, canonicalPosition: "CB",
    squadNumber: 3, ovr: 82, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 15, goals: 1, cleanSheets: 6, ratingRationale: "Veteran club captain who lifted the European Cup at Wembley.",
    sourceId: "uefa-cl-history", sourceFact: "Captain who lifted 1992 European Cup"
  },
  {
    id: "julio-salinas-barca-1992", identityId: "julio-salinas", editionId: "barcelona-1991-92",
    name: "Julio Salinas", commonName: "Julio Salinas", nationality: "Spain", birthYear: 1962, canonicalPosition: "ST",
    squadNumber: 11, ovr: 84, naturalPositions: ["ST"], secondaryPositions: ["CF"],
    appearances: 29, goals: 9, assists: 4, ratingRationale: "Target striker who offered aerial supremacy and clinical poacher instinct.",
    sourceId: "rsssf-global", sourceFact: "Key contributor in 1992 Dream Team"
  },

  // 2. Juventus 1995-96
  {
    id: "michelangelo-rampulla-juve-1996", identityId: "michelangelo-rampulla", editionId: "juventus-1995-96",
    name: "Michelangelo Rampulla", commonName: "Michelangelo Rampulla", nationality: "Italy", birthYear: 1962, canonicalPosition: "GK",
    squadNumber: 12, ovr: 79, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 11, goals: 0, cleanSheets: 4, ratingRationale: "Exemplary backup goalkeeper throughout Lippi's golden era.",
    sourceId: "uefa-cl-history", sourceFact: "1996 Champions League winner"
  },
  {
    id: "massimo-carrera-juve-1996", identityId: "massimo-carrera", editionId: "juventus-1995-96",
    name: "Massimo Carrera", commonName: "Massimo Carrera", nationality: "Italy", birthYear: 1964, canonicalPosition: "CB",
    squadNumber: 13, ovr: 81, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 24, goals: 0, cleanSheets: 10, ratingRationale: "Tough, disciplined defender who shored up the backline.",
    sourceId: "rsssf-global", sourceFact: "1996 Champions League winner"
  },
  {
    id: "sergio-porrini-juve-1996", identityId: "sergio-porrini", editionId: "juventus-1995-96",
    name: "Sergio Porrini", commonName: "Sergio Porrini", nationality: "Italy", birthYear: 1968, canonicalPosition: "CB",
    squadNumber: 14, ovr: 81, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 22, goals: 1, cleanSheets: 8, ratingRationale: "Versatile defensive stopper in Lippi's tactical setup.",
    sourceId: "uefa-cl-history", sourceFact: "1996 UCL knockout phase appearance"
  },
  {
    id: "attilio-lombardo-juve-1996", identityId: "attilio-lombardo", editionId: "juventus-1995-96",
    name: "Attilio Lombardo", commonName: "Attilio Lombardo", nationality: "Italy", birthYear: 1966, canonicalPosition: "RM",
    squadNumber: 7, ovr: 85, naturalPositions: ["RM"], secondaryPositions: ["RW"],
    appearances: 21, goals: 4, assists: 5, ratingRationale: "The 'Bald Eagle', electrifying winger with incredible pace.",
    sourceId: "uefa-cl-history", sourceFact: "1996 Champions League winning winger"
  },
  {
    id: "vladimir-jugovic-juve-1996", identityId: "vladimir-jugovic", editionId: "juventus-1995-96",
    name: "Vladimir Jugović", commonName: "Vladimir Jugović", nationality: "Serbia", birthYear: 1969, canonicalPosition: "CM",
    squadNumber: 18, ovr: 87, naturalPositions: ["CM"], secondaryPositions: ["CDM", "LM"], hasLegendSeal: true,
    legendSealReason: "Scored the historic winning penalty in the 1996 Champions League final shootout against Ajax in Rome",
    appearances: 35, goals: 4, assists: 5, ratingRationale: "Midfield metronome whose decisive penalty brought the cup to Turin.",
    sourceId: "uefa-cl-history", sourceFact: "Scored winning penalty in 1996 UCL final"
  },
  {
    id: "michele-padovano-juve-1996", identityId: "michele-padovano", editionId: "juventus-1995-96",
    name: "Michele Padovano", commonName: "Michele Padovano", nationality: "Italy", birthYear: 1966, canonicalPosition: "ST",
    squadNumber: 15, ovr: 83, naturalPositions: ["ST"], secondaryPositions: ["CF"],
    appearances: 30, goals: 7, assists: 3, ratingRationale: "Clutch impact forward, scored penalty in the 1996 UCL final shootout.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in 1996 UCL final shootout"
  },
  {
    id: "giancarlo-marocchi-juve-1996", identityId: "giancarlo-marocchi", editionId: "juventus-1995-96",
    name: "Giancarlo Marocchi", commonName: "Giancarlo Marocchi", nationality: "Italy", birthYear: 1965, canonicalPosition: "CM",
    squadNumber: 8, ovr: 82, naturalPositions: ["CM"], secondaryPositions: ["CDM"],
    appearances: 28, goals: 2, assists: 3, ratingRationale: "Veteran central midfielder offering immense tactical control.",
    sourceId: "rsssf-global", sourceFact: "1996 Champions League & Serie A runner up"
  },

  // 3. Manchester United 1998-99 (Treble)
  {
    id: "raimond-van-der-gouw-manutd-1999", identityId: "raimond-van-der-gouw", editionId: "manchester-united-1998-99",
    name: "Raimond van der Gouw", commonName: "Van der Gouw", nationality: "Netherlands", birthYear: 1963, canonicalPosition: "GK",
    squadNumber: 17, ovr: 79, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 8, goals: 0, cleanSheets: 4, ratingRationale: "Ever-ready backup keeper who kept a clean sheet against Juventus in Turin.",
    sourceId: "uefa-cl-history", sourceFact: "1999 Treble winner"
  },
  {
    id: "henning-berg-manutd-1999", identityId: "henning-berg", editionId: "manchester-united-1998-99",
    name: "Henning Berg", commonName: "Henning Berg", nationality: "Norway", birthYear: 1969, canonicalPosition: "CB",
    squadNumber: 21, ovr: 83, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 29, goals: 0, cleanSheets: 11, ratingRationale: "Crucial central defender, vital goal-line clearance against Inter.",
    sourceId: "rsssf-global", sourceFact: "1999 Treble winner"
  },
  {
    id: "phil-neville-manutd-1999", identityId: "phil-neville", editionId: "manchester-united-1998-99",
    name: "Phil Neville", commonName: "Phil Neville", nationality: "England", birthYear: 1977, canonicalPosition: "LB",
    squadNumber: 12, ovr: 82, naturalPositions: ["LB"], secondaryPositions: ["RB", "CDM"],
    appearances: 44, goals: 1, assists: 4, ratingRationale: "Versatile defensive workhorse who played across backline and midfield.",
    sourceId: "uefa-cl-history", sourceFact: "44 appearances across 1999 Treble season"
  },
  {
    id: "nicky-butt-manutd-1999", identityId: "nicky-butt", editionId: "manchester-united-1998-99",
    name: "Nicky Butt", commonName: "Nicky Butt", nationality: "England", birthYear: 1975, canonicalPosition: "CM",
    squadNumber: 8, ovr: 85, naturalPositions: ["CM"], secondaryPositions: ["CDM"],
    appearances: 47, goals: 3, assists: 4, ratingRationale: "Started the Camp Nou final in place of suspended Roy Keane, flawless display.",
    sourceId: "uefa-cl-history", sourceFact: "Started 1999 Champions League final in midfield"
  },
  {
    id: "jesper-blomqvist-manutd-1999", identityId: "jesper-blomqvist", editionId: "manchester-united-1998-99",
    name: "Jesper Blomqvist", commonName: "Jesper Blomqvist", nationality: "Sweden", birthYear: 1974, canonicalPosition: "LM",
    squadNumber: 15, ovr: 82, naturalPositions: ["LM"], secondaryPositions: ["LW"],
    appearances: 38, goals: 1, assists: 6, ratingRationale: "Started the Camp Nou final on the left wing, providing width and energy.",
    sourceId: "uefa-cl-history", sourceFact: "Started 1999 Champions League final"
  },
  {
    id: "ole-gunnar-solskjaer-manutd-1999", identityId: "ole-gunnar-solskjaer", editionId: "manchester-united-1998-99",
    name: "Ole Gunnar Solskjær", commonName: "Solskjær", nationality: "Norway", birthYear: 1973, canonicalPosition: "ST",
    squadNumber: 20, ovr: 88, naturalPositions: ["ST"], secondaryPositions: ["CF", "RW"], hasLegendSeal: true,
    legendSealReason: "Scored the historic 93rd-minute winner in the 1999 Champions League final vs Bayern Munich to seal the Treble",
    appearances: 37, goals: 18, assists: 5, ratingRationale: "The 'Baby-Faced Assassin', ultimate super-sub in football history.",
    sourceId: "uefa-cl-history", sourceFact: "93rd min Treble winning goalscorer"
  },
  {
    id: "teddy-sheringham-manutd-1999", identityId: "teddy-sheringham", editionId: "manchester-united-1998-99",
    name: "Teddy Sheringham", commonName: "Teddy Sheringham", nationality: "England", birthYear: 1966, canonicalPosition: "ST",
    squadNumber: 10, ovr: 86, naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Scored 91st-minute equalizer and assisted Solskjær's 93rd-minute winner in 1999 UCL final",
    appearances: 27, goals: 5, assists: 6, ratingRationale: "Masterclass substitute display at Camp Nou turning defeat into glory.",
    sourceId: "uefa-cl-history", sourceFact: "Goal and assist in 1999 UCL final"
  },

  // 4. Real Madrid 2001-02
  {
    id: "cesar-sanchez-madrid-2002", identityId: "cesar-sanchez", editionId: "real-madrid-2001-02",
    name: "César Sánchez", commonName: "César Sánchez", nationality: "Spain", birthYear: 1971, canonicalPosition: "GK",
    squadNumber: 13, ovr: 82, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 23, goals: 0, cleanSheets: 9, ratingRationale: "Started the Glasgow final before being injured, superb campaign.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2002 Champions League final"
  },
  {
    id: "aitor-karanka-madrid-2002", identityId: "aitor-karanka", editionId: "real-madrid-2001-02",
    name: "Aitor Karanka", commonName: "Aitor Karanka", nationality: "Spain", birthYear: 1973, canonicalPosition: "CB",
    squadNumber: 18, ovr: 82, naturalPositions: ["CB"], secondaryPositions: ["LB"],
    appearances: 28, goals: 0, cleanSheets: 10, ratingRationale: "Disciplined central defender across domestic and European fronts.",
    sourceId: "uefa-cl-history", sourceFact: "2002 Champions League winner"
  },
  {
    id: "francisco-pavon-madrid-2002", identityId: "francisco-pavon", editionId: "real-madrid-2001-02",
    name: "Francisco Pavón", commonName: "Francisco Pavón", nationality: "Spain", birthYear: 1980, canonicalPosition: "CB",
    squadNumber: 22, ovr: 80, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 45, goals: 1, cleanSheets: 16, ratingRationale: "The 'Pavón' of the famous 'Zidanes y Pavones' Galáctico policy.",
    sourceId: "rsssf-global", sourceFact: "Breakout season in 2002 UCL win"
  },
  {
    id: "flavio-conceicao-madrid-2002", identityId: "flavio-conceicao", editionId: "real-madrid-2001-02",
    name: "Flávio Conceição", commonName: "Flávio Conceição", nationality: "Brazil", birthYear: 1974, canonicalPosition: "CDM",
    squadNumber: 16, ovr: 82, naturalPositions: ["CDM"], secondaryPositions: ["CM"],
    appearances: 22, goals: 1, assists: 2, ratingRationale: "Tenacious defensive midfielder providing physical presence.",
    sourceId: "uefa-cl-history", sourceFact: "Substituted on in 2002 UCL final"
  },
  {
    id: "steve-mcmanaman-madrid-2002", identityId: "steve-mcmanaman", editionId: "real-madrid-2001-02",
    name: "Steve McManaman", commonName: "Steve McManaman", nationality: "England", birthYear: 1972, canonicalPosition: "RM",
    squadNumber: 8, ovr: 86, naturalPositions: ["RM"], secondaryPositions: ["CM", "CAM"], hasLegendSeal: true,
    legendSealReason: "Scored iconic chip over Bonano at Camp Nou in 2-0 UCL semi-final win vs Barcelona; came on in Glasgow final",
    appearances: 44, goals: 4, assists: 8, ratingRationale: "Intelligent playmaker who scored vital El Clásico European semi-final goal.",
    sourceId: "uefa-cl-history", sourceFact: "Scored vs Barca at Camp Nou in 2002 UCL semi"
  },
  {
    id: "guti-madrid-2002", identityId: "guti-haz", editionId: "real-madrid-2001-02",
    name: "José María Gutiérrez (Guti)", commonName: "Guti", nationality: "Spain", birthYear: 1976, canonicalPosition: "CAM",
    squadNumber: 14, ovr: 86, naturalPositions: ["CAM"], secondaryPositions: ["CM", "CF"],
    appearances: 46, goals: 13, assists: 7, ratingRationale: "Pure vision and genius passer capable of unlocking any backline.",
    sourceId: "uefa-cl-history", sourceFact: "Scored 13 goals in 2001-02 season"
  },
  {
    id: "pedro-munitis-madrid-2002", identityId: "pedro-munitis", editionId: "real-madrid-2001-02",
    name: "Pedro Munitis", commonName: "Pedro Munitis", nationality: "Spain", birthYear: 1975, canonicalPosition: "LW",
    squadNumber: 23, ovr: 81, naturalPositions: ["LW"], secondaryPositions: ["ST", "RW"],
    appearances: 36, goals: 3, assists: 5, ratingRationale: "Energetic and relentless pressing forward who stretched defenses.",
    sourceId: "uefa-cl-history", sourceFact: "Came on as substitute in Glasgow final"
  },

  // 5. Arsenal 2003-04 (Invincibles)
  {
    id: "stuart-taylor-arsenal-2004", identityId: "stuart-taylor", editionId: "arsenal-2003-04",
    name: "Stuart Taylor", commonName: "Stuart Taylor", nationality: "England", birthYear: 1980, canonicalPosition: "GK",
    squadNumber: 13, ovr: 77, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 2, goals: 0, cleanSheets: 1, ratingRationale: "Capable backup goalkeeper in the historic unbeaten season.",
    sourceId: "rsssf-global", sourceFact: "2004 Invincibles medal winner"
  },
  {
    id: "martin-keown-arsenal-2004", identityId: "martin-keown", editionId: "arsenal-2003-04",
    name: "Martin Keown", commonName: "Martin Keown", nationality: "England", birthYear: 1966, canonicalPosition: "CB",
    squadNumber: 5, ovr: 83, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 15, goals: 0, cleanSheets: 7, ratingRationale: "Fierce veteran leader whose aggression defined Arsenal's defensive spine.",
    sourceId: "rsssf-global", sourceFact: "Played 10 EPL games to secure Invincibles medal"
  },
  {
    id: "gael-clichy-arsenal-2004", identityId: "gael-clichy", editionId: "arsenal-2003-04",
    name: "Gaël Clichy", commonName: "Gaël Clichy", nationality: "France", birthYear: 1985, canonicalPosition: "LB",
    squadNumber: 22, ovr: 82, naturalPositions: ["LB"], secondaryPositions: ["LWB"],
    appearances: 22, goals: 0, assists: 2, ratingRationale: "Youngest player to win a Premier League medal at age 18.",
    sourceId: "rsssf-global", sourceFact: "Youngest player to receive 2004 Premier League medal"
  },
  {
    id: "pascal-cygan-arsenal-2004", identityId: "pascal-cygan", editionId: "arsenal-2003-04",
    name: "Pascal Cygan", commonName: "Pascal Cygan", nationality: "France", birthYear: 1974, canonicalPosition: "CB",
    squadNumber: 18, ovr: 80, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 24, goals: 0, cleanSheets: 10, ratingRationale: "Reliable defensive rotation option across the unbeaten league run.",
    sourceId: "rsssf-global", sourceFact: "18 Premier League appearances in 2003-04"
  },
  {
    id: "ray-parlour-arsenal-2004", identityId: "ray-parlour", editionId: "arsenal-2003-04",
    name: "Ray Parlour", commonName: "Ray Parlour", nationality: "England", birthYear: 1973, canonicalPosition: "CM",
    squadNumber: 15, ovr: 83, naturalPositions: ["CM"], secondaryPositions: ["RM"],
    appearances: 37, goals: 0, assists: 4, ratingRationale: "The 'Romford Pelé', legendary workhorse and dressing room titan.",
    sourceId: "rsssf-global", sourceFact: "25 Premier League appearances in unbeaten run"
  },
  {
    id: "edu-gaspar-arsenal-2004", identityId: "edu-gaspar", editionId: "arsenal-2003-04",
    name: "Edu Gaspar", commonName: "Edu", nationality: "Brazil", birthYear: 1978, canonicalPosition: "CM",
    squadNumber: 17, ovr: 84, naturalPositions: ["CM"], secondaryPositions: ["CDM", "CAM"],
    appearances: 48, goals: 7, assists: 6, ratingRationale: "Silky Brazilian midfielder who scored the crucial winner at Celta Vigo.",
    sourceId: "rsssf-global", sourceFact: "30 Premier League games in 2003-04"
  },
  {
    id: "sylvain-wiltord-arsenal-2004", identityId: "sylvain-wiltord", editionId: "arsenal-2003-04",
    name: "Sylvain Wiltord", commonName: "Sylvain Wiltord", nationality: "France", birthYear: 1974, canonicalPosition: "ST",
    squadNumber: 11, ovr: 84, naturalPositions: ["ST"], secondaryPositions: ["RW", "RM"],
    appearances: 19, goals: 4, assists: 3, ratingRationale: "Proven champion forward with clutch attacking instinct.",
    sourceId: "rsssf-global", sourceFact: "Invincibles champion"
  },
  {
    id: "nwankwo-kanu-arsenal-2004", identityId: "nwankwo-kanu", editionId: "arsenal-2003-04",
    name: "Nwankwo Kanu", commonName: "Kanu", nationality: "Nigeria", birthYear: 1976, canonicalPosition: "ST",
    squadNumber: 25, ovr: 83, naturalPositions: ["ST"], secondaryPositions: ["CF"],
    appearances: 23, goals: 3, assists: 3, ratingRationale: "Lanky magician with sublime technique and unpredictable skills.",
    sourceId: "rsssf-global", sourceFact: "Invincibles champion"
  },

  // 6. AC Milan 2006-07 (Athens Champions League)
  {
    id: "zeljko-kalac-milan-2007", identityId: "zeljko-kalac", editionId: "ac-milan-2006-07",
    name: "Željko Kalac", commonName: "Željko Kalac", nationality: "Australia", birthYear: 1972, canonicalPosition: "GK",
    squadNumber: 16, ovr: 78, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 16, goals: 0, cleanSheets: 7, ratingRationale: "Towering Australian backup goalkeeper who stepped up when needed.",
    sourceId: "uefa-cl-history", sourceFact: "2007 Champions League winner"
  },
  {
    id: "cafu-milan-2007", identityId: "cafu", editionId: "ac-milan-2006-07",
    name: "Cafu", commonName: "Cafu", nationality: "Brazil", birthYear: 1970, canonicalPosition: "RB",
    squadNumber: 2, ovr: 85, naturalPositions: ["RB"], secondaryPositions: ["RWB"],
    appearances: 35, goals: 1, assists: 5, ratingRationale: "The legendary Brazilian right-back who claimed his first European Cup at 36.",
    sourceId: "uefa-cl-history", sourceFact: "2007 Champions League winner"
  },
  {
    id: "kakha-kaladze-milan-2007", identityId: "kakha-kaladze", editionId: "ac-milan-2006-07",
    name: "Kakha Kaladze", commonName: "Kakha Kaladze", nationality: "Georgia", birthYear: 1978, canonicalPosition: "CB",
    squadNumber: 4, ovr: 85, naturalPositions: ["CB"], secondaryPositions: ["LB"],
    appearances: 27, goals: 1, cleanSheets: 10, ratingRationale: "Rock-solid Georgian defender, started both semi-finals vs Manchester United.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2007 UCL semi-final against Man Utd"
  },
  {
    id: "dario-simic-milan-2007", identityId: "dario-simic", editionId: "ac-milan-2006-07",
    name: "Dario Šimić", commonName: "Dario Šimić", nationality: "Croatia", birthYear: 1975, canonicalPosition: "CB",
    squadNumber: 17, ovr: 81, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 34, goals: 0, cleanSheets: 12, ratingRationale: "Dependable Croatian international defender in Ancelotti's rotation.",
    sourceId: "uefa-cl-history", sourceFact: "2007 Champions League winner"
  },
  {
    id: "cristian-brocchi-milan-2007", identityId: "cristian-brocchi", editionId: "ac-milan-2006-07",
    name: "Cristian Brocchi", commonName: "Cristian Brocchi", nationality: "Italy", birthYear: 1976, canonicalPosition: "CM",
    squadNumber: 32, ovr: 81, naturalPositions: ["CM"], secondaryPositions: ["CDM", "RM"],
    appearances: 42, goals: 2, assists: 3, ratingRationale: "Tenacious midfielder who provided tactical grit and boundless stamina.",
    sourceId: "uefa-cl-history", sourceFact: "2007 Champions League winner"
  },
  {
    id: "yoann-gourcuff-milan-2007", identityId: "yoann-gourcuff", editionId: "ac-milan-2006-07",
    name: "Yoann Gourcuff", commonName: "Yoann Gourcuff", nationality: "France", birthYear: 1986, canonicalPosition: "CAM",
    squadNumber: 20, ovr: 81, naturalPositions: ["CAM"], secondaryPositions: ["CM"],
    appearances: 33, goals: 2, assists: 4, ratingRationale: "Prodigious playmaker dubbed the new Zidane during Milan's European conquest.",
    sourceId: "uefa-cl-history", sourceFact: "2007 Champions League winner"
  },
  {
    id: "alberto-gilardino-milan-2007", identityId: "alberto-gilardino", editionId: "ac-milan-2006-07",
    name: "Alberto Gilardino", commonName: "Gilardino", nationality: "Italy", birthYear: 1982, canonicalPosition: "ST",
    squadNumber: 11, ovr: 86, naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Scored the iconic 78th-minute counter-attack clincher in the 3-0 demolition of Manchester United at San Siro",
    appearances: 45, goals: 16, assists: 5, ratingRationale: "Prolific striker whose semi-final goal sent San Siro into raptures.",
    sourceId: "uefa-cl-history", sourceFact: "Scored vs Man Utd in 2007 UCL semi-final"
  },
  {
    id: "ricardo-oliveira-milan-2007", identityId: "ricardo-oliveira", editionId: "ac-milan-2006-07",
    name: "Ricardo Oliveira", commonName: "Ricardo Oliveira", nationality: "Brazil", birthYear: 1980, canonicalPosition: "ST",
    squadNumber: 7, ovr: 80, naturalPositions: ["ST"], secondaryPositions: [],
    appearances: 33, goals: 5, assists: 2, ratingRationale: "Brazilian forward who provided attacking depth in Serie A and Europe.",
    sourceId: "uefa-cl-history", sourceFact: "2007 Champions League winner"
  },

  // 7. Manchester United 2007-08 (Champions League & Premier League Double)
  {
    id: "tomasz-kuszczak-manutd-2008", identityId: "tomasz-kuszczak", editionId: "manchester-united-2007-08",
    name: "Tomasz Kuszczak", commonName: "Tomasz Kuszczak", nationality: "Poland", birthYear: 1982, canonicalPosition: "GK",
    squadNumber: 29, ovr: 78, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 16, goals: 0, cleanSheets: 7, ratingRationale: "Reliable Polish shot-stopper during United's double triumph.",
    sourceId: "uefa-cl-history", sourceFact: "2008 Champions League & Premier League winner"
  },
  {
    id: "gerard-pique-manutd-2008", identityId: "gerard-pique", editionId: "manchester-united-2007-08",
    name: "Gerard Piqué", commonName: "Gerard Piqué", nationality: "Spain", birthYear: 1987, canonicalPosition: "CB",
    squadNumber: 19, ovr: 82, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 13, goals: 2, cleanSheets: 6, ratingRationale: "Scored two Champions League group goals before returning to Barcelona.",
    sourceId: "uefa-cl-history", sourceFact: "Scored 2 UCL goals in 2007-08"
  },
  {
    id: "john-oshea-manutd-2008", identityId: "john-oshea", editionId: "manchester-united-2007-08",
    name: "John O'Shea", commonName: "John O'Shea", nationality: "Ireland", birthYear: 1981, canonicalPosition: "RB",
    squadNumber: 22, ovr: 82, naturalPositions: ["RB"], secondaryPositions: ["CB", "LB", "CDM"],
    appearances: 38, goals: 0, cleanSheets: 16, ratingRationale: "Ultimate Mr. Versatile who filled every defensive position.",
    sourceId: "uefa-cl-history", sourceFact: "2008 Champions League winner"
  },
  {
    id: "darren-fletcher-manutd-2008", identityId: "darren-fletcher", editionId: "manchester-united-2007-08",
    name: "Darren Fletcher", commonName: "Darren Fletcher", nationality: "Scotland", birthYear: 1984, canonicalPosition: "CM",
    squadNumber: 24, ovr: 84, naturalPositions: ["CM"], secondaryPositions: ["RM", "CDM"],
    appearances: 24, goals: 2, assists: 3, ratingRationale: "Big-game tactical enforcer trusted implicitly by Sir Alex Ferguson.",
    sourceId: "uefa-cl-history", sourceFact: "2008 Champions League & EPL winner"
  },
  {
    id: "owen-hargreaves-manutd-2008", identityId: "owen-hargreaves", editionId: "manchester-united-2007-08",
    name: "Owen Hargreaves", commonName: "Owen Hargreaves", nationality: "England", birthYear: 1981, canonicalPosition: "CDM",
    squadNumber: 4, ovr: 86, naturalPositions: ["CDM"], secondaryPositions: ["CM", "RB"], hasLegendSeal: true,
    legendSealReason: "Started the Moscow final, played 120 minutes across midfield and right-back, and scored in penalty shootout",
    appearances: 34, goals: 2, assists: 3, ratingRationale: "Supreme tactical ball-winner who scored free-kick winner vs Arsenal.",
    sourceId: "uefa-cl-history", sourceFact: "Scored penalty in 2008 Moscow UCL shootout"
  },
  {
    id: "anderson-manutd-2008", identityId: "anderson-oliveira", editionId: "manchester-united-2007-08",
    name: "Anderson Luís de Abreu Oliveira", commonName: "Anderson", nationality: "Brazil", birthYear: 1988, canonicalPosition: "CM",
    squadNumber: 8, ovr: 83, naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Brought on in the 120th minute in Moscow to score United's 6th penalty in sudden death",
    appearances: 38, goals: 0, assists: 4, ratingRationale: "Golden Boy winner who coolly scored sudden-death penalty in Moscow final.",
    sourceId: "uefa-cl-history", sourceFact: "Scored sudden death penalty in 2008 UCL final"
  },
  {
    id: "nani-manutd-2008", identityId: "nani", editionId: "manchester-united-2007-08",
    name: "Luís Carlos Almeida da Cunha (Nani)", commonName: "Nani", nationality: "Portugal", birthYear: 1986, canonicalPosition: "LW",
    squadNumber: 17, ovr: 86, naturalPositions: ["LW"], secondaryPositions: ["RW"], hasLegendSeal: true,
    legendSealReason: "Scored crucial 5th penalty in sudden-death shootout in Moscow final to keep United alive",
    appearances: 41, goals: 4, assists: 13, ratingRationale: "Electrifying winger with 13 assists and ice-cold penalty in Moscow.",
    sourceId: "uefa-cl-history", sourceFact: "Scored penalty in 2008 UCL shootout"
  },
  {
    id: "louis-saha-manutd-2008", identityId: "louis-saha", editionId: "manchester-united-2007-08",
    name: "Louis Saha", commonName: "Louis Saha", nationality: "France", birthYear: 1978, canonicalPosition: "ST",
    squadNumber: 9, ovr: 82, naturalPositions: ["ST"], secondaryPositions: ["CF"],
    appearances: 24, goals: 5, assists: 2, ratingRationale: "Lethal two-footed striker who offered tactical dynamism in attack.",
    sourceId: "rsssf-global", sourceFact: "2008 Premier League & UCL winner"
  },

  // 8. Barcelona 2008-09 (Sextuple)
  {
    id: "jose-manuel-pinto-barca-2009", identityId: "jose-manuel-pinto", editionId: "barcelona-2008-09",
    name: "José Manuel Pinto", commonName: "Pinto", nationality: "Spain", birthYear: 1975, canonicalPosition: "GK",
    squadNumber: 13, ovr: 79, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 11, goals: 0, cleanSheets: 4, ratingRationale: "Guardiola's trusted Copa del Rey goalkeeper, heroic penalty save vs Mallorca.",
    sourceId: "rsssf-global", sourceFact: "2009 Sextuple Copa del Rey starting GK"
  },
  {
    id: "martin-caceres-barca-2009", identityId: "martin-caceres", editionId: "barcelona-2008-09",
    name: "Martín Cáceres", commonName: "Martín Cáceres", nationality: "Uruguay", birthYear: 1987, canonicalPosition: "CB",
    squadNumber: 2, ovr: 80, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 23, goals: 0, cleanSheets: 8, ratingRationale: "Young, athletic defender contributing to the historic treble.",
    sourceId: "uefa-cl-history", sourceFact: "2009 Treble winner"
  },
  {
    id: "sylvinho-barca-2009", identityId: "sylvinho", editionId: "barcelona-2008-09",
    name: "Sylvinho", commonName: "Sylvinho", nationality: "Brazil", birthYear: 1974, canonicalPosition: "LB",
    squadNumber: 16, ovr: 82, naturalPositions: ["LB"], secondaryPositions: ["LWB"],
    appearances: 30, goals: 1, assists: 3, ratingRationale: "Started and played the full 90 minutes in the Rome final vs Man Utd, immaculate.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2009 Champions League final in Rome"
  },
  {
    id: "seydou-keita-barca-2009", identityId: "seydou-keita", editionId: "barcelona-2008-09",
    name: "Seydou Keita", commonName: "Seydou Keita", nationality: "Mali", birthYear: 1980, canonicalPosition: "CM",
    squadNumber: 15, ovr: 85, naturalPositions: ["CM"], secondaryPositions: ["CDM"],
    appearances: 46, goals: 6, assists: 3, ratingRationale: "Pep Guardiola's tactical wildcard and most trusted substitute.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 2009 Rome Champions League final"
  },
  {
    id: "eidur-gudjohnsen-barca-2009", identityId: "eidur-gudjohnsen", editionId: "barcelona-2008-09",
    name: "Eiður Guðjohnsen", commonName: "Guðjohnsen", nationality: "Iceland", birthYear: 1978, canonicalPosition: "CF",
    squadNumber: 7, ovr: 83, naturalPositions: ["CF"], secondaryPositions: ["CAM", "ST"],
    appearances: 34, goals: 4, assists: 5, ratingRationale: "Intelligent link-up attacker operating between lines in Guardiola's system.",
    sourceId: "uefa-cl-history", sourceFact: "2009 Sextuple champion"
  },
  {
    id: "bojan-krkic-barca-2009", identityId: "bojan-krkic", editionId: "barcelona-2008-09",
    name: "Bojan Krkić", commonName: "Bojan", nationality: "Spain", birthYear: 1990, canonicalPosition: "ST",
    squadNumber: 11, ovr: 82, naturalPositions: ["ST"], secondaryPositions: ["LW", "RW"],
    appearances: 42, goals: 10, assists: 5, ratingRationale: "Copa del Rey top scorer (5 goals) leading Barca to the first leg of Treble.",
    sourceId: "rsssf-global", sourceFact: "Copa del Rey top scorer in 2009 Treble"
  },
  {
    id: "alexander-hleb-barca-2009", identityId: "alexander-hleb", editionId: "barcelona-2008-09",
    name: "Alexander Hleb", commonName: "Alexander Hleb", nationality: "Belarus", birthYear: 1981, canonicalPosition: "CAM",
    squadNumber: 21, ovr: 81, naturalPositions: ["CAM"], secondaryPositions: ["LW", "RW"],
    appearances: 36, goals: 0, assists: 3, ratingRationale: "Silky dribbler who provided wide rotation in the treble campaign.",
    sourceId: "uefa-cl-history", sourceFact: "2009 Treble winner"
  },

  // 9. Inter Milan 2009-10 (Mourinho Treble)
  {
    id: "francesco-toldo-inter-2010", identityId: "francesco-toldo", editionId: "inter-milan-2009-10",
    name: "Francesco Toldo", commonName: "Francesco Toldo", nationality: "Italy", birthYear: 1971, canonicalPosition: "GK",
    squadNumber: 1, ovr: 81, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 8, goals: 0, cleanSheets: 4, ratingRationale: "Veteran legendary goalkeeper who marshaled the Coppa Italia triumph.",
    sourceId: "rsssf-global", sourceFact: "Started 2010 Coppa Italia final win vs Roma"
  },
  {
    id: "ivan-cordoba-inter-2010", identityId: "ivan-cordoba", editionId: "inter-milan-2009-10",
    name: "Iván Córdoba", commonName: "Iván Córdoba", nationality: "Colombia", birthYear: 1976, canonicalPosition: "CB",
    squadNumber: 2, ovr: 84, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 34, goals: 0, cleanSheets: 14, ratingRationale: "Lightning-fast Colombian defender, coming on in the Bernabéu final.",
    sourceId: "uefa-cl-history", sourceFact: "Substitute in 2010 Champions League final"
  },
  {
    id: "marco-materazzi-inter-2010", identityId: "marco-materazzi", editionId: "inter-milan-2009-10",
    name: "Marco Materazzi", commonName: "Marco Materazzi", nationality: "Italy", birthYear: 1973, canonicalPosition: "CB",
    squadNumber: 23, ovr: 83, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 20, goals: 0, cleanSheets: 8, ratingRationale: "Emotional warrior brought on in 92nd min in Madrid before Mourinho tearful hug.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 2010 UCL final"
  },
  {
    id: "thiago-motta-inter-2010", identityId: "thiago-motta", editionId: "inter-milan-2009-10",
    name: "Thiago Motta", commonName: "Thiago Motta", nationality: "Italy", birthYear: 1982, canonicalPosition: "CDM",
    squadNumber: 8, ovr: 86, naturalPositions: ["CDM"], secondaryPositions: ["CM"],
    appearances: 40, goals: 4, assists: 3, ratingRationale: "Deep-lying playmaker who started both semi-final legs against Barcelona.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2010 UCL semi-finals"
  },
  {
    id: "dejan-stankovic-inter-2010", identityId: "dejan-stankovic", editionId: "inter-milan-2009-10",
    name: "Dejan Stanković", commonName: "Dejan Stanković", nationality: "Serbia", birthYear: 1978, canonicalPosition: "CM",
    squadNumber: 5, ovr: 86, naturalPositions: ["CM"], secondaryPositions: ["CAM", "CDM"],
    appearances: 43, goals: 5, assists: 6, ratingRationale: "Thunderous long-range shooter, came on in Bernabéu final to secure Treble.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 2010 UCL final"
  },
  {
    id: "sulley-muntari-inter-2010", identityId: "sulley-muntari", editionId: "inter-milan-2009-10",
    name: "Sulley Muntari", commonName: "Sulley Muntari", nationality: "Ghana", birthYear: 1984, canonicalPosition: "CM",
    squadNumber: 11, ovr: 82, naturalPositions: ["CM"], secondaryPositions: ["CDM", "LM"],
    appearances: 42, goals: 1, assists: 3, ratingRationale: "Tireless midfielder brought on in Camp Nou and Bernabéu to lock down results.",
    sourceId: "uefa-cl-history", sourceFact: "Substitute in 2010 UCL final"
  },
  {
    id: "mario-balotelli-inter-2010", identityId: "mario-balotelli", editionId: "inter-milan-2009-10",
    name: "Mario Balotelli", commonName: "Mario Balotelli", nationality: "Italy", birthYear: 1990, canonicalPosition: "ST",
    squadNumber: 45, ovr: 84, naturalPositions: ["ST"], secondaryPositions: ["LW"],
    appearances: 40, goals: 11, assists: 8, ratingRationale: "Prodigious 19-year-old talent whose 11 goals fueled Serie A and European runs.",
    sourceId: "rsssf-global", sourceFact: "11 goals in 2010 Treble season"
  },

  // 10. Bayern Munich 2012-13 (Heynckes Treble)
  {
    id: "tom-starke-bayern-2013", identityId: "tom-starke", editionId: "bayern-munich-2012-13",
    name: "Tom Starke", commonName: "Tom Starke", nationality: "Germany", birthYear: 1981, canonicalPosition: "GK",
    squadNumber: 22, ovr: 78, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 4, goals: 0, cleanSheets: 3, ratingRationale: "Solid backup goalkeeper who kept 3 clean sheets in 4 appearances.",
    sourceId: "rsssf-global", sourceFact: "2013 Treble winner"
  },
  {
    id: "daniel-van-buyten-bayern-2013", identityId: "daniel-van-buyten", editionId: "bayern-munich-2012-13",
    name: "Daniel Van Buyten", commonName: "Van Buyten", nationality: "Belgium", birthYear: 1978, canonicalPosition: "CB",
    squadNumber: 5, ovr: 82, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 23, goals: 0, cleanSheets: 11, ratingRationale: "Colossal aerial stopper who stepped into defense whenever called upon.",
    sourceId: "uefa-cl-history", sourceFact: "Started both quarter-finals vs Juventus"
  },
  {
    id: "rafinha-bayern-2013", identityId: "rafinha-souza", editionId: "bayern-munich-2012-13",
    name: "Márcio Rafael Ferreira de Souza (Rafinha)", commonName: "Rafinha", nationality: "Brazil", birthYear: 1985, canonicalPosition: "RB",
    squadNumber: 13, ovr: 82, naturalPositions: ["RB"], secondaryPositions: ["LB"],
    appearances: 17, goals: 2, assists: 2, ratingRationale: "Tenacious Brazilian full-back providing flawless backup for Lahm.",
    sourceId: "rsssf-global", sourceFact: "2013 Treble winner"
  },
  {
    id: "luiz-gustavo-bayern-2013", identityId: "luiz-gustavo", editionId: "bayern-munich-2012-13",
    name: "Luiz Gustavo", commonName: "Luiz Gustavo", nationality: "Brazil", birthYear: 1987, canonicalPosition: "CDM",
    squadNumber: 30, ovr: 85, naturalPositions: ["CDM"], secondaryPositions: ["CM"],
    appearances: 36, goals: 4, assists: 1, ratingRationale: "Came on in Wembley final, ferocious ball winner across the season.",
    sourceId: "uefa-cl-history", sourceFact: "Substituted on in 2013 Wembley UCL final"
  },
  {
    id: "anatoliy-tymoshchuk-bayern-2013", identityId: "anatoliy-tymoshchuk", editionId: "bayern-munich-2012-13",
    name: "Anatoliy Tymoshchuk", commonName: "Tymoshchuk", nationality: "Ukraine", birthYear: 1979, canonicalPosition: "CDM",
    squadNumber: 44, ovr: 81, naturalPositions: ["CDM"], secondaryPositions: ["CB"],
    appearances: 25, goals: 1, cleanSheets: 10, ratingRationale: "Experienced midfield warrior who closed out key European ties.",
    sourceId: "uefa-cl-history", sourceFact: "2013 Treble winner"
  },
  {
    id: "xherdan-shaqiri-bayern-2013", identityId: "xherdan-shaqiri", editionId: "bayern-munich-2012-13",
    name: "Xherdan Shaqiri", commonName: "Xherdan Shaqiri", nationality: "Switzerland", birthYear: 1991, canonicalPosition: "RW",
    squadNumber: 11, ovr: 84, naturalPositions: ["RW"], secondaryPositions: ["CAM", "LW"],
    appearances: 39, goals: 8, assists: 13, ratingRationale: "Powerful dynamic attacker who provided 21 direct goal contributions.",
    sourceId: "uefa-cl-history", sourceFact: "8 goals, 13 assists in 2013 Treble season"
  },
  {
    id: "claudio-pizarro-bayern-2013", identityId: "claudio-pizarro", editionId: "bayern-munich-2012-13",
    name: "Claudio Pizarro", commonName: "Claudio Pizarro", nationality: "Peru", birthYear: 1978, canonicalPosition: "ST",
    squadNumber: 14, ovr: 83, naturalPositions: ["ST"], secondaryPositions: ["CF"],
    appearances: 28, goals: 13, assists: 6, ratingRationale: "Legendary Andean poacher, scored 4 goals in a single 9-2 Hamburg rout.",
    sourceId: "rsssf-global", sourceFact: "13 goals in 2013 Treble season"
  },
  {
    id: "mario-gomez-bayern-2013", identityId: "mario-gomez", editionId: "bayern-munich-2012-13",
    name: "Mario Gómez", commonName: "Mario Gómez", nationality: "Germany", birthYear: 1985, canonicalPosition: "ST",
    squadNumber: 33, ovr: 87, naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Scored 19 goals in just 32 appearances including 2 in the DFB-Pokal final to seal the Treble; came on in Wembley final",
    appearances: 32, goals: 19, assists: 4, ratingRationale: "Lethal goal-per-minute ratio, decisive in Pokal final.",
    sourceId: "uefa-cl-history", sourceFact: "Scored twice in 2013 DFB-Pokal final"
  },

  // 11. Real Madrid 2013-14 (La Décima)
  {
    id: "diego-lopez-madrid-2014", identityId: "diego-lopez", editionId: "real-madrid-2013-14",
    name: "Diego López", commonName: "Diego López", nationality: "Spain", birthYear: 1981, canonicalPosition: "GK",
    squadNumber: 25, ovr: 84, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 37, goals: 0, cleanSheets: 16, ratingRationale: "Ancelotti's undisputed primary La Liga goalkeeper.",
    sourceId: "rsssf-global", sourceFact: "Started 36 La Liga matches in 2013-14"
  },
  {
    id: "raphael-varane-madrid-2014", identityId: "raphael-varane", editionId: "real-madrid-2013-14",
    name: "Raphaël Varane", commonName: "Raphaël Varane", nationality: "France", birthYear: 1993, canonicalPosition: "CB",
    squadNumber: 2, ovr: 86, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 23, goals: 0, cleanSheets: 10, ratingRationale: "Started the Lisbon Champions League final at age 21, flawless performance.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2014 Champions League final"
  },
  {
    id: "nacho-fernandez-madrid-2014", identityId: "nacho-fernandez", editionId: "real-madrid-2013-14",
    name: "Nacho Fernández", commonName: "Nacho", nationality: "Spain", birthYear: 1990, canonicalPosition: "CB",
    squadNumber: 18, ovr: 81, naturalPositions: ["CB"], secondaryPositions: ["RB", "LB"],
    appearances: 19, goals: 0, cleanSheets: 8, ratingRationale: "Versatile academy defender who filled all four positions.",
    sourceId: "uefa-cl-history", sourceFact: "La Décima winner"
  },
  {
    id: "marcelo-madrid-2014", identityId: "marcelo-vieira", editionId: "real-madrid-2013-14",
    name: "Marcelo Vieira", commonName: "Marcelo", nationality: "Brazil", birthYear: 1988, canonicalPosition: "LB",
    squadNumber: 12, ovr: 88, naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: true,
    legendSealReason: "Came off the bench in Lisbon to score Madrid's 3rd goal in extra time in the 4-1 victory",
    appearances: 39, goals: 2, assists: 7, ratingRationale: "Transformational substitute display in the Lisbon final.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in 2014 Champions League final"
  },
  {
    id: "casemiro-madrid-2014", identityId: "casemiro", editionId: "real-madrid-2013-14",
    name: "Carlos Henrique Casimiro (Casemiro)", commonName: "Casemiro", nationality: "Brazil", birthYear: 1992, canonicalPosition: "CDM",
    squadNumber: 16, ovr: 81, naturalPositions: ["CDM"], secondaryPositions: ["CM"],
    appearances: 25, goals: 0, assists: 1, ratingRationale: "Came on in Dortmund quarter-final to rescue Madrid from elimination.",
    sourceId: "uefa-cl-history", sourceFact: "Crucial substitute in Dortmund quarter-final"
  },
  {
    id: "isco-madrid-2014", identityId: "isco-alarcon", editionId: "real-madrid-2013-14",
    name: "Francisco Román Alarcón (Isco)", commonName: "Isco", nationality: "Spain", birthYear: 1992, canonicalPosition: "CAM",
    squadNumber: 23, ovr: 87, naturalPositions: ["CAM"], secondaryPositions: ["CM", "LW"], hasLegendSeal: true,
    legendSealReason: "Brought on in the 59th minute in Lisbon to turn the tide of the final with magic dribbling",
    appearances: 53, goals: 11, assists: 9, ratingRationale: "Magical creative maestro, appeared in 53 matches across all competitions.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 59th min of 2014 UCL final"
  },
  {
    id: "alvaro-morata-madrid-2014", identityId: "alvaro-morata", editionId: "real-madrid-2013-14",
    name: "Álvaro Morata", commonName: "Álvaro Morata", nationality: "Spain", birthYear: 1992, canonicalPosition: "ST",
    squadNumber: 21, ovr: 82, naturalPositions: ["ST"], secondaryPositions: ["CF"],
    appearances: 34, goals: 9, assists: 1, ratingRationale: "Substituted on in the Lisbon final, scored 9 goals in breakout season.",
    sourceId: "uefa-cl-history", sourceFact: "Substituted on in 2014 UCL final"
  },
  {
    id: "jese-rodriguez-madrid-2014", identityId: "jese-rodriguez", editionId: "real-madrid-2013-14",
    name: "Jesé Rodríguez", commonName: "Jesé", nationality: "Spain", birthYear: 1993, canonicalPosition: "LW",
    squadNumber: 20, ovr: 82, naturalPositions: ["LW"], secondaryPositions: ["RW", "ST"],
    appearances: 31, goals: 8, assists: 6, ratingRationale: "Sensational breakout forward before tragic knee injury vs Schalke.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in El Clásico at Camp Nou"
  },

  // 12. Barcelona 2014-15 (MSN Treble)
  {
    id: "claudio-bravo-barca-2015", identityId: "claudio-bravo", editionId: "barcelona-2014-15",
    name: "Claudio Bravo", commonName: "Claudio Bravo", nationality: "Chile", birthYear: 1983, canonicalPosition: "GK",
    squadNumber: 13, ovr: 87, naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Won the Ricardo Zamora Trophy conceding just 19 goals in 37 La Liga games (23 clean sheets)",
    appearances: 37, goals: 0, cleanSheets: 23, ratingRationale: "Zamora Trophy winner, 755 consecutive minutes without conceding.",
    sourceId: "rsssf-global", sourceFact: "2015 Zamora Trophy winner with 23 clean sheets"
  },
  {
    id: "marc-bartra-barca-2015", identityId: "marc-bartra", editionId: "barcelona-2014-15",
    name: "Marc Bartra", commonName: "Marc Bartra", nationality: "Spain", birthYear: 1991, canonicalPosition: "CB",
    squadNumber: 15, ovr: 82, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 25, goals: 1, assists: 3, ratingRationale: "Reliable ball-playing central defender who made 25 appearances.",
    sourceId: "uefa-cl-history", sourceFact: "2015 Treble winner"
  },
  {
    id: "jeremy-mathieu-barca-2015", identityId: "jeremy-mathieu", editionId: "barcelona-2014-15",
    name: "Jérémy Mathieu", commonName: "Jérémy Mathieu", nationality: "France", birthYear: 1983, canonicalPosition: "CB",
    squadNumber: 24, ovr: 83, naturalPositions: ["CB"], secondaryPositions: ["LB"], hasLegendSeal: true,
    legendSealReason: "Scored the opening header in the crucial 2-1 Clásico win over Real Madrid and winning header at Celta Vigo",
    appearances: 41, goals: 3, cleanSheets: 18, ratingRationale: "Clutch defender whose headers against Madrid and Celta secured the title.",
    sourceId: "rsssf-global", sourceFact: "Scored opening goal in 2-1 El Clásico win"
  },
  {
    id: "adriano-barca-2015", identityId: "adriano-correia", editionId: "barcelona-2014-15",
    name: "Adriano Correia", commonName: "Adriano", nationality: "Brazil", birthYear: 1984, canonicalPosition: "LB",
    squadNumber: 21, ovr: 81, naturalPositions: ["LB"], secondaryPositions: ["RB", "LWB"],
    appearances: 27, goals: 2, assists: 2, ratingRationale: "Two-footed Brazilian full-back who scored stunners from distance.",
    sourceId: "uefa-cl-history", sourceFact: "2015 Treble winner"
  },
  {
    id: "xavi-hernandez-barca-2015", identityId: "xavi-hernandez", editionId: "barcelona-2014-15",
    name: "Xavi Hernández", commonName: "Xavi", nationality: "Spain", birthYear: 1980, canonicalPosition: "CM",
    squadNumber: 6, ovr: 88, naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "Captained Barcelona to the Treble in his farewell season, lifting the Champions League trophy in Berlin",
    appearances: 44, goals: 2, assists: 10, ratingRationale: "Fairytale farewell season, came on in Berlin to lift his 4th UCL trophy.",
    sourceId: "uefa-cl-history", sourceFact: "Captained Barcelona to 2015 Champions League"
  },
  {
    id: "rafinha-alcantara-barca-2015", identityId: "rafinha-alcantara", editionId: "barcelona-2014-15",
    name: "Rafael Alcântara (Rafinha)", commonName: "Rafinha", nationality: "Brazil", birthYear: 1993, canonicalPosition: "CM",
    squadNumber: 12, ovr: 82, naturalPositions: ["CM"], secondaryPositions: ["CAM", "RW"],
    appearances: 36, goals: 2, assists: 3, ratingRationale: "Dynamic midfielder trusted by Luis Enrique across 36 games.",
    sourceId: "uefa-cl-history", sourceFact: "2015 Treble winner"
  },
  {
    id: "sergi-roberto-barca-2015", identityId: "sergi-roberto", editionId: "barcelona-2014-15",
    name: "Sergi Roberto", commonName: "Sergi Roberto", nationality: "Spain", birthYear: 1992, canonicalPosition: "CM",
    squadNumber: 20, ovr: 82, naturalPositions: ["CM"], secondaryPositions: ["RB"],
    appearances: 18, goals: 2, assists: 1, ratingRationale: "Versatile homegrown midfielder in the treble-winning squad.",
    sourceId: "uefa-cl-history", sourceFact: "2015 Treble winner"
  },
  {
    id: "pedro-rodriguez-barca-2015", identityId: "pedro-rodriguez", editionId: "barcelona-2014-15",
    name: "Pedro Rodríguez", commonName: "Pedro", nationality: "Spain", birthYear: 1987, canonicalPosition: "RW",
    squadNumber: 7, ovr: 86, naturalPositions: ["RW"], secondaryPositions: ["LW", "ST"], hasLegendSeal: true,
    legendSealReason: "Assisted Neymar's 97th-minute sealer in the Berlin final to crown the historic Treble",
    appearances: 50, goals: 11, assists: 9, ratingRationale: "50 appearances, 20 goal contributions, provided Berlin final assist.",
    sourceId: "uefa-cl-history", sourceFact: "Assisted final goal in 2015 UCL final"
  },

  // 13. Real Madrid 2016-17 (Double & Cardiff)
  {
    id: "kiko-casilla-madrid-2017", identityId: "kiko-casilla", editionId: "real-madrid-2016-17",
    name: "Kiko Casilla", commonName: "Kiko Casilla", nationality: "Spain", birthYear: 1986, canonicalPosition: "GK",
    squadNumber: 13, ovr: 80, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 19, goals: 0, cleanSheets: 7, ratingRationale: "Key contributor to Madrid's famous 'Plan B' rotated squad.",
    sourceId: "rsssf-global", sourceFact: "Started 11 La Liga games in 2017 title run"
  },
  {
    id: "pepe-madrid-2017", identityId: "pepe", editionId: "real-madrid-2016-17",
    name: "Képler Laveran de Lima Ferreira (Pepe)", commonName: "Pepe", nationality: "Portugal", birthYear: 1983, canonicalPosition: "CB",
    squadNumber: 3, ovr: 88, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 18, goals: 2, cleanSheets: 8, ratingRationale: "Scored in the Madrid derby, consummate warrior in his 10th and final season.",
    sourceId: "uefa-cl-history", sourceFact: "2017 Champions League & La Liga winner"
  },
  {
    id: "nacho-fernandez-madrid-2017", identityId: "nacho-fernandez", editionId: "real-madrid-2016-17",
    name: "Nacho Fernández", commonName: "Nacho", nationality: "Spain", birthYear: 1990, canonicalPosition: "CB",
    squadNumber: 6, ovr: 84, naturalPositions: ["CB"], secondaryPositions: ["RB", "LB"],
    appearances: 39, goals: 3, assists: 3, ratingRationale: "Sensational scissor-kick goal in Copa, 39 appearances across defense.",
    sourceId: "uefa-cl-history", sourceFact: "Played in 39 matches across 2016-17 double"
  },
  {
    id: "danilo-madrid-2017", identityId: "danilo-silva", editionId: "real-madrid-2016-17",
    name: "Danilo Luiz da Silva", commonName: "Danilo", nationality: "Brazil", birthYear: 1991, canonicalPosition: "RB",
    squadNumber: 23, ovr: 82, naturalPositions: ["RB"], secondaryPositions: ["LB", "RWB"],
    appearances: 25, goals: 1, assists: 3, ratingRationale: "Powerful full-back who started critical away victories during the run-in.",
    sourceId: "rsssf-global", sourceFact: "2017 Champions League & La Liga winner"
  },
  {
    id: "mateo-kovacic-madrid-2017", identityId: "mateo-kovacic", editionId: "real-madrid-2016-17",
    name: "Mateo Kovačić", commonName: "Mateo Kovačić", nationality: "Croatia", birthYear: 1994, canonicalPosition: "CM",
    squadNumber: 16, ovr: 85, naturalPositions: ["CM"], secondaryPositions: ["CDM"],
    appearances: 39, goals: 2, assists: 3, ratingRationale: "Dynamic press-resistant dribbler who anchored Zidane's rotated midfield.",
    sourceId: "uefa-cl-history", sourceFact: "2017 Champions League winner"
  },
  {
    id: "james-rodriguez-madrid-2017", identityId: "james-rodriguez", editionId: "real-madrid-2016-17",
    name: "James Rodríguez", commonName: "James Rodríguez", nationality: "Colombia", birthYear: 1991, canonicalPosition: "CAM",
    squadNumber: 10, ovr: 88, naturalPositions: ["CAM"], secondaryPositions: ["RW", "CM"], hasLegendSeal: true,
    legendSealReason: "Scored 11 goals and gave 12 assists in 33 games, including El Clásico equalizer at the Bernabéu",
    appearances: 33, goals: 11, assists: 12, ratingRationale: "Incredible efficiency with 23 goal contributions in limited minutes.",
    sourceId: "rsssf-global", sourceFact: "11 goals and 12 assists in 2016-17"
  },
  {
    id: "alvaro-morata-madrid-2017", identityId: "alvaro-morata", editionId: "real-madrid-2016-17",
    name: "Álvaro Morata", commonName: "Álvaro Morata", nationality: "Spain", birthYear: 1992, canonicalPosition: "ST",
    squadNumber: 21, ovr: 86, naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Second highest scorer for Madrid with 20 goals in all competitions, spearheading the title-winning B team",
    appearances: 43, goals: 20, assists: 5, ratingRationale: "20 goals in 43 games, decisive in sealing the first Double in 59 years.",
    sourceId: "rsssf-global", sourceFact: "Scored 20 goals in 2016-17 double"
  },
  {
    id: "marco-asensio-madrid-2017", identityId: "marco-asensio", editionId: "real-madrid-2016-17",
    name: "Marco Asensio", commonName: "Marco Asensio", nationality: "Spain", birthYear: 1996, canonicalPosition: "LW",
    squadNumber: 20, ovr: 86, naturalPositions: ["LW"], secondaryPositions: ["RW", "CAM"], hasLegendSeal: true,
    legendSealReason: "Scored on every single competition debut including the 84th-minute 4th goal in the Cardiff UCL final vs Juventus",
    appearances: 38, goals: 10, assists: 4, ratingRationale: "Sensational debut year, scored in Cardiff Champions League final.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in 2017 Cardiff Champions League final"
  },
  {
    id: "lucas-vazquez-madrid-2017", identityId: "lucas-vazquez", editionId: "real-madrid-2016-17",
    name: "Lucas Vázquez", commonName: "Lucas Vázquez", nationality: "Spain", birthYear: 1991, canonicalPosition: "RW",
    squadNumber: 17, ovr: 84, naturalPositions: ["RW"], secondaryPositions: ["RM", "RB"],
    appearances: 50, goals: 4, assists: 11, ratingRationale: "Zidane's most deployed substitute, playing in 50 matches with 11 assists.",
    sourceId: "uefa-cl-history", sourceFact: "50 appearances in 2016-17 double"
  },

  // 14. Liverpool 2018-19 (Madrid Champions League)
  {
    id: "simon-mignolet-liverpool-2019", identityId: "simon-mignolet", editionId: "liverpool-2018-19",
    name: "Simon Mignolet", commonName: "Simon Mignolet", nationality: "Belgium", birthYear: 1988, canonicalPosition: "GK",
    squadNumber: 22, ovr: 80, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 2, goals: 0, cleanSheets: 0, ratingRationale: "Senior backup keeper during the Champions League triumph.",
    sourceId: "uefa-cl-history", sourceFact: "2019 Champions League winner"
  },
  {
    id: "dejan-lovren-liverpool-2019", identityId: "dejan-lovren", editionId: "liverpool-2018-19",
    name: "Dejan Lovren", commonName: "Dejan Lovren", nationality: "Croatia", birthYear: 1989, canonicalPosition: "CB",
    squadNumber: 6, ovr: 83, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 18, goals: 1, cleanSheets: 6, ratingRationale: "Experienced center back who started 18 games across defense.",
    sourceId: "uefa-cl-history", sourceFact: "2019 Champions League winner"
  },
  {
    id: "joe-gomez-liverpool-2019", identityId: "joe-gomez", editionId: "liverpool-2018-19",
    name: "Joe Gomez", commonName: "Joe Gomez", nationality: "England", birthYear: 1997, canonicalPosition: "CB",
    squadNumber: 12, ovr: 83, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 25, goals: 0, cleanSheets: 13, ratingRationale: "Substituted on in the Madrid final, brilliant pace and recovery.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 2019 Madrid UCL final"
  },
  {
    id: "james-milner-liverpool-2019", identityId: "james-milner", editionId: "liverpool-2018-19",
    name: "James Milner", commonName: "James Milner", nationality: "England", birthYear: 1986, canonicalPosition: "CM",
    squadNumber: 7, ovr: 85, naturalPositions: ["CM"], secondaryPositions: ["LB", "RB"], hasLegendSeal: true,
    legendSealReason: "Vice-captain who set all-time Champions League single-season assist record (9) and came on in Madrid final",
    appearances: 45, goals: 7, assists: 7, ratingRationale: "All-time UCL assist record holder in a single season, supreme leader.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 2019 UCL final"
  },
  {
    id: "naby-keita-liverpool-2019", identityId: "naby-keita", editionId: "liverpool-2018-19",
    name: "Naby Keïta", commonName: "Naby Keïta", nationality: "Guinea", birthYear: 1995, canonicalPosition: "CM",
    squadNumber: 8, ovr: 83, naturalPositions: ["CM"], secondaryPositions: ["CAM"],
    appearances: 33, goals: 3, assists: 1, ratingRationale: "Dynamic progressive carrier who scored in both quarter-final legs vs Porto.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in 2019 UCL quarter-final vs Porto"
  },
  {
    id: "xherdan-shaqiri-liverpool-2019", identityId: "xherdan-shaqiri", editionId: "liverpool-2018-19",
    name: "Xherdan Shaqiri", commonName: "Xherdan Shaqiri", nationality: "Switzerland", birthYear: 1991, canonicalPosition: "RW",
    squadNumber: 23, ovr: 84, naturalPositions: ["RW"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Scored two goals off the bench vs Man Utd, and delivered perfect cross for Wijnaldum's 3rd goal in 4-0 Barca comeback",
    appearances: 30, goals: 6, assists: 5, ratingRationale: "Assisted the crucial 3rd goal in the iconic 4-0 Barcelona comeback.",
    sourceId: "uefa-cl-history", sourceFact: "Assisted Wijnaldum in 4-0 Barcelona comeback"
  },
  {
    id: "divock-origi-liverpool-2019", identityId: "divock-origi", editionId: "liverpool-2018-19",
    name: "Divock Origi", commonName: "Divock Origi", nationality: "Belgium", birthYear: 1995, canonicalPosition: "ST",
    squadNumber: 27, ovr: 85, naturalPositions: ["ST"], secondaryPositions: ["LW"], hasLegendSeal: true,
    legendSealReason: "Scored 2 goals including 'corner taken quickly' in 4-0 comeback vs Barca, and the 87th-minute 2nd goal in Madrid final",
    appearances: 21, goals: 7, assists: 2, ratingRationale: "The ultimate clutch cult hero in Champions League history.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in 2019 Madrid Champions League final"
  },
  {
    id: "daniel-sturridge-liverpool-2019", identityId: "daniel-sturridge", editionId: "liverpool-2018-19",
    name: "Daniel Sturridge", commonName: "Daniel Sturridge", nationality: "England", birthYear: 1989, canonicalPosition: "ST",
    squadNumber: 15, ovr: 81, naturalPositions: ["ST"], secondaryPositions: ["CF"],
    appearances: 27, goals: 4, assists: 2, ratingRationale: "Scored thunderous opener vs PSG and wonder strike at Stamford Bridge.",
    sourceId: "uefa-cl-history", sourceFact: "Scored opening goal vs PSG in 2019 UCL"
  },

  // 15. Manchester City 2022-23 (Treble)
  {
    id: "stefan-ortega-mancity-2023", identityId: "stefan-ortega", editionId: "manchester-city-2022-23",
    name: "Stefan Ortega", commonName: "Stefan Ortega", nationality: "Germany", birthYear: 1992, canonicalPosition: "GK",
    squadNumber: 18, ovr: 82, naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Started and kept clean sheets throughout the entire FA Cup campaign, winning the Wembley final vs Man Utd",
    appearances: 14, goals: 0, cleanSheets: 9, ratingRationale: "Superb distribution and shot-stopping, FA Cup winning keeper.",
    sourceId: "rsssf-global", sourceFact: "Started 2023 FA Cup final in Treble win"
  },
  {
    id: "aymeric-laporte-mancity-2023", identityId: "aymeric-laporte", editionId: "manchester-city-2022-23",
    name: "Aymeric Laporte", commonName: "Aymeric Laporte", nationality: "Spain", birthYear: 1994, canonicalPosition: "CB",
    squadNumber: 14, ovr: 86, naturalPositions: ["CB"], secondaryPositions: ["LB"],
    appearances: 24, goals: 0, cleanSheets: 10, ratingRationale: "Elite left-footed ball-playing center-back in the Treble squad.",
    sourceId: "uefa-cl-history", sourceFact: "2023 Treble winner"
  },
  {
    id: "sergio-gomez-mancity-2023", identityId: "sergio-gomez", editionId: "manchester-city-2022-23",
    name: "Sergio Gómez", commonName: "Sergio Gómez", nationality: "Spain", birthYear: 2000, canonicalPosition: "LB",
    squadNumber: 21, ovr: 78, naturalPositions: ["LB"], secondaryPositions: ["LWB"],
    appearances: 23, goals: 0, assists: 2, ratingRationale: "Technical young Spanish full-back providing depth across competitions.",
    sourceId: "uefa-cl-history", sourceFact: "2023 Treble winner"
  },
  {
    id: "kalvin-phillips-mancity-2023", identityId: "kalvin-phillips", editionId: "manchester-city-2022-23",
    name: "Kalvin Phillips", commonName: "Kalvin Phillips", nationality: "England", birthYear: 1995, canonicalPosition: "CDM",
    squadNumber: 4, ovr: 80, naturalPositions: ["CDM"], secondaryPositions: ["CM"],
    appearances: 21, goals: 0, cleanSheets: 9, ratingRationale: "England international providing defensive midfield rotation for Rodri.",
    sourceId: "rsssf-global", sourceFact: "2023 Treble winner"
  },
  {
    id: "cole-palmer-mancity-2023", identityId: "cole-palmer", editionId: "manchester-city-2022-23",
    name: "Cole Palmer", commonName: "Cole Palmer", nationality: "England", birthYear: 2002, canonicalPosition: "RW",
    squadNumber: 80, ovr: 83, naturalPositions: ["RW"], secondaryPositions: ["CAM"],
    appearances: 25, goals: 1, assists: 1, ratingRationale: "Young English attacking prodigy in City's historic Treble roster.",
    sourceId: "uefa-cl-history", sourceFact: "2023 Treble winner"
  },
  {
    id: "riyad-mahrez-mancity-2023", identityId: "riyad-mahrez", editionId: "manchester-city-2022-23",
    name: "Riyad Mahrez", commonName: "Riyad Mahrez", nationality: "Algeria", birthYear: 1991, canonicalPosition: "RW",
    squadNumber: 26, ovr: 88, naturalPositions: ["RW"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "Scored 15 goals and provided 13 assists (28 goal contributions), including historic hat-trick in FA Cup semi-final",
    appearances: 47, goals: 15, assists: 13, ratingRationale: "28 goal contributions, legendary FA Cup semi-final hat-trick.",
    sourceId: "uefa-cl-history", sourceFact: "FA Cup semi-final hat-trick in 2023 Treble"
  },
  {
    id: "julian-alvarez-mancity-2023", identityId: "julian-alvarez", editionId: "manchester-city-2022-23",
    name: "Julián Álvarez", commonName: "Julián Álvarez", nationality: "Argentina", birthYear: 2000, canonicalPosition: "ST",
    squadNumber: 19, ovr: 87, naturalPositions: ["ST"], secondaryPositions: ["CF", "RW"], hasLegendSeal: true,
    legendSealReason: "Won World Cup and Treble in same season; scored in 4-0 semi-final demolition of Real Madrid",
    appearances: 49, goals: 17, assists: 5, ratingRationale: "17 goals in debut European season, scored vs Madrid in semi-final.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in 2023 UCL semi-final vs Real Madrid"
  },
  {
    id: "phil-foden-mancity-2023", identityId: "phil-foden", editionId: "manchester-city-2022-23",
    name: "Phil Foden", commonName: "Phil Foden", nationality: "England", birthYear: 2000, canonicalPosition: "LW",
    squadNumber: 47, ovr: 89, naturalPositions: ["LW"], secondaryPositions: ["CAM", "RW"], hasLegendSeal: true,
    legendSealReason: "Substituted on in the 36th minute of the Istanbul final, brilliant creative dribble that nearly produced 2nd goal",
    appearances: 48, goals: 15, assists: 8, ratingRationale: "15 goals, stepped up in Istanbul final to secure the Champions League.",
    sourceId: "uefa-cl-history", sourceFact: "Played 54 mins in 2023 Istanbul UCL final"
  },

  // 16. Barcelona 2010-11 (Wembley Masterclass)
  {
    id: "jose-manuel-pinto-barca-2011", identityId: "jose-manuel-pinto", editionId: "barcelona-2010-11",
    name: "José Manuel Pinto", commonName: "Pinto", nationality: "Spain", birthYear: 1975, canonicalPosition: "GK",
    squadNumber: 13, ovr: 79, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 17, goals: 0, cleanSheets: 7, ratingRationale: "Starting goalkeeper in Barcelona's run to the Copa del Rey final.",
    sourceId: "rsssf-global", sourceFact: "Started 2011 Copa del Rey campaign"
  },
  {
    id: "gabriel-milito-barca-2011", identityId: "gabriel-milito", editionId: "barcelona-2010-11",
    name: "Gabriel Milito", commonName: "Gabriel Milito", nationality: "Argentina", birthYear: 1980, canonicalPosition: "CB",
    squadNumber: 18, ovr: 82, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 17, goals: 1, cleanSheets: 8, ratingRationale: "Tenacious Argentine international center back in Guardiola's squad.",
    sourceId: "uefa-cl-history", sourceFact: "2011 Champions League winner"
  },
  {
    id: "maxwell-barca-2011", identityId: "maxwell-scherrer", editionId: "barcelona-2010-11",
    name: "Maxwell Scherrer Cabelino Andrade", commonName: "Maxwell", nationality: "Brazil", birthYear: 1981, canonicalPosition: "LB",
    squadNumber: 19, ovr: 82, naturalPositions: ["LB"], secondaryPositions: ["LWB"],
    appearances: 41, goals: 1, assists: 4, ratingRationale: "Silky Brazilian left-back featuring in 41 games in double-winning year.",
    sourceId: "uefa-cl-history", sourceFact: "2011 Champions League winner"
  },
  {
    id: "adriano-barca-2011", identityId: "adriano-correia", editionId: "barcelona-2010-11",
    name: "Adriano Correia", commonName: "Adriano", nationality: "Brazil", birthYear: 1984, canonicalPosition: "LB",
    squadNumber: 21, ovr: 82, naturalPositions: ["LB"], secondaryPositions: ["RB"],
    appearances: 31, goals: 1, assists: 3, ratingRationale: "Versatile full-back who started in the Copa del Rey final and UCL knockouts.",
    sourceId: "uefa-cl-history", sourceFact: "2011 Champions League winner"
  },
  {
    id: "seydou-keita-barca-2011", identityId: "seydou-keita", editionId: "barcelona-2010-11",
    name: "Seydou Keita", commonName: "Seydou Keita", nationality: "Mali", birthYear: 1980, canonicalPosition: "CM",
    squadNumber: 15, ovr: 85, naturalPositions: ["CM"], secondaryPositions: ["CDM"],
    appearances: 56, goals: 6, assists: 3, ratingRationale: "Played in 56 matches across all competitions, came on in Wembley final.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 2011 Wembley UCL final"
  },
  {
    id: "javier-mascherano-barca-2011", identityId: "javier-mascherano", editionId: "barcelona-2010-11",
    name: "Javier Mascherano", commonName: "Javier Mascherano", nationality: "Argentina", birthYear: 1984, canonicalPosition: "CB",
    squadNumber: 14, ovr: 88, naturalPositions: ["CB"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "Iconic tackle on Bendtner to save Barca in UCL round of 16; started at center back in Wembley final win vs Man Utd",
    appearances: 45, goals: 0, cleanSheets: 22, ratingRationale: "Legendary transition to center-back, towering performance at Wembley.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2011 Wembley UCL final at center-back"
  },
  {
    id: "ibrahim-afellay-barca-2011", identityId: "ibrahim-afellay", editionId: "barcelona-2010-11",
    name: "Ibrahim Afellay", commonName: "Ibrahim Afellay", nationality: "Netherlands", birthYear: 1986, canonicalPosition: "LW",
    squadNumber: 20, ovr: 82, naturalPositions: ["LW"], secondaryPositions: ["CAM", "RW"], hasLegendSeal: true,
    legendSealReason: "Dribbled past Marcelo at the Bernabéu to cross for Messi's opening goal in the 2-0 UCL semi-final",
    appearances: 28, goals: 2, assists: 2, ratingRationale: "Delivered the historic assist at the Bernabéu, came on at Wembley.",
    sourceId: "uefa-cl-history", sourceFact: "Assisted Messi at Bernabéu in 2011 UCL semi"
  },
  {
    id: "bojan-krkic-barca-2011", identityId: "bojan-krkic", editionId: "barcelona-2010-11",
    name: "Bojan Krkić", commonName: "Bojan", nationality: "Spain", birthYear: 1990, canonicalPosition: "ST",
    squadNumber: 9, ovr: 81, naturalPositions: ["ST"], secondaryPositions: ["LW"],
    appearances: 37, goals: 7, assists: 3, ratingRationale: "Clutch poacher who scored 7 goals in Barcelona's double triumph.",
    sourceId: "rsssf-global", sourceFact: "2011 Champions League & La Liga winner"
  },

  // 17. Barcelona 2005-06 (Paris Champions League)
  {
    id: "albert-jorquera-barca-2006", identityId: "albert-jorquera", editionId: "barcelona-2005-06",
    name: "Albert Jorquera", commonName: "Albert Jorquera", nationality: "Spain", birthYear: 1979, canonicalPosition: "GK",
    squadNumber: 25, ovr: 77, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 8, goals: 0, cleanSheets: 3, ratingRationale: "Homegrown backup goalkeeper in Rijkaard's European champions squad.",
    sourceId: "uefa-cl-history", sourceFact: "2006 Champions League winner"
  },
  {
    id: "juliano-belletti-barca-2006", identityId: "juliano-belletti", editionId: "barcelona-2005-06",
    name: "Juliano Belletti", commonName: "Belletti", nationality: "Brazil", birthYear: 1976, canonicalPosition: "RB",
    squadNumber: 2, ovr: 84, naturalPositions: ["RB"], secondaryPositions: ["RWB"], hasLegendSeal: true,
    legendSealReason: "Scored the historic 81st-minute winning goal in the 2006 Champions League final against Arsenal in Paris",
    appearances: 42, goals: 1, assists: 3, ratingRationale: "Scored the immortal winning goal in Paris to end Barca's 14-year European wait.",
    sourceId: "uefa-cl-history", sourceFact: "81st min winning goal in 2006 Paris UCL final"
  },
  {
    id: "sylvinho-barca-2006", identityId: "sylvinho", editionId: "barcelona-2005-06",
    name: "Sylvinho", commonName: "Sylvinho", nationality: "Brazil", birthYear: 1974, canonicalPosition: "LB",
    squadNumber: 16, ovr: 81, naturalPositions: ["LB"], secondaryPositions: ["LWB"],
    appearances: 26, goals: 2, assists: 3, ratingRationale: "Experienced Brazilian full-back in the double-winning squad.",
    sourceId: "uefa-cl-history", sourceFact: "2006 Champions League & La Liga winner"
  },
  {
    id: "thiago-motta-barca-2006", identityId: "thiago-motta", editionId: "barcelona-2005-06",
    name: "Thiago Motta", commonName: "Thiago Motta", nationality: "Italy", birthYear: 1982, canonicalPosition: "CDM",
    squadNumber: 3, ovr: 82, naturalPositions: ["CDM"], secondaryPositions: ["CM"],
    appearances: 23, goals: 1, assists: 1, ratingRationale: "Physical defensive midfielder, started in knockouts vs Chelsea and Benfica.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2006 UCL knockouts"
  },
  {
    id: "andres-iniesta-barca-2006", identityId: "andres-iniesta", editionId: "barcelona-2005-06",
    name: "Andrés Iniesta", commonName: "Andrés Iniesta", nationality: "Spain", birthYear: 1984, canonicalPosition: "CM",
    squadNumber: 24, ovr: 86, naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Came on at halftime in the Paris final vs Arsenal to completely transform the tempo and initiate the comeback",
    appearances: 44, goals: 1, assists: 6, ratingRationale: "Game-changing halftime substitute in the 2006 Paris final.",
    sourceId: "uefa-cl-history", sourceFact: "Halftime substitute in 2006 Paris UCL final"
  },
  {
    id: "gabri-garcia-barca-2006", identityId: "gabri-garcia", editionId: "barcelona-2005-06",
    name: "Gabriel García de la Torre (Gabri)", commonName: "Gabri", nationality: "Spain", birthYear: 1979, canonicalPosition: "RM",
    squadNumber: 18, ovr: 80, naturalPositions: ["RM"], secondaryPositions: ["RB", "CM"],
    appearances: 20, goals: 1, assists: 2, ratingRationale: "Versatile squad utility player across European and domestic title campaigns.",
    sourceId: "uefa-cl-history", sourceFact: "2006 Champions League winner"
  },
  {
    id: "henrik-larsson-barca-2006", identityId: "henrik-larsson", editionId: "barcelona-2005-06",
    name: "Henrik Larsson", commonName: "Henrik Larsson", nationality: "Sweden", birthYear: 1971, canonicalPosition: "ST",
    squadNumber: 17, ovr: 87, naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Brought on in the 61st minute of Paris final to provide two sublime assists for Eto'o and Belletti to win the trophy",
    appearances: 42, goals: 15, assists: 7, ratingRationale: "Henry called him the match-winner of the 2006 final, 2 magical assists.",
    sourceId: "uefa-cl-history", sourceFact: "Two assists in 2006 Paris Champions League final"
  },
  {
    id: "maxi-lopez-barca-2006", identityId: "maxi-lopez", editionId: "barcelona-2005-06",
    name: "Maxi López", commonName: "Maxi López", nationality: "Argentina", birthYear: 1984, canonicalPosition: "ST",
    squadNumber: 11, ovr: 78, naturalPositions: ["ST"], secondaryPositions: [],
    appearances: 15, goals: 1, assists: 1, ratingRationale: "Blonde powerhouse striker who provided physical attacking option.",
    sourceId: "uefa-cl-history", sourceFact: "2006 Champions League winner"
  },

  // 18. Real Madrid 2011-12 (100-Point Mourinho)
  {
    id: "antonio-adan-madrid-2012", identityId: "antonio-adan", editionId: "real-madrid-2011-12",
    name: "Antonio Adán", commonName: "Antonio Adán", nationality: "Spain", birthYear: 1987, canonicalPosition: "GK",
    squadNumber: 13, ovr: 78, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 5, goals: 0, cleanSheets: 3, ratingRationale: "Homegrown backup goalkeeper in the historic 100-point La Liga title run.",
    sourceId: "rsssf-global", sourceFact: "2012 La Liga 100-point champion"
  },
  {
    id: "raul-albiol-madrid-2012", identityId: "raul-albiol", editionId: "real-madrid-2011-12",
    name: "Raúl Albiol", commonName: "Raúl Albiol", nationality: "Spain", birthYear: 1985, canonicalPosition: "CB",
    squadNumber: 18, ovr: 82, naturalPositions: ["CB"], secondaryPositions: ["RB"],
    appearances: 17, goals: 0, cleanSheets: 7, ratingRationale: "World Cup winning center-back who bolstered Madrid's defensive unit.",
    sourceId: "rsssf-global", sourceFact: "2012 La Liga champion"
  },
  {
    id: "raphael-varane-madrid-2012", identityId: "raphael-varane", editionId: "real-madrid-2011-12",
    name: "Raphaël Varane", commonName: "Raphaël Varane", nationality: "France", birthYear: 1993, canonicalPosition: "CB",
    squadNumber: 19, ovr: 82, naturalPositions: ["CB"], secondaryPositions: [],
    appearances: 15, goals: 2, cleanSheets: 6, ratingRationale: "Breakout debut season at age 18, recommended by Zinedine Zidane.",
    sourceId: "rsssf-global", sourceFact: "Scored backheel volley on debut season"
  },
  {
    id: "fabio-coentrao-madrid-2012", identityId: "fabio-coentrao", editionId: "real-madrid-2011-12",
    name: "Fábio Coentrão", commonName: "Fábio Coentrão", nationality: "Portugal", birthYear: 1988, canonicalPosition: "LB",
    squadNumber: 15, ovr: 85, naturalPositions: ["LB"], secondaryPositions: ["LWB", "CDM"],
    appearances: 33, goals: 0, assists: 3, ratingRationale: "Started key European knockout games and Camp Nou Clásico win.",
    sourceId: "rsssf-global", sourceFact: "Started 2-1 Camp Nou Clásico win in 2012"
  },
  {
    id: "lassana-diarra-madrid-2012", identityId: "lassana-diarra", editionId: "real-madrid-2011-12",
    name: "Lassana Diarra", commonName: "Lass Diarra", nationality: "France", birthYear: 1985, canonicalPosition: "CDM",
    squadNumber: 24, ovr: 83, naturalPositions: ["CDM"], secondaryPositions: ["RB", "CM"],
    appearances: 25, goals: 0, assists: 1, ratingRationale: "Tenacious French ball winner in Mourinho's counter-attacking setup.",
    sourceId: "rsssf-global", sourceFact: "2012 La Liga champion"
  },
  {
    id: "esteban-granero-madrid-2012", identityId: "esteban-granero", editionId: "real-madrid-2011-12",
    name: "Esteban Granero", commonName: "Esteban Granero", nationality: "Spain", birthYear: 1987, canonicalPosition: "CM",
    squadNumber: 11, ovr: 81, naturalPositions: ["CM"], secondaryPositions: ["CAM"],
    appearances: 28, goals: 0, assists: 2, ratingRationale: "The 'Pirate', intelligent tactical midfielder trusted in tight fixtures.",
    sourceId: "rsssf-global", sourceFact: "2012 La Liga 100-point champion"
  },
  {
    id: "kaka-madrid-2012", identityId: "kaka", editionId: "real-madrid-2011-12",
    name: "Ricardo Izecson dos Santos Leite (Kaká)", commonName: "Kaká", nationality: "Brazil", birthYear: 1982, canonicalPosition: "CAM",
    squadNumber: 8, ovr: 87, naturalPositions: ["CAM"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Registered 8 goals and 14 assists across 40 games, including 3 goals and 5 assists in the Champions League",
    appearances: 40, goals: 8, assists: 14, ratingRationale: "22 goal contributions in 40 appearances, sublime playmaker output.",
    sourceId: "uefa-cl-history", sourceFact: "8 goals, 14 assists in 2011-12 season"
  },
  {
    id: "jose-callejon-madrid-2012", identityId: "jose-callejon", editionId: "real-madrid-2011-12",
    name: "José Callejón", commonName: "José Callejón", nationality: "Spain", birthYear: 1987, canonicalPosition: "RW",
    squadNumber: 21, ovr: 83, naturalPositions: ["RW"], secondaryPositions: ["LW", "ST"],
    appearances: 36, goals: 13, assists: 3, ratingRationale: "Clinical impact substitute who scored 13 goals in all competitions.",
    sourceId: "rsssf-global", sourceFact: "Scored 13 goals in 2011-12 title season"
  },
  {
    id: "gonzalo-higuain-madrid-2012", identityId: "gonzalo-higuain", editionId: "real-madrid-2011-12",
    name: "Gonzalo Higuaín", commonName: "Gonzalo Higuaín", nationality: "Argentina", birthYear: 1987, canonicalPosition: "ST",
    squadNumber: 20, ovr: 89, naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Scored 22 La Liga goals (26 overall) as part of Madrid's record-shattering 121-goal league season",
    appearances: 54, goals: 26, assists: 11, ratingRationale: "Formed devastating attacking trident with Ronaldo and Benzema.",
    sourceId: "rsssf-global", sourceFact: "22 La Liga goals in 100-point season"
  },

  // 19. Real Madrid 2021-22 (14th UCL & La Liga)
  {
    id: "andriy-lunin-madrid-2022", identityId: "andriy-lunin", editionId: "real-madrid-2021-22",
    name: "Andriy Lunin", commonName: "Andriy Lunin", nationality: "Ukraine", birthYear: 1999, canonicalPosition: "GK",
    squadNumber: 13, ovr: 80, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 4, goals: 0, cleanSheets: 1, ratingRationale: "Dependable young Ukrainian shot-stopper backing up Courtois.",
    sourceId: "uefa-cl-history", sourceFact: "2022 Champions League & La Liga winner"
  },
  {
    id: "nacho-fernandez-madrid-2022", identityId: "nacho-fernandez", editionId: "real-madrid-2021-22",
    name: "Nacho Fernández", commonName: "Nacho", nationality: "Spain", birthYear: 1990, canonicalPosition: "CB",
    squadNumber: 6, ovr: 84, naturalPositions: ["CB"], secondaryPositions: ["RB", "LB"],
    appearances: 42, goals: 3, cleanSheets: 15, ratingRationale: "Heroic defensive display in the 3-1 comeback vs Man City.",
    sourceId: "uefa-cl-history", sourceFact: "Started 3-1 semi-final comeback vs Man City"
  },
  {
    id: "marcelo-madrid-2022", identityId: "marcelo-vieira", editionId: "real-madrid-2021-22",
    name: "Marcelo Vieira", commonName: "Marcelo", nationality: "Brazil", birthYear: 1988, canonicalPosition: "LB",
    squadNumber: 12, ovr: 82, naturalPositions: ["LB"], secondaryPositions: [],
    appearances: 18, goals: 0, assists: 2, ratingRationale: "Captained Real Madrid to his 25th trophy, becoming most decorated player in club history.",
    sourceId: "uefa-cl-history", sourceFact: "Captained Madrid to 2022 UCL trophy"
  },
  {
    id: "lucas-vazquez-madrid-2022", identityId: "lucas-vazquez", editionId: "real-madrid-2021-22",
    name: "Lucas Vázquez", commonName: "Lucas Vázquez", nationality: "RB", birthYear: 1991, canonicalPosition: "RB",
    squadNumber: 17, ovr: 83, naturalPositions: ["RB"], secondaryPositions: ["RW", "RM"],
    appearances: 41, goals: 3, assists: 1, ratingRationale: "Transitioned brilliantly into right-back, dependable in 41 matches.",
    sourceId: "rsssf-global", sourceFact: "2022 Champions League & La Liga winner"
  },
  {
    id: "eduardo-camavinga-madrid-2022", identityId: "eduardo-camavinga", editionId: "real-madrid-2021-22",
    name: "Eduardo Camavinga", commonName: "Eduardo Camavinga", nationality: "France", birthYear: 2002, canonicalPosition: "CM",
    squadNumber: 25, ovr: 86, naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "Super-sub extraordinaire whose entry turned around PSG, Chelsea, and Manchester City ties in UCL knockouts",
    appearances: 40, goals: 2, assists: 2, ratingRationale: "Catalyzed all three miraculous Bernabéu Champions League comebacks.",
    sourceId: "uefa-cl-history", sourceFact: "Turnaround catalyst in 2022 UCL comebacks"
  },
  {
    id: "dani-ceballos-madrid-2022", identityId: "dani-ceballos", editionId: "real-madrid-2021-22",
    name: "Dani Ceballos", commonName: "Dani Ceballos", nationality: "Spain", birthYear: 1996, canonicalPosition: "CM",
    squadNumber: 19, ovr: 81, naturalPositions: ["CM"], secondaryPositions: ["CAM"],
    appearances: 18, goals: 0, assists: 1, ratingRationale: "Substituted on in the Paris final vs Liverpool to see out the 1-0 win.",
    sourceId: "uefa-cl-history", sourceFact: "Came on in 2022 Paris UCL final"
  },
  {
    id: "marco-asensio-madrid-2022", identityId: "marco-asensio", editionId: "real-madrid-2021-22",
    name: "Marco Asensio", commonName: "Marco Asensio", nationality: "Spain", birthYear: 1996, canonicalPosition: "RW",
    squadNumber: 11, ovr: 85, naturalPositions: ["RW"], secondaryPositions: ["LW", "CAM"],
    appearances: 42, goals: 12, assists: 2, ratingRationale: "3rd top scorer with 12 goals across Madrid's double triumph.",
    sourceId: "rsssf-global", sourceFact: "Scored 12 goals in 2021-22 season"
  },
  {
    id: "rodrygo-madrid-2022", identityId: "rodrygo-goes", editionId: "real-madrid-2021-22",
    name: "Rodrygo Silva de Goes", commonName: "Rodrygo", nationality: "Brazil", birthYear: 2001, canonicalPosition: "RW",
    squadNumber: 21, ovr: 88, naturalPositions: ["RW"], secondaryPositions: ["LW", "ST"], hasLegendSeal: true,
    legendSealReason: "Scored historic 90th and 91st-minute goals vs Manchester City in semi-final to force extra time and send Madrid to Paris",
    appearances: 49, goals: 9, assists: 10, ratingRationale: "Immortality in UCL semi-final with 90-second brace vs Man City.",
    sourceId: "uefa-cl-history", sourceFact: "90th & 91st min goals vs Man City in 2022 UCL"
  },
  {
    id: "eden-hazard-madrid-2022", identityId: "eden-hazard", editionId: "real-madrid-2021-22",
    name: "Eden Hazard", commonName: "Eden Hazard", nationality: "Belgium", birthYear: 1991, canonicalPosition: "LW",
    squadNumber: 7, ovr: 82, naturalPositions: ["LW"], secondaryPositions: ["CAM"],
    appearances: 23, goals: 1, assists: 2, ratingRationale: "Scored winning goal in Copa del Rey extra time, European champion.",
    sourceId: "uefa-cl-history", sourceFact: "2022 Champions League & La Liga winner"
  },

  // 20. Manchester United 1993-94 (Domestic Double)
  {
    id: "les-sealey-manutd-1994", identityId: "les-sealey", editionId: "manchester-united-1993-94",
    name: "Les Sealey", commonName: "Les Sealey", nationality: "England", birthYear: 1957, canonicalPosition: "GK",
    squadNumber: 13, ovr: 77, naturalPositions: ["GK"], secondaryPositions: [],
    appearances: 3, goals: 0, cleanSheets: 1, ratingRationale: "Experienced cult hero backup goalkeeper in Ferguson's double squad.",
    sourceId: "rsssf-global", sourceFact: "1994 Double winning squad member"
  },
  {
    id: "lee-martin-manutd-1994", identityId: "lee-martin", editionId: "manchester-united-1993-94",
    name: "Lee Martin", commonName: "Lee Martin", nationality: "England", birthYear: 1968, canonicalPosition: "LB",
    squadNumber: 15, ovr: 78, naturalPositions: ["LB"], secondaryPositions: ["LWB"],
    appearances: 8, goals: 0, cleanSheets: 3, ratingRationale: "FA Cup winning hero who provided solid defensive backup.",
    sourceId: "rsssf-global", sourceFact: "1994 Premier League winner"
  },
  {
    id: "clayton-blackmore-manutd-1994", identityId: "clayton-blackmore", editionId: "manchester-united-1993-94",
    name: "Clayton Blackmore", commonName: "Clayton Blackmore", nationality: "Wales", birthYear: 1964, canonicalPosition: "RB",
    squadNumber: 12, ovr: 80, naturalPositions: ["RB"], secondaryPositions: ["CM", "LB"],
    appearances: 14, goals: 1, assists: 2, ratingRationale: "Utility stalwart who could play anywhere across defense and midfield.",
    sourceId: "rsssf-global", sourceFact: "1994 Double winning squad member"
  },
  {
    id: "bryan-robson-manutd-1994", identityId: "bryan-robson", editionId: "manchester-united-1993-94",
    name: "Bryan Robson", commonName: "Bryan Robson", nationality: "England", birthYear: 1957, canonicalPosition: "CM",
    squadNumber: 7, ovr: 84, naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "'Captain Marvel', legendary club leader who lifted his second Premier League title in his farewell season",
    appearances: 17, goals: 2, assists: 3, ratingRationale: "Iconic captain who guided United's emerging golden generation.",
    sourceId: "rsssf-global", sourceFact: "1994 Premier League champion"
  },
  {
    id: "darren-ferguson-manutd-1994", identityId: "darren-ferguson", editionId: "manchester-united-1993-94",
    name: "Darren Ferguson", commonName: "Darren Ferguson", nationality: "Scotland", birthYear: 1972, canonicalPosition: "CM",
    squadNumber: 18, ovr: 77, naturalPositions: ["CM"], secondaryPositions: [],
    appearances: 5, goals: 0, assists: 1, ratingRationale: "Hard-working central midfielder in the double-winning squad.",
    sourceId: "rsssf-global", sourceFact: "1994 Double winner"
  },
  {
    id: "brian-mcclair-manutd-1994", identityId: "brian-mcclair", editionId: "manchester-united-1993-94",
    name: "Brian McClair", commonName: "Brian McClair", nationality: "Scotland", birthYear: 1963, canonicalPosition: "ST",
    squadNumber: 9, ovr: 84, naturalPositions: ["ST"], secondaryPositions: ["CAM", "CM"], hasLegendSeal: true,
    legendSealReason: "Scored United's 4th goal in the 4-0 FA Cup final thrashing of Chelsea to seal the Double",
    appearances: 38, goals: 6, assists: 5, ratingRationale: "Scored in 1994 FA Cup final, seamless transition to attacking midfield.",
    sourceId: "rsssf-global", sourceFact: "Scored in 1994 FA Cup final 4-0 win"
  },
  {
    id: "lee-sharpe-manutd-1994", identityId: "lee-sharpe", editionId: "manchester-united-1993-94",
    name: "Lee Sharpe", commonName: "Lee Sharpe", nationality: "England", birthYear: 1971, canonicalPosition: "LM",
    squadNumber: 5, ovr: 84, naturalPositions: ["LM"], secondaryPositions: ["LW", "LB", "RM"],
    appearances: 41, goals: 11, assists: 8, ratingRationale: "Electric left winger who scored 11 goals in the Double campaign.",
    sourceId: "rsssf-global", sourceFact: "11 goals in 1993-94 Double winning season"
  }
];
