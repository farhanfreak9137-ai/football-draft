import { PlayerDef, IdentityDef } from './modernClubBase.js';

export const modernClubPlayersPart1: PlayerDef[] = [
  // 1. Barcelona 2010-11
  {
    id: "victor-valdes-2011", identityId: "victor-valdes", editionId: "barcelona-2010-11", name: "Víctor Valdés", squadNumber: 1, ovr: 89,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 44, goals: 0, cleanSheets: 23, ratingRationale: "Won his fourth Zamora Trophy and conceded only 25 goals in 38 La Liga games.",
    sourceId: "uefa-cl-history", sourceFact: "2011 UCL Final starting GK"
  },
  {
    id: "dani-alves-2011", identityId: "dani-alves", editionId: "barcelona-2010-11", name: "Dani Alves", squadNumber: 2, ovr: 91,
    naturalPositions: ["RB", "RWB"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "2011 FIFA FIFPro World XI; 15 assists across all competitions operating as an entire right wing",
    appearances: 54, goals: 4, assists: 15, cleanSheets: 26, ratingRationale: "Peak athletic and technical display of modern wing-back play.",
    sourceId: "uefa-cl-history", sourceFact: "2011 FIFA FIFPro World XI"
  },
  {
    id: "gerard-pique-2011", identityId: "gerard-pique", editionId: "barcelona-2010-11", name: "Gerard Piqué", squadNumber: 3, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2011 FIFA FIFPro World XI & UEFA Team of the Year; imperial aerial and ball-playing mastery at Wembley",
    appearances: 51, goals: 4, cleanSheets: 25, ratingRationale: "Pivotal center-back stepping into midfield to break opposing press.",
    sourceId: "uefa-cl-history", sourceFact: "2011 FIFA FIFPro World XI"
  },
  {
    id: "carles-puyol-2011", identityId: "carles-puyol", editionId: "barcelona-2010-11", name: "Carles Puyol", squadNumber: 5, ovr: 91,
    naturalPositions: ["CB"], secondaryPositions: ["RB"], hasLegendSeal: true,
    legendSealReason: "Heartbeat captain who famously handed the captain's armband to Éric Abidal to lift the Champions League trophy at Wembley",
    appearances: 27, goals: 1, cleanSheets: 14, ratingRationale: "Legendary warrior captain whose presence assured defensive solidity.",
    sourceId: "uefa-cl-history", sourceFact: "2011 UCL winning captain gesture"
  },
  {
    id: "eric-abidal-2011", identityId: "eric-abidal", editionId: "barcelona-2010-11", name: "Éric Abidal", squadNumber: 22, ovr: 86,
    naturalPositions: ["LB", "CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Miraculously recovered from liver tumor surgery in two months to play all 90 minutes in the 2011 Wembley Final and lift the trophy",
    appearances: 41, goals: 1, cleanSheets: 20, ratingRationale: "Flawless defensive balance at left-back and inspirational leader.",
    sourceId: "uefa-cl-history", sourceFact: "Played full 90' in 2011 Final after surgery"
  },
  {
    id: "sergio-busquets-2011", identityId: "sergio-busquets", editionId: "barcelona-2010-11", name: "Sergio Busquets", squadNumber: 16, ovr: 90,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 46, goals: 1, assists: 4, cleanSheets: 24, ratingRationale: "The press-resistant architect of Pep's positional play.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2011 Wembley Final"
  },
  {
    id: "xavi-hernandez-2011", identityId: "xavi-hernandez", editionId: "barcelona-2010-11", name: "Xavi Hernández", squadNumber: 6, ovr: 96,
    naturalPositions: ["CM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2011 Ballon d'Or 3rd Place, IFFHS World's Best Playmaker; assisted Pedro's opening goal in the Wembley Final with 95% pass completion",
    appearances: 50, goals: 5, assists: 15, ratingRationale: "The supreme midfield metronome in football history.",
    sourceId: "uefa-cl-history", sourceFact: "2011 Ballon d'Or podium & Final assist"
  },
  {
    id: "andres-iniesta-2011", identityId: "andres-iniesta", editionId: "barcelona-2010-11", name: "Andrés Iniesta", squadNumber: 8, ovr: 95,
    naturalPositions: ["CM"], secondaryPositions: ["LW", "CAM"], hasLegendSeal: true,
    legendSealReason: "2010-11 FIFA FIFPro World XI; assisted Messi's 2-1 rocket in the Wembley Final and orchestrated midfield dominance",
    appearances: 50, goals: 9, assists: 15, ratingRationale: "Pure wizardry and gliding dribbles through impossible spaces.",
    sourceId: "uefa-cl-history", sourceFact: "2011 Final assist & FIFPro World XI"
  },
  {
    id: "pedro-rodriguez-2011", identityId: "pedro-rodriguez", editionId: "barcelona-2010-11", name: "Pedro", squadNumber: 17, ovr: 88,
    naturalPositions: ["RW"], secondaryPositions: ["LW"], hasLegendSeal: false,
    appearances: 53, goals: 22, assists: 10, ratingRationale: "Scored the opening goal in the 2011 Wembley Champions League Final.",
    sourceId: "uefa-cl-history", sourceFact: "2011 Final opening goalscorer"
  },
  {
    id: "david-villa-2011", identityId: "david-villa", editionId: "barcelona-2010-11", name: "David Villa", squadNumber: 7, ovr: 91,
    naturalPositions: ["LW", "ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Scored iconic curling 20-yard third goal in the 2011 Wembley Final; scored 23 goals in his debut Barcelona season",
    appearances: 52, goals: 23, assists: 9, ratingRationale: "Lethal two-footed finishing and tireless pressing from the left flank.",
    sourceId: "uefa-cl-history", sourceFact: "Iconic curling goal in 2011 UCL Final"
  },
  {
    id: "lionel-messi-2011", identityId: "lionel-messi", editionId: "barcelona-2010-11", name: "Lionel Messi", squadNumber: 10, ovr: 99,
    naturalPositions: ["CF", "RW"], secondaryPositions: ["CAM", "ST"], hasLegendSeal: true,
    legendSealReason: "2011 Ballon d'Or Winner (3rd consecutive); UEFA Champions League Final Man of the Match with 53 goals and 24 assists in 55 matches",
    appearances: 55, goals: 53, assists: 24, ratingRationale: "Peak False Nine season regarded as the pinnacle of footballing perfection.",
    sourceId: "uefa-cl-history", sourceFact: "2011 Ballon d'Or Winner & Final MOTM"
  },

  // 2. Barcelona 2005-06
  {
    id: "victor-valdes-2006", identityId: "victor-valdes", editionId: "barcelona-2005-06", name: "Víctor Valdés", squadNumber: 1, ovr: 87,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Hero of the 2006 Paris Champions League Final: made three 1-on-1 point-blank saves vs Thierry Henry to keep Barca in the match",
    appearances: 49, goals: 0, cleanSheets: 20, ratingRationale: "Match-winning performance against Arsenal in Paris.",
    sourceId: "uefa-cl-history", sourceFact: "2006 Final heroics vs Henry"
  },
  {
    id: "oleguer-presas-2006", identityId: "oleguer-presas", editionId: "barcelona-2005-06", name: "Oleguer Presas", squadNumber: 23, ovr: 80,
    naturalPositions: ["RB"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 48, goals: 0, cleanSheets: 21, ratingRationale: "Consistent right-back starting 48 matches across La Liga and Europe.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2006 UCL Final"
  },
  {
    id: "carles-puyol-2006", identityId: "carles-puyol", editionId: "barcelona-2005-06", name: "Carles Puyol", squadNumber: 5, ovr: 91,
    naturalPositions: ["CB"], secondaryPositions: ["RB"], hasLegendSeal: true,
    legendSealReason: "2005-06 UEFA Club Best Defender of the Year; captained Barcelona to their first European Cup in 14 years",
    appearances: 52, goals: 1, cleanSheets: 22, ratingRationale: "The indomitable rock of Rijkaard's defense.",
    sourceId: "uefa-cl-history", sourceFact: "2005-06 UEFA Best Defender"
  },
  {
    id: "rafael-marquez-2006", identityId: "rafael-marquez", editionId: "barcelona-2005-06", name: "Rafael Márquez", squadNumber: 4, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "First Mexican player to win the UEFA Champions League; supreme long-range diagonal passing out of the back",
    appearances: 37, goals: 1, cleanSheets: 16, ratingRationale: "'El Káiser de Michoacán' bringing poise and pinpoint distribution.",
    sourceId: "uefa-cl-history", sourceFact: "First Mexican UCL winner"
  },
  {
    id: "giovanni-van-bronckhorst-2006", identityId: "giovanni-van-bronckhorst", editionId: "barcelona-2005-06", name: "Giovanni van Bronckhorst", squadNumber: 12, ovr: 85,
    naturalPositions: ["LB"], secondaryPositions: ["LM"], hasLegendSeal: false,
    appearances: 36, goals: 1, assists: 3, cleanSheets: 15, ratingRationale: "Ever-present left-back in all 13 Champions League matches of the winning campaign.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2006 Final"
  },
  {
    id: "edmilson-2006", identityId: "edmilson", editionId: "barcelona-2005-06", name: "Edmílson", squadNumber: 15, ovr: 84,
    naturalPositions: ["CDM"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 41, goals: 0, ratingRationale: "Screened the back four and started the 2006 Champions League Final in Paris.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2006 Final"
  },
  {
    id: "deco-2006", identityId: "deco", editionId: "barcelona-2005-06", name: "Deco", squadNumber: 20, ovr: 90,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "2005-06 UEFA Club Footballer of the Year nominee; won his second Champions League with two different clubs",
    appearances: 43, goals: 5, assists: 9, ratingRationale: "Tireless pressing and playmaking dynamo linking defense to Ronaldinho.",
    sourceId: "uefa-cl-history", sourceFact: "2006 UEFA Champions League winner"
  },
  {
    id: "mark-van-bommel-2006", identityId: "mark-van-bommel", editionId: "barcelona-2005-06", name: "Mark van Bommel", squadNumber: 17, ovr: 84,
    naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 38, goals: 4, assists: 6, ratingRationale: "Tenacious physical presence in midfield who started the Paris final.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2006 Final"
  },
  {
    id: "ludovic-giuly-2006", identityId: "ludovic-giuly", editionId: "barcelona-2005-06", name: "Ludovic Giuly", squadNumber: 8, ovr: 86,
    naturalPositions: ["RW"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "Scored the famous 1-0 semi-final winner vs AC Milan at San Siro from Ronaldinho's scooped pass to send Barca to Paris",
    appearances: 42, goals: 8, assists: 6, ratingRationale: "Blistering pace and heroic clutch goal against Milan.",
    sourceId: "uefa-cl-history", sourceFact: "San Siro semi-final winner vs Milan"
  },
  {
    id: "samuel-etoo-2006", identityId: "samuel-etoo", editionId: "barcelona-2005-06", name: "Samuel Eto'o", squadNumber: 9, ovr: 93,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "2006 UEFA Champions League Final Man of the Match; scored the 76th-minute equalizer in Paris and Pichichi winner (26 league goals)",
    appearances: 47, goals: 34, assists: 9, ratingRationale: "Unstoppable speed, press, and clutch final equalizer.",
    sourceId: "uefa-cl-history", sourceFact: "2006 UCL Final MOTM & Pichichi"
  },
  {
    id: "ronaldinho-2006", identityId: "ronaldinho", editionId: "barcelona-2005-06", name: "Ronaldinho", squadNumber: 10, ovr: 98,
    naturalPositions: ["LW", "CAM"], secondaryPositions: ["CF", "RW"], hasLegendSeal: true,
    legendSealReason: "2005 Ballon d'Or Winner & 2005-06 UEFA Club Footballer of the Year; standing ovation at the Bernabéu after scoring two solo goals (3-0 vs Real Madrid)",
    appearances: 45, goals: 26, assists: 22, ratingRationale: "Pure joyful football sorcery at the zenith of his powers.",
    sourceId: "uefa-cl-history", sourceFact: "2005 Ballon d'Or & Bernabéu ovation"
  },

  // 3. Real Madrid 2011-12
  {
    id: "iker-casillas-2012", identityId: "iker-casillas", editionId: "real-madrid-2011-12", name: "Iker Casillas", squadNumber: 1, ovr: 93,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2011 & 2012 IFFHS World's Best Goalkeeper; captained Real Madrid to 100-point La Liga title",
    appearances: 53, goals: 0, cleanSheets: 20, ratingRationale: "Saint Iker at his absolute peak shot-stopping level.",
    sourceId: "uefa-cl-history", sourceFact: "2011-12 IFFHS World's Best GK"
  },
  {
    id: "alvaro-arbeloa-2012", identityId: "alvaro-arbeloa", editionId: "real-madrid-2011-12", name: "Álvaro Arbeloa", squadNumber: 17, ovr: 82,
    naturalPositions: ["RB"], secondaryPositions: ["LB"], hasLegendSeal: false,
    appearances: 38, goals: 0, cleanSheets: 15, ratingRationale: "Mourinho's disciplined tactical full-back shutting down opponent wings.",
    sourceId: "uefa-cl-history", sourceFact: "Started 38 games in 100-pt season"
  },
  {
    id: "sergio-ramos-2012", identityId: "sergio-ramos", editionId: "real-madrid-2011-12", name: "Sergio Ramos", squadNumber: 4, ovr: 91,
    naturalPositions: ["CB"], secondaryPositions: ["RB"], hasLegendSeal: true,
    legendSealReason: "2012 FIFA FIFPro World XI; converted full-time to central defense to form a ferocious defensive unit",
    appearances: 51, goals: 4, cleanSheets: 20, ratingRationale: "Dominant aerial power, speed, and warrior leadership.",
    sourceId: "uefa-cl-history", sourceFact: "2012 FIFA FIFPro World XI"
  },
  {
    id: "pepe-2012", identityId: "pepe", editionId: "real-madrid-2011-12", name: "Pepe", squadNumber: 3, ovr: 88,
    naturalPositions: ["CB"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 45, goals: 1, cleanSheets: 18, ratingRationale: "Fierce recovery pace and aggressive tackling shutting down counterattacks.",
    sourceId: "uefa-cl-history", sourceFact: "Key starter in 100-pt season"
  },
  {
    id: "marcelo-2012", identityId: "marcelo-vieira", editionId: "real-madrid-2011-12", name: "Marcelo", squadNumber: 12, ovr: 89,
    naturalPositions: ["LB", "LWB"], secondaryPositions: ["LM"], hasLegendSeal: true,
    legendSealReason: "2012 FIFA FIFPro World XI; 10 assists providing devastating attacking interplay with Ronaldo down the left",
    appearances: 44, goals: 3, assists: 10, cleanSheets: 17, ratingRationale: "Unrivaled flair and technical skill from left-back.",
    sourceId: "uefa-cl-history", sourceFact: "2012 FIFA FIFPro World XI"
  },
  {
    id: "xabi-alonso-2012", identityId: "xabi-alonso", editionId: "real-madrid-2011-12", name: "Xabi Alonso", squadNumber: 14, ovr: 91,
    naturalPositions: ["CDM", "CM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2011-12 FIFA FIFPro World XI & UEFA Team of the Year; quarterbacked Mourinho's lightning transitions with 50-yard passes",
    appearances: 52, goals: 2, assists: 11, ratingRationale: "Masterclass deep-lying playmaker controlling the tempo.",
    sourceId: "uefa-cl-history", sourceFact: "2011-12 FIFPro World XI"
  },
  {
    id: "sami-khedira-2012", identityId: "sami-khedira", editionId: "real-madrid-2011-12", name: "Sami Khedira", squadNumber: 6, ovr: 86,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 42, goals: 4, assists: 3, ratingRationale: "Scored the famous opening goal in the title-deciding 2-1 win at Camp Nou.",
    sourceId: "uefa-cl-history", sourceFact: "Goal in 2-1 Camp Nou title decider"
  },
  {
    id: "angel-di-maria-2012", identityId: "angel-di-maria", editionId: "real-madrid-2011-12", name: "Ángel Di María", squadNumber: 22, ovr: 89,
    naturalPositions: ["RW", "RM"], secondaryPositions: ["LW", "CAM"], hasLegendSeal: false,
    appearances: 32, goals: 7, assists: 16, ratingRationale: "Rabona crosses and dynamic direct dribbling creating 16 assists.",
    sourceId: "uefa-cl-history", sourceFact: "16 assists in 32 matches"
  },
  {
    id: "mesut-ozil-2012", identityId: "mesut-ozil", editionId: "real-madrid-2011-12", name: "Mesut Özil", squadNumber: 10, ovr: 91,
    naturalPositions: ["CAM"], secondaryPositions: ["RW"], hasLegendSeal: true,
    legendSealReason: "La Liga Top Assist Provider with 17 assists (29 across all competitions); assisted Ronaldo's 'Calma' goal at Camp Nou",
    appearances: 52, goals: 7, assists: 29, ratingRationale: "Vision, delicate touch, and the finest final ball in Europe.",
    sourceId: "uefa-cl-history", sourceFact: "La Liga Top Assist Provider (17 assists)"
  },
  {
    id: "cristiano-ronaldo-2012", identityId: "cristiano-ronaldo", editionId: "real-madrid-2011-12", name: "Cristiano Ronaldo", squadNumber: 7, ovr: 97,
    naturalPositions: ["LW", "ST"], secondaryPositions: ["RW"], hasLegendSeal: true,
    legendSealReason: "60 goals in 55 matches; scored in every single away La Liga ground and hit the iconic 'Calma' winner at Camp Nou to seal the 100-point title",
    appearances: 55, goals: 60, assists: 15, ratingRationale: "Devastating physical and finishing force breaking scoring records.",
    sourceId: "uefa-cl-history", sourceFact: "60 goals & Camp Nou title clincher"
  },
  {
    id: "karim-benzema-2012", identityId: "karim-benzema", editionId: "real-madrid-2011-12", name: "Karim Benzema", squadNumber: 9, ovr: 90,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: false,
    appearances: 52, goals: 32, assists: 19, ratingRationale: "Formed lethal trio with Ronaldo and Higuaín, scoring 32 goals.",
    sourceId: "uefa-cl-history", sourceFact: "32 goals & 19 assists in 2011-12"
  },

  // 4. Real Madrid 2021-22
  {
    id: "thibaut-courtois-2022", identityId: "thibaut-courtois", editionId: "real-madrid-2021-22", name: "Thibaut Courtois", squadNumber: 1, ovr: 95,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2022 Champions League Final Man of the Match; made 9 saves vs Liverpool (most in a UCL final) and Yashin Trophy winner",
    appearances: 52, goals: 0, cleanSheets: 22, ratingRationale: "Greatest individual goalkeeping campaign in modern Champions League history.",
    sourceId: "uefa-cl-history", sourceFact: "2022 UCL Final MOTM (9 saves)"
  },
  {
    id: "dani-carvajal-2022", identityId: "dani-carvajal", editionId: "real-madrid-2021-22", name: "Dani Carvajal", squadNumber: 2, ovr: 86,
    naturalPositions: ["RB"], secondaryPositions: ["RWB"], hasLegendSeal: false,
    appearances: 36, goals: 1, assists: 6, cleanSheets: 14, ratingRationale: "Shut down Luis Díaz in the Champions League final in Paris.",
    sourceId: "uefa-cl-history", sourceFact: "5-time UCL champion starter"
  },
  {
    id: "eder-militao-2022", identityId: "eder-militao", editionId: "real-madrid-2021-22", name: "Éder Militão", squadNumber: 3, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: ["RB"], hasLegendSeal: false,
    appearances: 50, goals: 2, cleanSheets: 21, ratingRationale: "Explosive recovery pace and physical aerial presence replacing Ramos.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2022 Paris Final"
  },
  {
    id: "david-alaba-2022", identityId: "david-alaba", editionId: "real-madrid-2021-22", name: "David Alaba", squadNumber: 4, ovr: 88,
    naturalPositions: ["CB", "LB"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "Debuted for Madrid lifting La Liga and Champions League; iconic 'chair celebration' during PSG comeback",
    appearances: 46, goals: 3, assists: 4, cleanSheets: 19, ratingRationale: "Seamless defensive transition with elite line-breaking passes.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2022 UCL Final & won Double"
  },
  {
    id: "ferland-mendy-2022", identityId: "ferland-mendy", editionId: "real-madrid-2021-22", name: "Ferland Mendy", squadNumber: 23, ovr: 84,
    naturalPositions: ["LB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 35, goals: 2, assists: 5, cleanSheets: 15, ratingRationale: "Heroic goal-line clearance vs Man City in 87th minute to keep tie alive.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2022 Paris Final"
  },
  {
    id: "casemiro-2022", identityId: "casemiro", editionId: "real-madrid-2021-22", name: "Casemiro", squadNumber: 14, ovr: 90,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "Won his 5th Champions League title; master of defensive tackles and interceptions in Paris final",
    appearances: 48, goals: 1, assists: 4, cleanSheets: 20, ratingRationale: "The impenetrable defensive shield of Madrid's golden era.",
    sourceId: "uefa-cl-history", sourceFact: "5-time Champions League winner"
  },
  {
    id: "toni-kroos-2022", identityId: "toni-kroos", editionId: "real-madrid-2021-22", name: "Toni Kroos", squadNumber: 8, ovr: 90,
    naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "Completed 93% pass accuracy across the entire Champions League campaign, lifting his 5th European Cup",
    appearances: 45, goals: 3, assists: 3, ratingRationale: "Supreme composure and metronomic rhythm under intense pressure.",
    sourceId: "uefa-cl-history", sourceFact: "5-time Champions League winner"
  },
  {
    id: "luka-modric-2022", identityId: "luka-modric", editionId: "real-madrid-2021-22", name: "Luka Modrić", squadNumber: 10, ovr: 91,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Iconic outside-of-the-boot (trivela) 40-yard assist to Rodrygo vs Chelsea to salvage the tie; 5th Champions League crown",
    appearances: 45, goals: 3, assists: 12, ratingRationale: "Ageless midfield genius dictating the biggest European nights at 36.",
    sourceId: "uefa-cl-history", sourceFact: "Iconic trivela assist vs Chelsea"
  },
  {
    id: "federico-valverde-2022", identityId: "federico-valverde", editionId: "real-madrid-2021-22", name: "Federico Valverde", squadNumber: 15, ovr: 88,
    naturalPositions: ["RW", "CM"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "Provided the low cross assist for Vinícius Jr's winning goal in the 2022 Champions League Final vs Liverpool",
    appearances: 46, goals: 1, assists: 2, ratingRationale: "Relentless box-to-box stamina and tactical hybrid role.",
    sourceId: "uefa-cl-history", sourceFact: "Assist for 2022 UCL winning goal"
  },
  {
    id: "vinicius-junior-2022", identityId: "vinicius-junior", editionId: "real-madrid-2021-22", name: "Vinícius Júnior", squadNumber: 20, ovr: 92,
    naturalPositions: ["LW"], secondaryPositions: ["LM"], hasLegendSeal: true,
    legendSealReason: "Scored the 59th-minute winning goal in the 2022 Champions League Final; 22 goals and 20 assists in breakthrough season",
    appearances: 52, goals: 22, assists: 20, ratingRationale: "Unstoppable 1-on-1 dribbler exploding into world-class superstar.",
    sourceId: "uefa-cl-history", sourceFact: "2022 UCL Final winning goalscorer"
  },
  {
    id: "karim-benzema-2022", identityId: "karim-benzema", editionId: "real-madrid-2021-22", name: "Karim Benzema", squadNumber: 9, ovr: 97,
    naturalPositions: ["ST", "CF"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2022 Ballon d'Or Winner (second largest margin in history); scored back-to-back Champions League hat-tricks vs PSG and Chelsea, 15 UCL goals",
    appearances: 46, goals: 44, assists: 15, ratingRationale: "One of the most heroic and clutch captain performances in football history.",
    sourceId: "uefa-cl-history", sourceFact: "2022 Ballon d'Or Winner & 15 UCL goals"
  },

  // 5. Manchester United 1993-94
  {
    id: "peter-schmeichel-1994", identityId: "peter-schmeichel", editionId: "manchester-united-1993-94", name: "Peter Schmeichel", squadNumber: 1, ovr: 93,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Premier League clean sheet record (20 clean sheets in 40 games); clean sheet in 4-0 FA Cup Final win over Chelsea",
    appearances: 50, goals: 0, cleanSheets: 24, ratingRationale: "The Great Dane at his most physically intimidating peak.",
    sourceId: "uefa-cl-history", sourceFact: "1994 Double winning goalkeeper"
  },
  {
    id: "paul-parker-1994", identityId: "paul-parker", editionId: "manchester-united-1993-94", name: "Paul Parker", squadNumber: 2, ovr: 83,
    naturalPositions: ["RB"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 54, goals: 1, cleanSheets: 23, ratingRationale: "Tenacious tackling and high recovery pace as starting right-back.",
    sourceId: "uefa-cl-history", sourceFact: "Started 1994 FA Cup Final"
  },
  {
    id: "steve-bruce-1994", identityId: "steve-bruce", editionId: "manchester-united-1993-94", name: "Steve Bruce", squadNumber: 4, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Captain who lifted the 1993-94 Double; courageous shot-blocking and headed threat",
    appearances: 47, goals: 3, cleanSheets: 21, ratingRationale: "Indomitable warrior captain holding the backline together.",
    sourceId: "uefa-cl-history", sourceFact: "1994 Double winning captain"
  },
  {
    id: "gary-pallister-1994", identityId: "gary-pallister", editionId: "manchester-united-1993-94", name: "Gary Pallister", squadNumber: 6, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 60, goals: 1, cleanSheets: 26, ratingRationale: "Imposing height and surprising recovery pace alongside Bruce.",
    sourceId: "uefa-cl-history", sourceFact: "PFA Team of the Year 1994"
  },
  {
    id: "denis-irwin-1994", identityId: "denis-irwin", editionId: "manchester-united-1993-94", name: "Denis Irwin", squadNumber: 3, ovr: 87,
    naturalPositions: ["LB", "RB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 56, goals: 4, cleanSheets: 24, ratingRationale: "Flawless two-footed defending, penalty accuracy, and dead-ball delivery.",
    sourceId: "uefa-cl-history", sourceFact: "Started 1994 FA Cup Final"
  },
  {
    id: "andrei-kanchelskis-1994", identityId: "andrei-kanchelskis", editionId: "manchester-united-1993-94", name: "Andrei Kanchelskis", squadNumber: 14, ovr: 87,
    naturalPositions: ["RM", "RW"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 49, goals: 10, assists: 11, ratingRationale: "Blistering raw speed and direct crossing down the right wing.",
    sourceId: "uefa-cl-history", sourceFact: "10 goals in 1993-94 Double season"
  },
  {
    id: "paul-ince-1994", identityId: "paul-ince", editionId: "manchester-united-1993-94", name: "Paul Ince", squadNumber: 8, ovr: 88,
    naturalPositions: ["CM", "CDM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 51, goals: 9, assists: 8, ratingRationale: "'The Guv'nor' commanding the midfield with crunching tackles and forward drives.",
    sourceId: "uefa-cl-history", sourceFact: "Started 1994 FA Cup Final"
  },
  {
    id: "roy-keane-1994", identityId: "roy-keane", editionId: "manchester-united-1993-94", name: "Roy Keane", squadNumber: 16, ovr: 89,
    naturalPositions: ["CM", "CDM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 54, goals: 8, assists: 6, ratingRationale: "Sensational debut season after record British transfer, winning the Double at 22.",
    sourceId: "uefa-cl-history", sourceFact: "1993-94 debut Double campaign"
  },
  {
    id: "ryan-giggs-1994", identityId: "ryan-giggs", editionId: "manchester-united-1993-94", name: "Ryan Giggs", squadNumber: 11, ovr: 89,
    naturalPositions: ["LM", "LW"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "PFA Young Player of the Year contender; electrifying left-wing dribbling mesmerising Premier League defenses",
    appearances: 58, goals: 17, assists: 14, ratingRationale: "Frightening pace and slalom runs leaving full-backs in his wake.",
    sourceId: "uefa-cl-history", sourceFact: "17 goals in 1993-94 Double season"
  },
  {
    id: "eric-cantona-1994", identityId: "eric-cantona", editionId: "manchester-united-1993-94", name: "Eric Cantona", squadNumber: 7, ovr: 94,
    naturalPositions: ["CF", "CAM"], secondaryPositions: ["ST"], hasLegendSeal: true,
    legendSealReason: "1993-94 PFA Players' Player of the Year; scored two penalties in 4-0 FA Cup Final, collar turned up in supreme majesty",
    appearances: 49, goals: 25, assists: 16, ratingRationale: "The talismanic catalyst of Ferguson's football dynasty.",
    sourceId: "uefa-cl-history", sourceFact: "1994 PFA Player of the Year & 25 goals"
  },
  {
    id: "mark-hughes-1994", identityId: "mark-hughes", editionId: "manchester-united-1993-94", name: "Mark Hughes", squadNumber: 10, ovr: 88,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: false,
    appearances: 54, goals: 22, assists: 10, ratingRationale: "Spectacular volleying technique and legendary physical back-to-goal hold-up play.",
    sourceId: "uefa-cl-history", sourceFact: "22 goals in 1993-94 Double season"
  },

  // 6. Chelsea 2004-05
  {
    id: "petr-cech-2005", identityId: "petr-cech", editionId: "chelsea-2004-05", name: "Petr Čech", squadNumber: 1, ovr: 95,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "All-time Premier League record 24 clean sheets and 1,025 consecutive minutes without conceding; Golden Glove winner",
    appearances: 42, goals: 0, cleanSheets: 28, ratingRationale: "Greatest defensive debut goalkeeping season in English football history.",
    sourceId: "uefa-cl-history", sourceFact: "All-time record 24 PL clean sheets"
  },
  {
    id: "paulo-ferreira-2005", identityId: "paulo-ferreira", editionId: "chelsea-2004-05", name: "Paulo Ferreira", squadNumber: 20, ovr: 84,
    naturalPositions: ["RB"], secondaryPositions: ["LB"], hasLegendSeal: false,
    appearances: 42, goals: 0, cleanSheets: 25, ratingRationale: "Positional perfection and tactical discipline under Mourinho.",
    sourceId: "uefa-cl-history", sourceFact: "Started 42 games in title season"
  },
  {
    id: "john-terry-2005", identityId: "john-terry", editionId: "chelsea-2004-05", name: "John Terry", squadNumber: 26, ovr: 94,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2004-05 PFA Players' Player of the Year & UEFA Club Best Defender; captained Chelsea to their first league title in 50 years",
    appearances: 53, goals: 8, cleanSheets: 34, ratingRationale: "Fearless leadership and colossal defensive dominance.",
    sourceId: "uefa-cl-history", sourceFact: "2005 PFA Player of the Year"
  },
  {
    id: "ricardo-carvalho-2005", identityId: "ricardo-carvalho", editionId: "chelsea-2004-05", name: "Ricardo Carvalho", squadNumber: 6, ovr: 89,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 39, goals: 1, cleanSheets: 24, ratingRationale: "Anticipation, timing, and flawless reading of danger alongside Terry.",
    sourceId: "uefa-cl-history", sourceFact: "Key center-back in 15-goal defense"
  },
  {
    id: "william-gallas-2005", identityId: "william-gallas", editionId: "chelsea-2004-05", name: "William Gallas", squadNumber: 13, ovr: 88,
    naturalPositions: ["LB", "CB"], secondaryPositions: ["RB"], hasLegendSeal: false,
    appearances: 46, goals: 4, cleanSheets: 29, ratingRationale: "Supreme speed and 1-on-1 tackling filling in at left-back.",
    sourceId: "uefa-cl-history", sourceFact: "Started 46 matches in title season"
  },
  {
    id: "claude-makelele-2005", identityId: "claude-makelele", editionId: "chelsea-2004-05", name: "Claude Makélélé", squadNumber: 4, ovr: 92,
    naturalPositions: ["CDM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2005 FIFPro World XI; redefined the holding midfield role so completely that the position became known as 'The Makélélé Role'",
    appearances: 50, goals: 1, ratingRationale: "The tactical anchor that enabled Chelsea to concede only 15 league goals.",
    sourceId: "uefa-cl-history", sourceFact: "2005 FIFPro World XI ('Makélélé Role')"
  },
  {
    id: "frank-lampard-2005", identityId: "frank-lampard", editionId: "chelsea-2004-05", name: "Frank Lampard", squadNumber: 8, ovr: 94,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "2005 Ballon d'Or Runner-up & FIFA World Player of the Year Silver Award; FWA Footballer of the Year scoring 19 goals from midfield",
    appearances: 58, goals: 19, assists: 16, ratingRationale: "Iron-man midfielder scoring both goals at Bolton to clinch the title.",
    sourceId: "uefa-cl-history", sourceFact: "2005 Ballon d'Or Runner-up & 19 goals"
  },
  {
    id: "tiago-mendes-2005", identityId: "tiago-mendes", editionId: "chelsea-2004-05", name: "Tiago Mendes", squadNumber: 19, ovr: 85,
    naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 51, goals: 4, assists: 4, ratingRationale: "Scored sensational 30-yard thunderbolt at Old Trafford.",
    sourceId: "uefa-cl-history", sourceFact: "51 appearances in 95-pt season"
  },
  {
    id: "damien-duff-2005", identityId: "damien-duff", editionId: "chelsea-2004-05", name: "Damien Duff", squadNumber: 11, ovr: 87,
    naturalPositions: ["RW", "LW"], secondaryPositions: ["RM"], hasLegendSeal: false,
    appearances: 48, goals: 10, assists: 9, ratingRationale: "Direct dynamic wing play scoring the famous 4th goal vs Barcelona.",
    sourceId: "uefa-cl-history", sourceFact: "Crucial goal in 4-2 win vs Barcelona"
  },
  {
    id: "arjen-robben-2005", identityId: "arjen-robben", editionId: "chelsea-2004-05", name: "Arjen Robben", squadNumber: 16, ovr: 90,
    naturalPositions: ["LW", "RW"], secondaryPositions: ["LM"], hasLegendSeal: true,
    legendSealReason: "2004-05 PFA Team of the Year; electrifying wing revolution that transformed Chelsea into an unstoppable attacking force",
    appearances: 29, goals: 9, assists: 9, ratingRationale: "Explosive pace and cutting inside with untouchable velocity.",
    sourceId: "uefa-cl-history", sourceFact: "2005 PFA Team of the Year"
  },
  {
    id: "didier-drogba-2005", identityId: "didier-drogba", editionId: "chelsea-2004-05", name: "Didier Drogba", squadNumber: 15, ovr: 91,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "Scored in League Cup Final extra time to win his first Chelsea trophy; terrorized Premier League center-backs with physical power",
    appearances: 41, goals: 16, assists: 7, ratingRationale: "The spearhead striker establishing Chelsea's winning mentality.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in 2005 League Cup Final"
  },

  // 7. Chelsea 2011-12
  {
    id: "petr-cech-2012", identityId: "petr-cech", editionId: "chelsea-2011-12", name: "Petr Čech", squadNumber: 1, ovr: 94,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Munich Final hero: saved Robben's extra-time penalty, and saved two penalties in the shootout (guessing the right direction on all 6 penalties)",
    appearances: 56, goals: 0, cleanSheets: 20, ratingRationale: "The greatest penalty shootout display by a keeper in a Champions League final.",
    sourceId: "uefa-cl-history", sourceFact: "Saved 3 penalties in 2012 Final"
  },
  {
    id: "jose-bosingwa-2012", identityId: "jose-bosingwa", editionId: "chelsea-2011-12", name: "José Bosingwa", squadNumber: 17, ovr: 83,
    naturalPositions: ["RB"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 43, goals: 1, cleanSheets: 14, ratingRationale: "Heroic emergency center-back display at Camp Nou with 10 men and started Munich final.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2012 UCL Final"
  },
  {
    id: "david-luiz-2012", identityId: "david-luiz", editionId: "chelsea-2011-12", name: "David Luiz", squadNumber: 4, ovr: 86,
    naturalPositions: ["CB"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 40, goals: 3, cleanSheets: 14, ratingRationale: "Played 120 minutes with a severe hamstring tear in Munich and smashed home penalty.",
    sourceId: "uefa-cl-history", sourceFact: "Played 120' in Munich injured"
  },
  {
    id: "gary-cahill-2012", identityId: "gary-cahill", editionId: "chelsea-2011-12", name: "Gary Cahill", squadNumber: 24, ovr: 85,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 19, goals: 2, cleanSheets: 6, ratingRationale: "Joined mid-season and started the Munich Final after recovering from hamstring injury.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2012 Final"
  },
  {
    id: "ashley-cole-2012", identityId: "ashley-cole", editionId: "chelsea-2011-12", name: "Ashley Cole", squadNumber: 3, ovr: 91,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: true,
    legendSealReason: "Goal-line clearance vs Napoli in round of 16; neutralised Robben in Munich final and scored in the penalty shootout",
    appearances: 48, goals: 0, cleanSheets: 17, ratingRationale: "The world's premier defensive left-back in European knockout football.",
    sourceId: "uefa-cl-history", sourceFact: "2012 UCL winner & shootout goal"
  },
  {
    id: "john-obi-mikel-2012", identityId: "john-obi-mikel", editionId: "chelsea-2011-12", name: "John Obi Mikel", squadNumber: 12, ovr: 85,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 37, goals: 0, ratingRationale: "Immense physical shielding against Bayern's midfield in the Munich final.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2012 Final"
  },
  {
    id: "frank-lampard-2012", identityId: "frank-lampard", editionId: "chelsea-2011-12", name: "Frank Lampard", squadNumber: 8, ovr: 91,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Captained Chelsea in the 2012 Munich Final; delivered perfect 40-yard assist to Ramires at Camp Nou and scored in Munich shootout",
    appearances: 49, goals: 16, assists: 10, ratingRationale: "Clutch leadership and clinical penalties in the European triumph.",
    sourceId: "uefa-cl-history", sourceFact: "2012 UCL winning captain in Munich"
  },
  {
    id: "ramires-2012", identityId: "ramires", editionId: "chelsea-2011-12", name: "Ramires", squadNumber: 7, ovr: 86,
    naturalPositions: ["RM", "CM"], secondaryPositions: ["RW"], hasLegendSeal: true,
    legendSealReason: "Scored immortal 45th-minute chip over Victor Valdés at Camp Nou with 10 men to send Chelsea into the Champions League final",
    appearances: 47, goals: 12, assists: 6, ratingRationale: "Relentless running and one of Chelsea's most iconic European goals.",
    sourceId: "uefa-cl-history", sourceFact: "Iconic chip at Camp Nou"
  },
  {
    id: "juan-mata-2012", identityId: "juan-mata", editionId: "chelsea-2011-12", name: "Juan Mata", squadNumber: 10, ovr: 89,
    naturalPositions: ["CAM", "LW"], secondaryPositions: ["RW"], hasLegendSeal: false,
    appearances: 54, goals: 12, assists: 20, ratingRationale: "Chelsea Player of the Year; delivered the 88th-minute corner for Drogba's Munich equalizer.",
    sourceId: "uefa-cl-history", sourceFact: "Corner assist for Drogba in Munich"
  },
  {
    id: "salomon-kalou-2012", identityId: "salomon-kalou", editionId: "chelsea-2011-12", name: "Salomon Kalou", squadNumber: 21, ovr: 83,
    naturalPositions: ["LW", "RW"], secondaryPositions: ["ST"], hasLegendSeal: false,
    appearances: 26, goals: 5, assists: 4, ratingRationale: "Disciplined defensive tracking starting the Munich Champions League Final.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2012 Munich Final"
  },
  {
    id: "didier-drogba-2012", identityId: "didier-drogba", editionId: "chelsea-2011-12", name: "Didier Drogba", squadNumber: 11, ovr: 94,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "UEFA Champions League Final Man of the Match 2012; scored 88th-minute bullet header equalizer and the historic winning penalty with his last kick for the club",
    appearances: 35, goals: 13, assists: 4, ratingRationale: "The ultimate big-game king conquering Munich against all odds.",
    sourceId: "uefa-cl-history", sourceFact: "2012 UCL Final MOTM & winning penalty"
  },

  // 8. Chelsea 2020-21
  {
    id: "edouard-mendy-2021", identityId: "edouard-mendy", editionId: "chelsea-2020-21", name: "Édouard Mendy", squadNumber: 16, ovr: 89,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Tied all-time Champions League record with 9 clean sheets in 12 games; Best FIFA Goalkeeper 2021",
    appearances: 45, goals: 0, cleanSheets: 25, ratingRationale: "Clean sheet in Porto final against Manchester City.",
    sourceId: "uefa-cl-history", sourceFact: "Record 9 UCL clean sheets in 2021"
  },
  {
    id: "cesar-azpilicueta-2021", identityId: "cesar-azpilicueta", editionId: "chelsea-2020-21", name: "César Azpilicueta", squadNumber: 28, ovr: 87,
    naturalPositions: ["CB", "RB"], secondaryPositions: ["RWB"], hasLegendSeal: true,
    legendSealReason: "Captain who lifted the 2021 Champions League in Porto; vital goal-line block vs Gündoğan",
    appearances: 43, goals: 1, assists: 3, cleanSheets: 23, ratingRationale: "Tenacious defensive grit and captain's leadership.",
    sourceId: "uefa-cl-history", sourceFact: "2021 UCL winning captain"
  },
  {
    id: "thiago-silva-2021", identityId: "thiago-silva", editionId: "chelsea-2020-21", name: "Thiago Silva", squadNumber: 6, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Anchored Chelsea's back three conceding just 4 goals throughout the entire Champions League campaign",
    appearances: 34, goals: 2, cleanSheets: 19, ratingRationale: "Elite positioning, composure, and European redemption in Porto.",
    sourceId: "uefa-cl-history", sourceFact: "2021 UCL winner starting in Porto"
  },
  {
    id: "antonio-rudiger-2021", identityId: "antonio-rudiger", editionId: "chelsea-2020-21", name: "Antonio Rüdiger", squadNumber: 2, ovr: 89,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Crucial match-saving sliding block on Phil Foden in the 2021 Champions League Final; 2021 UCL Squad of the Season",
    appearances: 34, goals: 1, cleanSheets: 20, ratingRationale: "Ferocious aggression and recovery pace in Tuchel's backline.",
    sourceId: "uefa-cl-history", sourceFact: "Match-saving block in 2021 Final"
  },
  {
    id: "reece-james-2021", identityId: "reece-james", editionId: "chelsea-2020-21", name: "Reece James", squadNumber: 24, ovr: 87,
    naturalPositions: ["RWB", "RB"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 47, goals: 1, assists: 5, cleanSheets: 22, ratingRationale: "Masterclass defensive display completely pocketing Sterling in Porto.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2021 Final in Porto"
  },
  {
    id: "ben-chilwell-2021", identityId: "ben-chilwell", editionId: "chelsea-2020-21", name: "Ben Chilwell", squadNumber: 21, ovr: 86,
    naturalPositions: ["LWB", "LB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 42, goals: 4, assists: 7, cleanSheets: 21, ratingRationale: "Dynamic wing-back play scoring crucial away goal in QF vs Porto.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2021 Final in Porto"
  },
  {
    id: "jorginho-2021", identityId: "jorginho", editionId: "chelsea-2020-21", name: "Jorginho", squadNumber: 5, ovr: 89,
    naturalPositions: ["CM", "CDM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2020-21 UEFA Men's Player of the Year & 2021 Ballon d'Or 3rd Place; won both the Champions League and Euro 2020 in the same summer",
    appearances: 43, goals: 8, assists: 2, ratingRationale: "Elite deep-lying regulator controlling European tempos.",
    sourceId: "uefa-cl-history", sourceFact: "2021 UEFA Player of the Year"
  },
  {
    id: "ngolo-kante-2021", identityId: "ngolo-kante", editionId: "chelsea-2020-21", name: "N'Golo Kanté", squadNumber: 7, ovr: 94,
    naturalPositions: ["CM", "CDM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Man of the Match in BOTH semi-final legs vs Real Madrid AND Man of the Match in the Final vs Man City; 2021 UEFA Midfielder of the Year",
    appearances: 48, goals: 0, assists: 3, ratingRationale: "Three consecutive European knockout Man of the Match awards.",
    sourceId: "uefa-cl-history", sourceFact: "2021 Final & both Semis MOTM"
  },
  {
    id: "mason-mount-2021", identityId: "mason-mount", editionId: "chelsea-2020-21", name: "Mason Mount", squadNumber: 19, ovr: 88,
    naturalPositions: ["CAM", "RW"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "Provided the pinpoint through-ball assist for Havertz's Champions League-winning goal in Porto; Chelsea Player of the Year",
    appearances: 54, goals: 9, assists: 9, ratingRationale: "Intelligent pressing and incisive creativity in the half-spaces.",
    sourceId: "uefa-cl-history", sourceFact: "Assist for 2021 UCL winning goal"
  },
  {
    id: "kai-havertz-2021", identityId: "kai-havertz", editionId: "chelsea-2020-21", name: "Kai Havertz", squadNumber: 29, ovr: 88,
    naturalPositions: ["CF", "ST"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Scored the 42nd-minute winning goal in the 2021 UEFA Champions League Final against Manchester City",
    appearances: 45, goals: 9, assists: 9, ratingRationale: "Composed finish rounding Ederson to seal the European title.",
    sourceId: "uefa-cl-history", sourceFact: "2021 UCL Final winning goalscorer"
  },
  {
    id: "timo-werner-2021", identityId: "timo-werner", editionId: "chelsea-2020-21", name: "Timo Werner", squadNumber: 11, ovr: 85,
    naturalPositions: ["ST", "LW"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 52, goals: 12, assists: 15, ratingRationale: "Decisive runs in behind stretching defense to create space for Havertz's winner.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2021 Final in Porto"
  },

  // 9. Liverpool 2004-05
  {
    id: "jerzy-dudek-2005", identityId: "jerzy-dudek", editionId: "liverpool-2004-05", name: "Jerzy Dudek", squadNumber: 1, ovr: 87,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Miraculous double save vs Shevchenko at 119' and famous 'spaghetti legs' shootout heroics in Istanbul saving Shevchenko's final penalty",
    appearances: 41, goals: 0, cleanSheets: 16, ratingRationale: "Iconic penalty shootout hero of the Miracle of Istanbul.",
    sourceId: "uefa-cl-history", sourceFact: "Heroic double save & shootout in Istanbul"
  },
  {
    id: "steve-finnan-2005", identityId: "steve-finnan", editionId: "liverpool-2004-05", name: "Steve Finnan", squadNumber: 3, ovr: 84,
    naturalPositions: ["RB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 52, goals: 1, cleanSheets: 20, ratingRationale: "Reliable defensive full-back starting the 2005 final.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2005 Istanbul Final"
  },
  {
    id: "jamie-carragher-2005", identityId: "jamie-carragher", editionId: "liverpool-2004-05", name: "Jamie Carragher", squadNumber: 23, ovr: 89,
    naturalPositions: ["CB"], secondaryPositions: ["RB"], hasLegendSeal: true,
    legendSealReason: "Heroic cramping blocks in extra time in Istanbul; UEFA Club Defender of the Year nominee 2005",
    appearances: 56, goals: 0, cleanSheets: 23, ratingRationale: "Body-on-the-line defending through extreme muscle cramps.",
    sourceId: "uefa-cl-history", sourceFact: "Heroic blocks in Istanbul extra time"
  },
  {
    id: "sami-hyypia-2005", identityId: "sami-hyypia", editionId: "liverpool-2004-05", name: "Sami Hyypiä", squadNumber: 4, ovr: 88,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Scored sensational left-foot volley vs Juventus in the quarter-final; immovable aerial tower in Istanbul",
    appearances: 49, goals: 3, cleanSheets: 21, ratingRationale: "Towering Finnish center-back reading the game with supreme calmness.",
    sourceId: "uefa-cl-history", sourceFact: "Volley vs Juventus in 2005 QF"
  },
  {
    id: "djimi-traore-2005", identityId: "djimi-traore", editionId: "liverpool-2004-05", name: "Djimi Traoré", squadNumber: 21, ovr: 80,
    naturalPositions: ["LB", "CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 41, goals: 0, cleanSheets: 16, ratingRationale: "Crucial goal-line clearance vs Shevchenko in Istanbul second half.",
    sourceId: "uefa-cl-history", sourceFact: "Goal-line clearance in Istanbul Final"
  },
  {
    id: "xabi-alonso-2005", identityId: "xabi-alonso", editionId: "liverpool-2004-05", name: "Xabi Alonso", squadNumber: 14, ovr: 90,
    naturalPositions: ["CM", "CDM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Scored the historic 3-3 rebound equalizer in Istanbul to complete the greatest comeback in Champions League history",
    appearances: 32, goals: 3, assists: 6, ratingRationale: "Quarterback vision and nerves of steel to score the third goal.",
    sourceId: "uefa-cl-history", sourceFact: "Scored 3-3 equalizer in Istanbul Final"
  },
  {
    id: "dietmar-hamann-2005", identityId: "dietmar-hamann", editionId: "liverpool-2004-05", name: "Dietmar Hamann", squadNumber: 16, ovr: 86,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "Half-time substitute in Istanbul who stopped Kaká's counterattacks and scored first penalty with a broken bone in his foot",
    appearances: 43, goals: 1, ratingRationale: "Tactical turning point of the Miracle of Istanbul.",
    sourceId: "uefa-cl-history", sourceFact: "Half-time sub who turned Istanbul Final"
  },
  {
    id: "luis-garcia-2005", identityId: "luis-garcia", editionId: "liverpool-2004-05", name: "Luis García", squadNumber: 10, ovr: 87,
    naturalPositions: ["RW", "CAM"], secondaryPositions: ["LW"], hasLegendSeal: true,
    legendSealReason: "Scored the famous 4th-minute semi-final winner vs Chelsea and 25-yard volley vs Juventus to send Liverpool to Istanbul",
    appearances: 44, goals: 13, assists: 5, ratingRationale: "Spectacular knack for historic knockout goals in Europe.",
    sourceId: "uefa-cl-history", sourceFact: "Decisive goals vs Chelsea & Juventus"
  },
  {
    id: "john-arne-riise-2005", identityId: "john-arne-riise", editionId: "liverpool-2004-05", name: "John Arne Riise", squadNumber: 6, ovr: 86,
    naturalPositions: ["LM", "LB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 57, goals: 8, assists: 7, cleanSheets: 22, ratingRationale: "Delivered pinpoint cross for Gerrard's opening header in Istanbul.",
    sourceId: "uefa-cl-history", sourceFact: "Assist for Gerrard's Istanbul header"
  },
  {
    id: "steven-gerrard-2005", identityId: "steven-gerrard", editionId: "liverpool-2004-05", name: "Steven Gerrard", squadNumber: 8, ovr: 95,
    naturalPositions: ["CAM", "CM"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "2005 UEFA Club Footballer of the Year & 2005 Ballon d'Or 3rd Place; inspired Istanbul comeback with 54' header, won the penalty, and played right-back in extra time",
    appearances: 43, goals: 13, assists: 8, ratingRationale: "The defining individual captain's comeback in modern European football.",
    sourceId: "uefa-cl-history", sourceFact: "2005 UEFA Club Footballer of the Year"
  },
  {
    id: "milan-baros-2005", identityId: "milan-baros", editionId: "liverpool-2004-05", name: "Milan Baroš", squadNumber: 5, ovr: 84,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: false,
    appearances: 45, goals: 13, assists: 4, ratingRationale: "Euro 2004 Golden Boot winner starting as lone striker in Istanbul.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2005 Istanbul Final"
  },

  // 10. Manchester City 2017-18
  {
    id: "ederson-2018", identityId: "ederson-moraes", editionId: "manchester-city-2017-18", name: "Ederson", squadNumber: 31, ovr: 90,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Revolutionized English goalkeeping with laser-like 70-yard distribution in City's 100-point season",
    appearances: 45, goals: 0, cleanSheets: 21, ratingRationale: "Pivotal playmaker from the penalty box for Guardiola.",
    sourceId: "uefa-cl-history", sourceFact: "Started 36 league games in 100-pt season"
  },
  {
    id: "kyle-walker-2018", identityId: "kyle-walker", editionId: "manchester-city-2017-18", name: "Kyle Walker", squadNumber: 2, ovr: 88,
    naturalPositions: ["RB"], secondaryPositions: ["CB", "RWB"], hasLegendSeal: false,
    appearances: 48, goals: 0, assists: 7, cleanSheets: 23, ratingRationale: "Blistering recovery speed shutting down opposition counters.",
    sourceId: "uefa-cl-history", sourceFact: "2017-18 PFA Team of the Year"
  },
  {
    id: "vincent-kompany-2018", identityId: "vincent-kompany", editionId: "manchester-city-2017-18", name: "Vincent Kompany", squadNumber: 4, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Captain who lifted the historic 100-point Premier League trophy and scored in the League Cup final",
    appearances: 24, goals: 2, cleanSheets: 14, ratingRationale: "Authoritative captain and defensive colossus.",
    sourceId: "uefa-cl-history", sourceFact: "100-point title winning captain"
  },
  {
    id: "nicolas-otamendi-2018", identityId: "nicolas-otamendi", editionId: "manchester-city-2017-18", name: "Nicolás Otamendi", squadNumber: 30, ovr: 86,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 46, goals: 5, cleanSheets: 22, ratingRationale: "Completed the most passes in the Premier League (3,074 passes) and scored 5 goals.",
    sourceId: "uefa-cl-history", sourceFact: "2017-18 PFA Team of the Year"
  },
  {
    id: "fabian-delph-2018", identityId: "fabian-delph", editionId: "manchester-city-2017-18", name: "Fabian Delph", squadNumber: 18, ovr: 82,
    naturalPositions: ["LB"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 29, goals: 1, assists: 2, cleanSheets: 15, ratingRationale: "Inverted full-back masterstroke by Pep stepping into central midfield.",
    sourceId: "uefa-cl-history", sourceFact: "Inverted LB in 100-point season"
  },
  {
    id: "fernandinho-2018", identityId: "fernandinho", editionId: "manchester-city-2017-18", name: "Fernandinho", squadNumber: 25, ovr: 90,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "The indispensable single-pivot engine allowing De Bruyne and Silva complete creative freedom",
    appearances: 48, goals: 5, assists: 5, ratingRationale: "Supreme tactical intelligence and counter-press disruption.",
    sourceId: "uefa-cl-history", sourceFact: "Started 34 league games in 100-pt season"
  },
  {
    id: "kevin-de-bruyne-2018", identityId: "kevin-de-bruyne", editionId: "manchester-city-2017-18", name: "Kevin De Bruyne", squadNumber: 17, ovr: 95,
    naturalPositions: ["CM", "CAM"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "Premier League Playmaker of the Season (16 assists, 8 goals); assisted Jesus's 94th-minute 100th-point winner on final day",
    appearances: 52, goals: 12, assists: 21, ratingRationale: "The greatest creative midfielder in modern Premier League history.",
    sourceId: "uefa-cl-history", sourceFact: "Inaugural PL Playmaker Award (16 assists)"
  },
  {
    id: "david-silva-2018", identityId: "david-silva", editionId: "manchester-city-2017-18", name: "David Silva", squadNumber: 21, ovr: 93,
    naturalPositions: ["CM", "CAM"], secondaryPositions: ["LM"], hasLegendSeal: true,
    legendSealReason: "2017-18 PFA Team of the Year; 'El Mago' delivered 14 assists while commuting to Valencia to be with his premature baby son",
    appearances: 40, goals: 10, assists: 14, ratingRationale: "Untouchable close control, pauses (la pausa), and through-balls.",
    sourceId: "uefa-cl-history", sourceFact: "2017-18 PFA Team of the Year"
  },
  {
    id: "raheem-sterling-2018", identityId: "raheem-sterling", editionId: "manchester-city-2017-18", name: "Raheem Sterling", squadNumber: 7, ovr: 90,
    naturalPositions: ["RW"], secondaryPositions: ["LW"], hasLegendSeal: true,
    legendSealReason: "Scored 23 goals in all competitions, including sensational stoppage-time winners against Bournemouth, Southampton, and Huddersfield",
    appearances: 46, goals: 23, assists: 17, ratingRationale: "Deadly back-post movements and clutch late winners.",
    sourceId: "uefa-cl-history", sourceFact: "23 goals in 100-point season"
  },
  {
    id: "leroy-sane-2018", identityId: "leroy-sane", editionId: "manchester-city-2017-18", name: "Leroy Sané", squadNumber: 19, ovr: 89,
    naturalPositions: ["LW"], secondaryPositions: ["LM"], hasLegendSeal: true,
    legendSealReason: "2017-18 PFA Young Player of the Year; 14 goals and 19 assists with blistering outside acceleration",
    appearances: 49, goals: 14, assists: 19, ratingRationale: "Unstoppable chalk-on-the-boots winger tearing full-backs apart.",
    sourceId: "uefa-cl-history", sourceFact: "2018 PFA Young Player of the Year"
  },
  {
    id: "sergio-aguero-2018", identityId: "sergio-aguero", editionId: "manchester-city-2017-18", name: "Sergio Agüero", squadNumber: 10, ovr: 94,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "2017-18 PFA Team of the Year; scored 30 goals in 39 games and became Manchester City's all-time record goalscorer",
    appearances: 39, goals: 30, assists: 7, ratingRationale: "Lethal instinctive finishing from inside the box.",
    sourceId: "uefa-cl-history", sourceFact: "All-time City top scorer (30 goals in 17-18)"
  },

  // 11. Bayern Munich 2019-20
  {
    id: "manuel-neuer-2020", identityId: "manuel-neuer", editionId: "bayern-munich-2019-20", name: "Manuel Neuer", squadNumber: 1, ovr: 95,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "The Best FIFA Men's Goalkeeper 2020; clean sheet in the Champions League Final vs PSG with miraculous point-blank saves vs Neymar and Mbappé",
    appearances: 51, goals: 0, cleanSheets: 22, ratingRationale: "The supreme sweeper-keeper captain lifting the Sextuple.",
    sourceId: "uefa-cl-history", sourceFact: "Best FIFA Goalkeeper 2020"
  },
  {
    id: "joshua-kimmich-2020", identityId: "joshua-kimmich", editionId: "bayern-munich-2019-20", name: "Joshua Kimmich", squadNumber: 32, ovr: 92,
    naturalPositions: ["RB", "CDM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "UEFA Champions League Defender of the Season 2019-20; delivered the pinpoint cross for Coman's winning goal in the final",
    appearances: 51, goals: 7, assists: 17, cleanSheets: 21, ratingRationale: "Elite hybrid right-back/midfield general with deadly crossing.",
    sourceId: "uefa-cl-history", sourceFact: "Assist for 2020 UCL winning goal"
  },
  {
    id: "jerome-boateng-2020", identityId: "jerome-boateng", editionId: "bayern-munich-2019-20", name: "Jérôme Boateng", squadNumber: 17, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 38, goals: 0, cleanSheets: 16, ratingRationale: "Rejuvenated by Flick to start the final in Lisbon and win the Sextuple.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2020 UCL Final"
  },
  {
    id: "david-alaba-2020", identityId: "david-alaba", editionId: "bayern-munich-2019-20", name: "David Alaba", squadNumber: 27, ovr: 89,
    naturalPositions: ["CB", "LB"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "2020 UEFA Team of the Year; successfully converted into a world-class organizing center-back leading Bayern's high defensive line",
    appearances: 42, goals: 2, assists: 2, cleanSheets: 18, ratingRationale: "Superb voice, positioning, and passing out from the back.",
    sourceId: "uefa-cl-history", sourceFact: "2020 UEFA Team of the Year"
  },
  {
    id: "alphonso-davies-2020", identityId: "alphonso-davies", editionId: "bayern-munich-2019-20", name: "Alphonso Davies", squadNumber: 19, ovr: 89,
    naturalPositions: ["LB", "LWB"], secondaryPositions: ["LM"], hasLegendSeal: true,
    legendSealReason: "2020 FIFA FIFPro World XI; sensational solo assist vs Barcelona in the 8-2 quarter-final destroying Semedo with 36.5 km/h pace",
    appearances: 46, goals: 3, assists: 10, cleanSheets: 19, ratingRationale: "'Roadrunner' with terrifying recovery pace and attacking dynamism.",
    sourceId: "uefa-cl-history", sourceFact: "2020 FIFA FIFPro World XI"
  },
  {
    id: "leon-goretzka-2020", identityId: "leon-goretzka", editionId: "bayern-munich-2019-20", name: "Leon Goretzka", squadNumber: 18, ovr: 88,
    naturalPositions: ["CM"], secondaryPositions: ["CDM", "CAM"], hasLegendSeal: false,
    appearances: 38, goals: 8, assists: 11, ratingRationale: "Incredible physical transformation dominating the midfield in Lisbon.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2020 Final in Lisbon"
  },
  {
    id: "thiago-alcantara-2020", identityId: "thiago-alcantara", editionId: "bayern-munich-2019-20", name: "Thiago Alcântara", squadNumber: 6, ovr: 91,
    naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: true,
    legendSealReason: "2020 FIFA FIFPro World XI & UEFA Champions League Midfielder of the Season runner-up; masterclass passing clinic in Lisbon final",
    appearances: 40, goals: 3, assists: 2, ratingRationale: "Press-resistant maestro with 92% pass accuracy in Lisbon.",
    sourceId: "uefa-cl-history", sourceFact: "2020 FIFA FIFPro World XI"
  },
  {
    id: "serge-gnabry-2020", identityId: "serge-gnabry", editionId: "bayern-munich-2019-20", name: "Serge Gnabry", squadNumber: 22, ovr: 89,
    naturalPositions: ["RW"], secondaryPositions: ["LW"], hasLegendSeal: true,
    legendSealReason: "Scored 9 Champions League goals, including 4 goals vs Tottenham in London and a brace in the semi-final vs Lyon",
    appearances: 46, goals: 23, assists: 14, ratingRationale: "Devastating two-footed ball striking and explosive direct pace.",
    sourceId: "uefa-cl-history", sourceFact: "9 UCL goals in winning campaign"
  },
  {
    id: "thomas-muller-2020", identityId: "thomas-mueller", editionId: "bayern-munich-2019-20", name: "Thomas Müller", squadNumber: 25, ovr: 92,
    naturalPositions: ["CAM", "CF"], secondaryPositions: ["RW"], hasLegendSeal: true,
    legendSealReason: "All-time Bundesliga record 21 assists in a single season; scored brace in the 8-2 demolition of Barcelona",
    appearances: 50, goals: 14, assists: 26, ratingRationale: "The supreme 'Raumdeuter' (space interpreter) pressing like a machine.",
    sourceId: "uefa-cl-history", sourceFact: "Bundesliga record 21 assists"
  },
  {
    id: "kingsley-coman-2020", identityId: "kingsley-coman", editionId: "bayern-munich-2019-20", name: "Kingsley Coman", squadNumber: 29, ovr: 88,
    naturalPositions: ["LW"], secondaryPositions: ["RW"], hasLegendSeal: true,
    legendSealReason: "Scored the 59th-minute winning header in the 2020 Champions League Final against his boyhood club PSG in Lisbon",
    appearances: 38, goals: 8, assists: 7, ratingRationale: "2020 Champions League Final winning goalscorer.",
    sourceId: "uefa-cl-history", sourceFact: "2020 UCL Final winning goalscorer"
  },
  {
    id: "robert-lewandowski-2020", identityId: "robert-lewandowski", editionId: "bayern-munich-2019-20", name: "Robert Lewandowski", squadNumber: 9, ovr: 97,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: true,
    legendSealReason: "The Best FIFA Men's Player 2020 & UEFA Men's Player of the Year; won top scorer in ALL THREE competitions (34 in Bundesliga, 15 in UCL, 6 in Cup - 55 goals in 47 matches)",
    appearances: 47, goals: 55, assists: 10, ratingRationale: "The most dominant pure striker season of the 21st century.",
    sourceId: "uefa-cl-history", sourceFact: "The Best FIFA Men's Player 2020 (55 goals)"
  }
];
