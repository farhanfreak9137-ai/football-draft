import { PlayerDef } from './modernClubBase.js';

export const expansionPlayersPart1: PlayerDef[] = [
  // ==========================================
  // 1. FC BARCELONA 2016-17
  // ==========================================
  {
    id: "marc-andre-ter-stegen-barca-2017", identityId: "marc-andre-ter-stegen", editionId: "barcelona-2016-17", name: "Marc-André ter Stegen", squadNumber: 1, ovr: 90,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 46, goals: 0, cleanSheets: 17, ratingRationale: "First season as undisputed number one, brilliant distribution.",
    sourceId: "uefa-cl-history", sourceFact: "Started both Remontada legs"
  },
  {
    id: "sergi-roberto-barca-2017", identityId: "sergi-roberto", editionId: "barcelona-2016-17", name: "Sergi Roberto", squadNumber: 20, ovr: 86,
    naturalPositions: ["RB"], secondaryPositions: ["CM", "RM"], hasLegendSeal: true,
    legendSealReason: "Scored the historic 95th-minute winner in the 6-1 'La Remontada' vs PSG, the greatest comeback in UCL history",
    appearances: 47, goals: 1, assists: 6, ratingRationale: "Converted full-back who wrote himself into football folklore.",
    sourceId: "uefa-cl-history", sourceFact: "Remontada 95th minute winning goalscorer"
  },
  {
    id: "gerard-pique-barca-2017", identityId: "gerard-pique", editionId: "barcelona-2016-17", name: "Gerard Piqué", squadNumber: 3, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 41, goals: 3, cleanSheets: 18, ratingRationale: "Pillar of central defense and key tactical leader.",
    sourceId: "uefa-cl-history", sourceFact: "Started Copa del Rey final & Remontada"
  },
  {
    id: "samuel-umtiti-barca-2017", identityId: "samuel-umtiti", editionId: "barcelona-2016-17", name: "Samuel Umtiti", squadNumber: 23, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: ["LB"], hasLegendSeal: false,
    appearances: 43, goals: 1, cleanSheets: 17, ratingRationale: "Sensational debut season, Barca won 18 of first 19 games he started.",
    sourceId: "uefa-cl-history", sourceFact: "Started 6-1 Remontada vs PSG"
  },
  {
    id: "jordi-alba-barca-2017", identityId: "jordi-alba", editionId: "barcelona-2016-17", name: "Jordi Alba", squadNumber: 18, ovr: 90,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: false,
    appearances: 39, goals: 1, assists: 6, ratingRationale: "Lethal telepathic connection with Messi down the left corridor.",
    sourceId: "uefa-cl-history", sourceFact: "2017 Copa del Rey winner"
  },
  {
    id: "sergio-busquets-barca-2017", identityId: "sergio-busquets", editionId: "barcelona-2016-17", name: "Sergio Busquets", squadNumber: 5, ovr: 90,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 48, goals: 0, assists: 3, ratingRationale: "Anchored the midfield with immaculate spatial intelligence.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2017 Copa del Rey final"
  },
  {
    id: "ivan-rakitic-barca-2017", identityId: "ivan-rakitic", editionId: "barcelona-2016-17", name: "Ivan Rakitić", squadNumber: 4, ovr: 88,
    naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 51, goals: 9, assists: 7, ratingRationale: "Tireless engine balancing Messi's attacking liberty, scored in 3-2 Bernabéu win.",
    sourceId: "rsssf-global", sourceFact: "Scored in 2017 El Clásico win at Bernabéu"
  },
  {
    id: "andres-iniesta-barca-2017", identityId: "andres-iniesta", editionId: "barcelona-2016-17", name: "Andrés Iniesta", squadNumber: 8, ovr: 91,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Captained Barcelona to Copa del Rey victory; produced brilliant backheel assist for Kurzawa own goal in Remontada",
    appearances: 37, goals: 1, assists: 6, ratingRationale: "Pure midfield wizardry whenever on the pitch.",
    sourceId: "uefa-cl-history", sourceFact: "Copa del Rey winning captain"
  },
  {
    id: "lionel-messi-barca-2017", identityId: "lionel-messi", editionId: "barcelona-2016-17", name: "Lionel Messi", squadNumber: 10, ovr: 98,
    naturalPositions: ["RW", "CF"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "European Golden Shoe with 37 league goals (54 overall in 52 matches); iconic 92nd-minute Bernabéu Clásico winner and shirt celebration",
    appearances: 52, goals: 54, assists: 16, ratingRationale: "Astonishing individual brilliance operating at the pinnacle of world football.",
    sourceId: "rsssf-global", sourceFact: "2017 European Golden Shoe winner"
  },
  {
    id: "luis-suarez-barca-2017", identityId: "luis-suarez", editionId: "barcelona-2016-17", name: "Luis Suárez", squadNumber: 9, ovr: 94,
    naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "37 goals and 16 assists across all competitions; scored opening goal within 3 minutes of Remontada",
    appearances: 51, goals: 37, assists: 16, ratingRationale: "Fierce, relentless number nine with elite finishing.",
    sourceId: "uefa-cl-history", sourceFact: "37 goals in 2016-17 campaign"
  },
  {
    id: "neymar-jr-barca-2017", identityId: "neymar-jr", editionId: "barcelona-2016-17", name: "Neymar Jr", squadNumber: 11, ovr: 94,
    naturalPositions: ["LW"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Architect of La Remontada: scored free-kick (88'), penalty (91'), and provided 95' chipped assist for Sergi Roberto",
    appearances: 45, goals: 20, assists: 27, ratingRationale: "27 assists across all competitions in his final breathtaking season at Barcelona.",
    sourceId: "uefa-cl-history", sourceFact: "2 goals + winning assist in 6-1 Remontada"
  },

  // ==========================================
  // 2. FC BARCELONA 2017-18
  // ==========================================
  {
    id: "marc-andre-ter-stegen-barca-2018", identityId: "marc-andre-ter-stegen", editionId: "barcelona-2017-18", name: "Marc-André ter Stegen", squadNumber: 1, ovr: 92,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 48, goals: 0, cleanSheets: 24, ratingRationale: "World-class shot-stopping conceded only 29 league goals in near-invincible season.",
    sourceId: "rsssf-global", sourceFact: "2018 La Liga double winner"
  },
  {
    id: "sergi-roberto-barca-2018", identityId: "sergi-roberto", editionId: "barcelona-2017-18", name: "Sergi Roberto", squadNumber: 20, ovr: 86,
    naturalPositions: ["RB"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 48, goals: 1, assists: 8, ratingRationale: "First-choice right back providing tactical discipline and 8 assists.",
    sourceId: "rsssf-global", sourceFact: "Started 30 league games in double season"
  },
  {
    id: "gerard-pique-barca-2018", identityId: "gerard-pique", editionId: "barcelona-2017-18", name: "Gerard Piqué", squadNumber: 3, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 49, goals: 4, cleanSheets: 25, ratingRationale: "Defensive rock of Valverde's disciplined domestic double.",
    sourceId: "rsssf-global", sourceFact: "Key starter in 43-game unbeaten streak"
  },
  {
    id: "samuel-umtiti-barca-2018", identityId: "samuel-umtiti", editionId: "barcelona-2017-18", name: "Samuel Umtiti", squadNumber: 23, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 40, goals: 1, cleanSheets: 20, ratingRationale: "Arguably the best left-sided center-back in the world prior to 2018 World Cup.",
    sourceId: "rsssf-global", sourceFact: "Formed impenetrable partnership with Piqué"
  },
  {
    id: "jordi-alba-barca-2018", identityId: "jordi-alba", editionId: "barcelona-2017-18", name: "Jordi Alba", squadNumber: 18, ovr: 90,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: false,
    appearances: 46, goals: 3, assists: 11, ratingRationale: "Exploded with 11 assists after Neymar's departure freed the entire left wing.",
    sourceId: "rsssf-global", sourceFact: "11 assists in 2017-18 double"
  },
  {
    id: "sergio-busquets-barca-2018", identityId: "sergio-busquets", editionId: "barcelona-2017-18", name: "Sergio Busquets", squadNumber: 5, ovr: 91,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 50, goals: 1, assists: 5, ratingRationale: "Supreme defensive midfield positioning protecting unbeaten domestic run.",
    sourceId: "rsssf-global", sourceFact: "Started 31 league matches in title season"
  },
  {
    id: "ivan-rakitic-barca-2018", identityId: "ivan-rakitic", editionId: "barcelona-2017-18", name: "Ivan Rakitić", squadNumber: 4, ovr: 89,
    naturalPositions: ["CM"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 55, goals: 4, assists: 5, ratingRationale: "Ironman played 55 club matches, transitioning Barca smoothly between phases.",
    sourceId: "rsssf-global", sourceFact: "Most appearances of any Barca player in 2017-18"
  },
  {
    id: "paulinho-barca-2018", identityId: "paulinho-bezerra", editionId: "barcelona-2017-18", name: "Paulinho", squadNumber: 15, ovr: 86,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: false,
    appearances: 49, goals: 9, assists: 3, ratingRationale: "Cult hero revelation scoring 9 crucial league goals arriving from deep.",
    sourceId: "rsssf-global", sourceFact: "Scored 9 La Liga goals in debut year"
  },
  {
    id: "andres-iniesta-barca-2018", identityId: "andres-iniesta", editionId: "barcelona-2017-18", name: "Andrés Iniesta", squadNumber: 8, ovr: 90,
    naturalPositions: ["CM", "LM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Emotional farewell campaign; produced masterclass goal in 5-0 Copa del Rey final win before standing ovation",
    appearances: 44, goals: 2, assists: 4, ratingRationale: "Immortal elegance capping his 22-year legendary Barcelona career.",
    sourceId: "rsssf-global", sourceFact: "2018 Copa del Rey final MOTM & farewell goal"
  },
  {
    id: "lionel-messi-barca-2018", identityId: "lionel-messi", editionId: "barcelona-2017-18", name: "Lionel Messi", squadNumber: 10, ovr: 98,
    naturalPositions: ["CF", "RW"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "European Golden Shoe with 34 La Liga goals, 45 overall; led Barca to 43-game unbeaten domestic run",
    appearances: 54, goals: 45, assists: 18, ratingRationale: "Carried entire attacking structure with 45 goals and 18 assists.",
    sourceId: "rsssf-global", sourceFact: "2018 European Golden Shoe winner"
  },
  {
    id: "luis-suarez-barca-2018", identityId: "luis-suarez", editionId: "barcelona-2017-18", name: "Luis Suárez", squadNumber: 9, ovr: 93,
    naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 51, goals: 31, assists: 18, ratingRationale: "31 goals and 18 assists, decisive in domestic double.",
    sourceId: "rsssf-global", sourceFact: "Scored 2 goals in 5-0 Copa del Rey final"
  },

  // ==========================================
  // 3. FC BARCELONA 2018-19
  // ==========================================
  {
    id: "marc-andre-ter-stegen-barca-2019", identityId: "marc-andre-ter-stegen", editionId: "barcelona-2018-19", name: "Marc-André ter Stegen", squadNumber: 1, ovr: 93,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 49, goals: 0, cleanSheets: 23, ratingRationale: "Peak athletic agility and 1v1 shot-stopping in Europe.",
    sourceId: "rsssf-global", sourceFact: "2019 La Liga title winner"
  },
  {
    id: "nelson-semedo-barca-2019", identityId: "nelson-semedo", editionId: "barcelona-2018-19", name: "Nélson Semedo", squadNumber: 2, ovr: 85,
    naturalPositions: ["RB"], secondaryPositions: ["RWB"], hasLegendSeal: false,
    appearances: 46, goals: 1, assists: 3, ratingRationale: "Lightning recovery pace at right-back in title season.",
    sourceId: "rsssf-global", sourceFact: "Started 26 league matches"
  },
  {
    id: "gerard-pique-barca-2019", identityId: "gerard-pique", editionId: "barcelona-2018-19", name: "Gerard Piqué", squadNumber: 3, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 52, goals: 7, cleanSheets: 22, ratingRationale: "Incredible 7 goals from defense and supreme aerial command.",
    sourceId: "rsssf-global", sourceFact: "7 goals across all competitions"
  },
  {
    id: "clement-lenglet-barca-2019", identityId: "clement-lenglet", editionId: "barcelona-2018-19", name: "Clément Lenglet", squadNumber: 15, ovr: 86,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 45, goals: 2, cleanSheets: 19, ratingRationale: "Stepped in after Umtiti's injury with composure and aerial strength.",
    sourceId: "rsssf-global", sourceFact: "45 appearances in debut season"
  },
  {
    id: "jordi-alba-barca-2019", identityId: "jordi-alba", editionId: "barcelona-2018-19", name: "Jordi Alba", squadNumber: 18, ovr: 90,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: false,
    appearances: 54, goals: 3, assists: 17, ratingRationale: "Sensational 17 assists in all competitions across Europe.",
    sourceId: "rsssf-global", sourceFact: "17 assists across all competitions"
  },
  {
    id: "sergio-busquets-barca-2019", identityId: "sergio-busquets", editionId: "barcelona-2018-19", name: "Sergio Busquets", squadNumber: 5, ovr: 90,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 54, goals: 0, assists: 2, ratingRationale: "Orchestrated midfield tempo with unmatched calmness.",
    sourceId: "rsssf-global", sourceFact: "8th La Liga championship"
  },
  {
    id: "ivan-rakitic-barca-2019", identityId: "ivan-rakitic", editionId: "barcelona-2018-19", name: "Ivan Rakitić", squadNumber: 4, ovr: 89,
    naturalPositions: ["CM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 54, goals: 5, assists: 10, ratingRationale: "Scored iconic chip winner at Bernabéu to sink Real Madrid.",
    sourceId: "rsssf-global", sourceFact: "Match-winning goal at Bernabéu"
  },
  {
    id: "arthur-melo-barca-2019", identityId: "arthur-melo", editionId: "barcelona-2018-19", name: "Arthur Melo", squadNumber: 8, ovr: 86,
    naturalPositions: ["CM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 44, goals: 0, assists: 2, ratingRationale: "Press-resistant midfield shielding reminiscent of Xavi.",
    sourceId: "rsssf-global", sourceFact: "44 appearances in debut season"
  },
  {
    id: "ousmane-dembele-barca-2019", identityId: "ousmane-dembele", editionId: "barcelona-2018-19", name: "Ousmane Dembélé", squadNumber: 11, ovr: 88,
    naturalPositions: ["LW", "RW"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 42, goals: 14, assists: 9, ratingRationale: "Explosive two-footed pace scoring 14 goals including Supercopa stunner.",
    sourceId: "rsssf-global", sourceFact: "14 goals across all competitions"
  },
  {
    id: "lionel-messi-barca-2019", identityId: "lionel-messi", editionId: "barcelona-2018-19", name: "Lionel Messi", squadNumber: 10, ovr: 99,
    naturalPositions: ["RW", "CF"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "2019 Ballon d'Or Winner (6th); 51 goals in 50 games, European Golden Shoe, iconic 35-yard Champions League free-kick vs Liverpool",
    appearances: 50, goals: 51, assists: 19, ratingRationale: "Widely regarded as one of the greatest individual single-season performances in football history.",
    sourceId: "uefa-cl-history", sourceFact: "2019 Ballon d'Or winner & 51 goals"
  },
  {
    id: "luis-suarez-barca-2019", identityId: "luis-suarez", editionId: "barcelona-2018-19", name: "Luis Suárez", squadNumber: 9, ovr: 92,
    naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 49, goals: 25, assists: 13, ratingRationale: "Scored sensational Clásico hat-trick in 5-1 rout of Real Madrid.",
    sourceId: "rsssf-global", sourceFact: "Hat-trick in 5-1 Clásico rout"
  },

  // ==========================================
  // 4. FC BARCELONA 2024-25
  // ==========================================
  {
    id: "inaki-pena-barca-2025", identityId: "inaki-pena", editionId: "barcelona-2024-25", name: "Iñaki Peña", squadNumber: 13, ovr: 84,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 25, goals: 0, cleanSheets: 10, ratingRationale: "Stepped up in Ter Stegen's absence, clean sheet in 4-0 Clásico at Bernabéu.",
    sourceId: "rsssf-global", sourceFact: "Clean sheet in 4-0 Clásico at Bernabéu"
  },
  {
    id: "jules-kounde-barca-2025", identityId: "jules-kounde", editionId: "barcelona-2024-25", name: "Jules Koundé", squadNumber: 23, ovr: 89,
    naturalPositions: ["RB"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 35, goals: 2, assists: 6, ratingRationale: "Elite full-back lockdown defender and constant overlapping threat.",
    sourceId: "rsssf-global", sourceFact: "Key starter in Flick's runaway leader side"
  },
  {
    id: "pau-cubarsi-barca-2025", identityId: "pau-cubarsi", editionId: "barcelona-2024-25", name: "Pau Cubarsí", squadNumber: 2, ovr: 88,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Teenage defensive marvel; master of the offside trap catching Real Madrid 12 times in 4-0 Clásico masterclass",
    appearances: 34, goals: 0, cleanSheets: 14, ratingRationale: "Laser-guided passing from the back and preternatural composure at age 17.",
    sourceId: "rsssf-global", sourceFact: "Masterminded offside trap at Bernabéu"
  },
  {
    id: "inigo-martinez-barca-2025", identityId: "inigo-martinez", editionId: "barcelona-2024-25", name: "Iñigo Martínez", squadNumber: 5, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 32, goals: 2, cleanSheets: 13, ratingRationale: "Vocal defensive leader executing Flick's razor-thin high defensive line.",
    sourceId: "rsssf-global", sourceFact: "Key center-back in 4-0 Clásico win"
  },
  {
    id: "alejandro-balde-barca-2025", identityId: "alejandro-balde", editionId: "barcelona-2024-25", name: "Alejandro Balde", squadNumber: 3, ovr: 88,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: false,
    appearances: 33, goals: 1, assists: 7, ratingRationale: "Blistering pace down the left flank, assisted Lewandowski at Bernabéu.",
    sourceId: "rsssf-global", sourceFact: "Assisted in 4-0 Bernabéu victory"
  },
  {
    id: "marc-casado-barca-2025", identityId: "marc-casado", editionId: "barcelona-2024-25", name: "Marc Casadó", squadNumber: 17, ovr: 86,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 33, goals: 1, assists: 5, ratingRationale: "Breakthrough midfield anchor; delivered sublime through-ball assists vs Bayern and Madrid.",
    sourceId: "rsssf-global", sourceFact: "Assisted Lewandowski in 4-0 Bernabéu win"
  },
  {
    id: "pedri-barca-2025", identityId: "pedri", editionId: "barcelona-2024-25", name: "Pedri", squadNumber: 8, ovr: 92,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: false,
    appearances: 36, goals: 5, assists: 6, ratingRationale: "Pure midfield genius dictating tempo and escaping any high press with effortless grace.",
    sourceId: "uefa-cl-history", sourceFact: "Midfield general in 4-1 Bayern & 4-0 Madrid wins"
  },
  {
    id: "dani-olmo-barca-2025", identityId: "dani-olmo", editionId: "barcelona-2024-25", name: "Dani Olmo", squadNumber: 20, ovr: 90,
    naturalPositions: ["CAM"], secondaryPositions: ["LW", "CM"], hasLegendSeal: false,
    appearances: 26, goals: 8, assists: 4, ratingRationale: "Instant transformative impact; lethal half-space runs and Euro 2024 winning quality.",
    sourceId: "rsssf-global", sourceFact: "Scored 5 goals in first 5 La Liga starts"
  },
  {
    id: "lamine-yamal-barca-2025", identityId: "lamine-yamal", editionId: "barcelona-2024-25", name: "Lamine Yamal", squadNumber: 19, ovr: 95,
    naturalPositions: ["RW"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "2024 Kopa Trophy Winner & Euro 2024 Young Player of the Tournament; youngest goalscorer in El Clásico history (4-0 at Bernabéu)",
    appearances: 35, goals: 12, assists: 15, ratingRationale: "Generational dribbling prodigy changing football dynamics globally at age 17.",
    sourceId: "rsssf-global", sourceFact: "Youngest goalscorer in El Clásico history"
  },
  {
    id: "robert-lewandowski-barca-2025", identityId: "robert-lewandowski", editionId: "barcelona-2024-25", name: "Robert Lewandowski", squadNumber: 9, ovr: 94,
    naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 35, goals: 28, assists: 4, ratingRationale: "Scored 28 goals in first 25 games under Flick, including brace at Bernabéu.",
    sourceId: "rsssf-global", sourceFact: "Brace in 4-0 Bernabéu Clásico"
  },
  {
    id: "raphinha-barca-2025", identityId: "raphinha", editionId: "barcelona-2024-25", name: "Raphinha", squadNumber: 11, ovr: 93,
    naturalPositions: ["LW", "RW"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Explosive captaincy season; scored sensational hat-trick vs Bayern Munich (4-1) and chipped 4th goal at Bernabéu",
    appearances: 35, goals: 20, assists: 14, ratingRationale: "Relentless pressing machine with world-class finishing and leadership.",
    sourceId: "uefa-cl-history", sourceFact: "Hat-trick vs Bayern & scored in Clásico"
  },

  // ==========================================
  // 5. FC BARCELONA 2025-26
  // ==========================================
  {
    id: "marc-andre-ter-stegen-barca-2026", identityId: "marc-andre-ter-stegen", editionId: "barcelona-2025-26", name: "Marc-André ter Stegen", squadNumber: 1, ovr: 90,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 38, goals: 0, cleanSheets: 18, ratingRationale: "Triumphant return as veteran captain.",
    sourceId: "rsssf-global", sourceFact: "Captain of modern Barcelona"
  },
  {
    id: "jules-kounde-barca-2026", identityId: "jules-kounde", editionId: "barcelona-2025-26", name: "Jules Koundé", squadNumber: 23, ovr: 90,
    naturalPositions: ["RB"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 40, goals: 2, assists: 7, ratingRationale: "Impenetrable right-back marshalling the flank.",
    sourceId: "rsssf-global", sourceFact: "Consistently rated top full-back in Europe"
  },
  {
    id: "pau-cubarsi-barca-2026", identityId: "pau-cubarsi", editionId: "barcelona-2025-26", name: "Pau Cubarsí", squadNumber: 2, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 42, goals: 1, cleanSheets: 20, ratingRationale: "Established world-class center-back with supreme distribution.",
    sourceId: "rsssf-global", sourceFact: "Anchor of Barcelona defense"
  },
  {
    id: "ronald-araujo-barca-2026", identityId: "ronald-araujo", editionId: "barcelona-2025-26", name: "Ronald Araújo", squadNumber: 4, ovr: 89,
    naturalPositions: ["CB"], secondaryPositions: ["RB"], hasLegendSeal: false,
    appearances: 36, goals: 3, cleanSheets: 18, ratingRationale: "Colossal physical presence and recovery speed.",
    sourceId: "rsssf-global", sourceFact: "Dominant physical center-back"
  },
  {
    id: "alejandro-balde-barca-2026", identityId: "alejandro-balde", editionId: "barcelona-2025-26", name: "Alejandro Balde", squadNumber: 3, ovr: 89,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: false,
    appearances: 39, goals: 2, assists: 8, ratingRationale: "Dominant dynamic left-back.",
    sourceId: "rsssf-global", sourceFact: "Key wide outlet for Catalan attack"
  },
  {
    id: "marc-casado-barca-2026", identityId: "marc-casado", editionId: "barcelona-2025-26", name: "Marc Casadó", squadNumber: 17, ovr: 87,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 38, goals: 1, assists: 6, ratingRationale: "Tenacious defensive pivot breaking opposing counter-attacks.",
    sourceId: "rsssf-global", sourceFact: "Established starting pivot"
  },
  {
    id: "gavi-barca-2026", identityId: "gavi", editionId: "barcelona-2025-26", name: "Gavi", squadNumber: 6, ovr: 90,
    naturalPositions: ["CM"], secondaryPositions: ["CAM", "LM"], hasLegendSeal: false,
    appearances: 38, goals: 6, assists: 7, ratingRationale: "Heart and soul of the team with fierce tackling and exquisite technical ability.",
    sourceId: "rsssf-global", sourceFact: "Catalan fan favorite and midfield dynamo"
  },
  {
    id: "pedri-barca-2026", identityId: "pedri", editionId: "barcelona-2025-26", name: "Pedri", squadNumber: 8, ovr: 93,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "Widely acknowledged as the world's finest central midfield playmaker; flawless passing vision and tempo control",
    appearances: 42, goals: 7, assists: 12, ratingRationale: "Supreme technical maestro operating in the footsteps of Iniesta.",
    sourceId: "uefa-cl-history", sourceFact: "World-class midfield conductor"
  },
  {
    id: "lamine-yamal-barca-2026", identityId: "lamine-yamal", editionId: "barcelona-2025-26", name: "Lamine Yamal", squadNumber: 19, ovr: 96,
    naturalPositions: ["RW"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Ballon d'Or podium superstar; unstoppable dribbling, visionary playmaking, and decisive goals across Europe",
    appearances: 44, goals: 20, assists: 22, ratingRationale: "Generational superstar leading the modern era of world football.",
    sourceId: "uefa-cl-history", sourceFact: "Global football superstar and Ballon d'Or contender"
  },
  {
    id: "robert-lewandowski-barca-2026", identityId: "robert-lewandowski", editionId: "barcelona-2025-26", name: "Robert Lewandowski", squadNumber: 9, ovr: 92,
    naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 36, goals: 24, assists: 5, ratingRationale: "Clinical veteran penalty-box predator.",
    sourceId: "rsssf-global", sourceFact: "Prolific goalscorer"
  },
  {
    id: "raphinha-barca-2026", identityId: "raphinha", editionId: "barcelona-2025-26", name: "Raphinha", squadNumber: 11, ovr: 93,
    naturalPositions: ["LW", "RW"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 42, goals: 18, assists: 14, ratingRationale: "Elite attacking output and inspiring captaincy.",
    sourceId: "uefa-cl-history", sourceFact: "Key attacking winger"
  },

  // ==========================================
  // 6. REAL MADRID 1999-00
  // ==========================================
  {
    id: "iker-casillas-madrid-2000", identityId: "iker-casillas", editionId: "real-madrid-1999-00", name: "Iker Casillas", squadNumber: 27, ovr: 89,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Youngest goalkeeper in Champions League final history (19 years and 4 days); kept clean sheet in 3-0 Paris final",
    appearances: 47, goals: 0, cleanSheets: 16, ratingRationale: "Teenage sensation stepping up to save Madrid's European campaign.",
    sourceId: "uefa-cl-history", sourceFact: "Clean sheet in 2000 Paris UCL final"
  },
  {
    id: "michel-salgado-madrid-2000", identityId: "michel-salgado", editionId: "real-madrid-1999-00", name: "Míchel Salgado", squadNumber: 2, ovr: 87,
    naturalPositions: ["RB", "RWB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 47, goals: 0, cleanSheets: 16, ratingRationale: "'Two Hearts' right-back providing ferocious tackling and stamina.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2000 Paris final"
  },
  {
    id: "ivan-helguera-madrid-2000", identityId: "ivan-helguera", editionId: "real-madrid-1999-00", name: "Iván Helguera", squadNumber: 15, ovr: 88,
    naturalPositions: ["CB"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 46, goals: 2, cleanSheets: 16, ratingRationale: "Sweeper in Del Bosque's back three in the Paris final.",
    sourceId: "uefa-cl-history", sourceFact: "Key sweeper in Paris 3-0 final"
  },
  {
    id: "aitor-karanka-madrid-2000", identityId: "aitor-karanka", editionId: "real-madrid-1999-00", name: "Aitor Karanka", squadNumber: 18, ovr: 86,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 34, goals: 0, cleanSheets: 12, ratingRationale: "Reliable stopper in Madrid's knockout run through Bayern and Valencia.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2000 Paris final"
  },
  {
    id: "ivan-campo-madrid-2000", identityId: "ivan-campo", editionId: "real-madrid-1999-00", name: "Iván Campo", squadNumber: 12, ovr: 85,
    naturalPositions: ["CB"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 36, goals: 1, cleanSheets: 13, ratingRationale: "Physical warrior marking Claudio López in Paris final.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2000 Paris final"
  },
  {
    id: "roberto-carlos-madrid-2000", identityId: "roberto-carlos", editionId: "real-madrid-1999-00", name: "Roberto Carlos", squadNumber: 3, ovr: 92,
    naturalPositions: ["LB", "LWB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Assisted Morientes' opening goal in 2000 Paris final; unstoppable Brazilian thunderbolt down the left",
    appearances: 57, goals: 8, assists: 11, cleanSheets: 20, ratingRationale: "The greatest attacking left-back of his generation.",
    sourceId: "uefa-cl-history", sourceFact: "Assisted in 2000 UCL Final"
  },
  {
    id: "fernando-redondo-madrid-2000", identityId: "fernando-redondo", editionId: "real-madrid-1999-00", name: "Fernando Redondo", squadNumber: 6, ovr: 94,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "2000 UEFA Club Footballer of the Year; produced legendary Old Trafford backheel assist for Raúl vs Manchester United",
    appearances: 53, goals: 2, assists: 6, ratingRationale: "Supreme aristocratic elegance commanding the midfield.",
    sourceId: "uefa-cl-history", sourceFact: "2000 UEFA Club Footballer of the Year"
  },
  {
    id: "steve-mcmanaman-madrid-2000", identityId: "steve-mcmanaman", editionId: "real-madrid-1999-00", name: "Steve McManaman", squadNumber: 8, ovr: 90,
    naturalPositions: ["RM", "CM"], secondaryPositions: ["LM"], hasLegendSeal: true,
    legendSealReason: "Man of the Match in 2000 Paris final; scored magnificent scissor-kick volley into corner vs Valencia",
    appearances: 49, goals: 4, assists: 8, ratingRationale: "Sensational work ethic and technical flair in Madrid's European triumph.",
    sourceId: "uefa-cl-history", sourceFact: "Man of the Match & volley goal in 2000 final"
  },
  {
    id: "raul-gonzalez-madrid-2000", identityId: "raul-gonzalez", editionId: "real-madrid-1999-00", name: "Raúl González", squadNumber: 7, ovr: 93,
    naturalPositions: ["CF"], secondaryPositions: ["ST", "CAM"], hasLegendSeal: true,
    legendSealReason: "Champions League Top Scorer with 10 goals; iconic coast-to-coast sprint and rounded Cañizares for 3rd goal in Paris final",
    appearances: 57, goals: 29, assists: 8, ratingRationale: "Madrid's golden prince scoring 29 goals in all competitions.",
    sourceId: "uefa-cl-history", sourceFact: "10 UCL goals & scored in final"
  },
  {
    id: "fernando-morientes-madrid-2000", identityId: "fernando-morientes", editionId: "real-madrid-1999-00", name: "Fernando Morientes", squadNumber: 9, ovr: 89,
    naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 51, goals: 19, assists: 5, ratingRationale: "Scored towering header to open the scoring in the Paris final.",
    sourceId: "uefa-cl-history", sourceFact: "Opening goal in 2000 Paris final"
  },
  {
    id: "nicolas-anelka-madrid-2000", identityId: "nicolas-anelka", editionId: "real-madrid-1999-00", name: "Nicolas Anelka", squadNumber: 19, ovr: 87,
    naturalPositions: ["ST"], secondaryPositions: ["LW"], hasLegendSeal: false,
    appearances: 33, goals: 7, assists: 4, ratingRationale: "Clutch goals home and away vs Bayern Munich in UCL semi-final.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in both semi-final legs vs Bayern"
  },

  // ==========================================
  // 7. REAL MADRID 2002-03
  // ==========================================
  {
    id: "iker-casillas-madrid-2003", identityId: "iker-casillas", editionId: "real-madrid-2002-03", name: "Iker Casillas", squadNumber: 1, ovr: 90,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 55, goals: 0, cleanSheets: 19, ratingRationale: "'San Iker' established as the undisputed guardian of Madrid's goal.",
    sourceId: "rsssf-global", sourceFact: "2003 La Liga champion"
  },
  {
    id: "michel-salgado-madrid-2003", identityId: "michel-salgado", editionId: "real-madrid-2002-03", name: "Míchel Salgado", squadNumber: 2, ovr: 88,
    naturalPositions: ["RB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 50, goals: 1, cleanSheets: 18, ratingRationale: "Relentless stamina and defensive ferocity on the right.",
    sourceId: "rsssf-global", sourceFact: "Started 35 La Liga matches"
  },
  {
    id: "fernando-hierro-madrid-2003", identityId: "fernando-hierro", editionId: "real-madrid-2002-03", name: "Fernando Hierro", squadNumber: 4, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: ["CDM"], hasLegendSeal: false,
    appearances: 38, goals: 1, cleanSheets: 14, ratingRationale: "Captained Madrid to their 29th La Liga title in his farewell season.",
    sourceId: "rsssf-global", sourceFact: "Title-winning captain"
  },
  {
    id: "ivan-helguera-madrid-2003", identityId: "ivan-helguera", editionId: "real-madrid-2002-03", name: "Iván Helguera", squadNumber: 6, ovr: 88,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 51, goals: 6, cleanSheets: 18, ratingRationale: "Ball-playing center-back scoring 6 goals from deep.",
    sourceId: "rsssf-global", sourceFact: "51 appearances in title campaign"
  },
  {
    id: "roberto-carlos-madrid-2003", identityId: "roberto-carlos", editionId: "real-madrid-2002-03", name: "Roberto Carlos", squadNumber: 3, ovr: 93,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: true,
    legendSealReason: "2002 Ballon d'Or Runner-up and FIFA World Player of the Year Bronze; scored 7 goals in La Liga title season",
    appearances: 55, goals: 7, assists: 10, cleanSheets: 19, ratingRationale: "Peak athletic and shooting terror down the flank.",
    sourceId: "rsssf-global", sourceFact: "2002 Ballon d'Or 2nd place"
  },
  {
    id: "claude-makelele-madrid-2003", identityId: "claude-makelele", editionId: "real-madrid-2002-03", name: "Claude Makélélé", squadNumber: 24, ovr: 91,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "The 'Engine of the Bentley'; single-handedly anchored the Galácticos midfield allowing Zidane, Figo and Ronaldo to flourish",
    appearances: 42, goals: 0, cleanSheets: 16, ratingRationale: "Indispensable midfield ball-winner whose departure later ended the era.",
    sourceId: "rsssf-global", sourceFact: "Crucial midfield anchor of 2003 title"
  },
  {
    id: "esteban-cambiasso-madrid-2003", identityId: "esteban-cambiasso", editionId: "real-madrid-2002-03", name: "Esteban Cambiasso", squadNumber: 19, ovr: 86,
    naturalPositions: ["CM", "CDM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 38, goals: 0, assists: 3, ratingRationale: "Tactically intelligent partner to Makélélé in midfield.",
    sourceId: "rsssf-global", sourceFact: "Started in Intercontinental Cup triumph"
  },
  {
    id: "luis-figo-madrid-2003", identityId: "luis-figo", editionId: "real-madrid-2002-03", name: "Luís Figo", squadNumber: 10, ovr: 93,
    naturalPositions: ["RM", "RW"], secondaryPositions: ["CAM"], hasLegendSeal: false,
    appearances: 51, goals: 12, assists: 14, ratingRationale: "Sensational season on the right wing with 12 goals and 14 assists.",
    sourceId: "rsssf-global", sourceFact: "10 goals in La Liga title triumph"
  },
  {
    id: "zinedine-zidane-madrid-2003", identityId: "zinedine-zidane", editionId: "real-madrid-2002-03", name: "Zinedine Zidane", squadNumber: 5, ovr: 97,
    naturalPositions: ["CAM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "2003 FIFA World Player of the Year; mesmerizing displays of technique, pirouettes, and 12 goals in all competitions",
    appearances: 50, goals: 12, assists: 15, ratingRationale: "Footballing divinity in motion, orchestrating Madrid's attack.",
    sourceId: "rsssf-global", sourceFact: "2003 FIFA World Player of the Year"
  },
  {
    id: "raul-gonzalez-madrid-2003", identityId: "raul-gonzalez", editionId: "real-madrid-2002-03", name: "Raúl González", squadNumber: 7, ovr: 92,
    naturalPositions: ["CF"], secondaryPositions: ["ST"], hasLegendSeal: false,
    appearances: 47, goals: 25, assists: 11, ratingRationale: "25 goals across all competitions, magical brace vs Manchester United.",
    sourceId: "uefa-cl-history", sourceFact: "Brace vs Man Utd in UCL quarter-final"
  },
  {
    id: "ronaldo-nazario-madrid-2003", identityId: "ronaldo-nazario", editionId: "real-madrid-2002-03", name: "Ronaldo Nazário", squadNumber: 11, ovr: 97,
    naturalPositions: ["ST"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2002 Ballon d'Or Winner; scored sensational hat-trick at Old Trafford receiving standing ovation from entire Manchester United crowd",
    appearances: 44, goals: 30, assists: 7, ratingRationale: "'Il Fenomeno' scored 30 goals in his debut Madrid season, including final-day title brace.",
    sourceId: "uefa-cl-history", sourceFact: "Hat-trick at Old Trafford standing ovation"
  },

  // ==========================================
  // 8. REAL MADRID 2015-16
  // ==========================================
  {
    id: "keylor-navas-madrid-2016", identityId: "keylor-navas", editionId: "real-madrid-2015-16", name: "Keylor Navas", squadNumber: 1, ovr: 91,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 45, goals: 0, cleanSheets: 22, ratingRationale: "Conceded just 3 goals in 11 UCL matches during Undécima run.",
    sourceId: "uefa-cl-history", sourceFact: "Conceded only 3 goals in 2016 UCL campaign"
  },
  {
    id: "dani-carvajal-madrid-2016", identityId: "dani-carvajal", editionId: "real-madrid-2015-16", name: "Dani Carvajal", squadNumber: 15, ovr: 88,
    naturalPositions: ["RB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 31, goals: 1, assists: 5, ratingRationale: "Tenacious full-back starting the Milan final.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2016 Milan final"
  },
  {
    id: "sergio-ramos-madrid-2016", identityId: "sergio-ramos", editionId: "real-madrid-2015-16", name: "Sergio Ramos", squadNumber: 4, ovr: 92,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "UEFA Champions League Final Man of the Match; scored opening goal in Milan final and converted in shootout",
    appearances: 33, goals: 3, cleanSheets: 15, ratingRationale: "Iconic captain delivering in the biggest match on earth.",
    sourceId: "uefa-cl-history", sourceFact: "Man of the Match & scored in 2016 final"
  },
  {
    id: "pepe-madrid-2016", identityId: "pepe", editionId: "real-madrid-2015-16", name: "Pepe", squadNumber: 3, ovr: 91,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 31, goals: 1, cleanSheets: 16, ratingRationale: "Imperial defensive enforcer in Champions League triumph.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2016 Milan final"
  },
  {
    id: "marcelo-madrid-2016", identityId: "marcelo-vieira", editionId: "real-madrid-2015-16", name: "Marcelo", squadNumber: 12, ovr: 91,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: false,
    appearances: 41, goals: 2, assists: 4, ratingRationale: "World's most creative left-back, converted in Milan shootout.",
    sourceId: "uefa-cl-history", sourceFact: "Scored penalty in 2016 shootout"
  },
  {
    id: "casemiro-madrid-2016", identityId: "casemiro", editionId: "real-madrid-2015-16", name: "Casemiro", squadNumber: 14, ovr: 89,
    naturalPositions: ["CDM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 35, goals: 1, assists: 4, ratingRationale: "Zidane's tactical masterstroke, transforming Madrid's defensive solidity.",
    sourceId: "uefa-cl-history", sourceFact: "Breakthrough starting anchor in Undécima"
  },
  {
    id: "toni-kroos-madrid-2016", identityId: "toni-kroos", editionId: "real-madrid-2015-16", name: "Toni Kroos", squadNumber: 8, ovr: 91,
    naturalPositions: ["CM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 44, goals: 1, assists: 13, ratingRationale: "German pass-master with 94% pass completion across Europe.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2016 Milan final"
  },
  {
    id: "luka-modric-madrid-2016", identityId: "luka-modric", editionId: "real-madrid-2015-16", name: "Luka Modrić", squadNumber: 19, ovr: 93,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: false,
    appearances: 44, goals: 3, assists: 4, ratingRationale: "UEFA Champions League Squad of the Season, tireless midfield maestro.",
    sourceId: "uefa-cl-history", sourceFact: "2016 UCL Squad of the Season"
  },
  {
    id: "gareth-bale-madrid-2016", identityId: "gareth-bale", editionId: "real-madrid-2015-16", name: "Gareth Bale", squadNumber: 11, ovr: 92,
    naturalPositions: ["RW"], secondaryPositions: ["LW"], hasLegendSeal: true,
    legendSealReason: "Assisted Ramos' goal in Milan final, scored in penalty shootout despite severe cramp; 19 league goals in 23 games",
    appearances: 31, goals: 19, assists: 14, ratingRationale: "Explosive Welsh powerhouse at the peak of his physical powers.",
    sourceId: "uefa-cl-history", sourceFact: "Assisted & scored in 2016 shootout"
  },
  {
    id: "karim-benzema-madrid-2016", identityId: "karim-benzema", editionId: "real-madrid-2015-16", name: "Karim Benzema", squadNumber: 9, ovr: 89,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: false,
    appearances: 36, goals: 28, assists: 8, ratingRationale: "28 goals in 36 appearances with lethal link-up play.",
    sourceId: "uefa-cl-history", sourceFact: "28 goals in 2015-16 season"
  },
  {
    id: "cristiano-ronaldo-madrid-2016", identityId: "cristiano-ronaldo", editionId: "real-madrid-2015-16", name: "Cristiano Ronaldo", squadNumber: 7, ovr: 98,
    naturalPositions: ["LW", "ST"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2016 Ballon d'Or Winner; 16 Champions League goals (51 in all comps), iconic Wolfsburg hat-trick comeback, and scored winning Undécima penalty",
    appearances: 48, goals: 51, assists: 15, ratingRationale: "Ruthless goalscoring juggernaut securing Madrid's 11th European crown.",
    sourceId: "uefa-cl-history", sourceFact: "2016 Ballon d'Or & scored winning penalty in final"
  },

  // ==========================================
  // 9. REAL MADRID 2017-18
  // ==========================================
  {
    id: "keylor-navas-madrid-2018", identityId: "keylor-navas", editionId: "real-madrid-2017-18", name: "Keylor Navas", squadNumber: 1, ovr: 90,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 44, goals: 0, cleanSheets: 11, ratingRationale: "Heroic 8 saves vs Bayern Munich in semi-final to send Madrid to Kiev.",
    sourceId: "uefa-cl-history", sourceFact: "Man of the Match in 2018 semi-final vs Bayern"
  },
  {
    id: "dani-carvajal-madrid-2018", identityId: "dani-carvajal", editionId: "real-madrid-2017-18", name: "Dani Carvajal", squadNumber: 2, ovr: 89,
    naturalPositions: ["RB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 41, goals: 0, assists: 7, ratingRationale: "Uncompromising full-back winning his 4th Champions League.",
    sourceId: "uefa-cl-history", sourceFact: "4th UCL title in Kiev"
  },
  {
    id: "sergio-ramos-madrid-2018", identityId: "sergio-ramos", editionId: "real-madrid-2017-18", name: "Sergio Ramos", squadNumber: 4, ovr: 93,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Captained Real Madrid to the first modern European Cup 3-peat in history; UEFA Defender of the Season",
    appearances: 42, goals: 5, cleanSheets: 13, ratingRationale: "The supreme big-game defender and captain in Champions League history.",
    sourceId: "uefa-cl-history", sourceFact: "3-peat Champions League winning captain"
  },
  {
    id: "raphael-varane-madrid-2018", identityId: "raphael-varane", editionId: "real-madrid-2017-18", name: "Raphaël Varane", squadNumber: 5, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 44, goals: 0, cleanSheets: 15, ratingRationale: "Pace and reading of the game in historic Champions League & World Cup double year.",
    sourceId: "uefa-cl-history", sourceFact: "2018 UCL and World Cup winner"
  },
  {
    id: "marcelo-madrid-2018", identityId: "marcelo-vieira", editionId: "real-madrid-2017-18", name: "Marcelo", squadNumber: 12, ovr: 92,
    naturalPositions: ["LB"], secondaryPositions: ["LWB"], hasLegendSeal: true,
    legendSealReason: "Scored in round of 16 (PSG), quarter-final (Juventus), and semi-final (Bayern), then assisted Bale in Kiev final",
    appearances: 44, goals: 5, assists: 11, ratingRationale: "Unprecedented attacking impact from left-back in European knockout football.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in R16, QF, SF & assisted in Kiev final"
  },
  {
    id: "casemiro-madrid-2018", identityId: "casemiro", editionId: "real-madrid-2017-18", name: "Casemiro", squadNumber: 14, ovr: 91,
    naturalPositions: ["CDM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 48, goals: 7, assists: 3, ratingRationale: "Complete defensive destroyer breaking opposing attacks.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2018 Kiev final"
  },
  {
    id: "toni-kroos-madrid-2018", identityId: "toni-kroos", editionId: "real-madrid-2017-18", name: "Toni Kroos", squadNumber: 8, ovr: 92,
    naturalPositions: ["CM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 43, goals: 5, assists: 10, ratingRationale: "94% pass accuracy in Kiev final, clinical midfield metronome.",
    sourceId: "uefa-cl-history", sourceFact: "Key midfielder in 3-peat triumph"
  },
  {
    id: "luka-modric-madrid-2018", identityId: "luka-modric", editionId: "real-madrid-2017-18", name: "Luka Modrić", squadNumber: 10, ovr: 94,
    naturalPositions: ["CM"], secondaryPositions: ["CAM"], hasLegendSeal: true,
    legendSealReason: "2018 Ballon d'Or Winner & UEFA Men's Player of the Year; dominated Kiev final against Liverpool with supreme control",
    appearances: 43, goals: 2, assists: 8, ratingRationale: "The supreme midfielder on the planet ending the Messi-Ronaldo Ballon d'Or duopoly.",
    sourceId: "uefa-cl-history", sourceFact: "2018 Ballon d'Or Winner"
  },
  {
    id: "isco-madrid-2018", identityId: "isco", editionId: "real-madrid-2017-18", name: "Isco", squadNumber: 22, ovr: 90,
    naturalPositions: ["CAM"], secondaryPositions: ["CM", "LW"], hasLegendSeal: false,
    appearances: 49, goals: 9, assists: 10, ratingRationale: "Tip of the midfield diamond in Kiev, dazzling close control.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2018 Kiev final"
  },
  {
    id: "karim-benzema-madrid-2018", identityId: "karim-benzema", editionId: "real-madrid-2017-18", name: "Karim Benzema", squadNumber: 9, ovr: 89,
    naturalPositions: ["ST"], secondaryPositions: ["CF"], hasLegendSeal: false,
    appearances: 47, goals: 12, assists: 11, ratingRationale: "Scored brace in semi-final vs Bayern and opened scoring in Kiev final.",
    sourceId: "uefa-cl-history", sourceFact: "Scored opening goal in 2018 final"
  },
  {
    id: "cristiano-ronaldo-madrid-2018", identityId: "cristiano-ronaldo", editionId: "real-madrid-2017-18", name: "Cristiano Ronaldo", squadNumber: 7, ovr: 98,
    naturalPositions: ["LW", "ST"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Champions League Top Scorer with 15 goals; iconic overhead bicycle kick vs Juventus in Turin; became first player to win 5 modern UCL titles",
    appearances: 44, goals: 44, assists: 8, ratingRationale: "Scored in first 10 consecutive Champions League games, farewell Madrid triumph.",
    sourceId: "uefa-cl-history", sourceFact: "15 UCL goals & Turin bicycle kick"
  },

  // ==========================================
  // 10. REAL MADRID 2023-24
  // ==========================================
  {
    id: "thibaut-courtois-madrid-2024", identityId: "thibaut-courtois", editionId: "real-madrid-2023-24", name: "Thibaut Courtois", squadNumber: 1, ovr: 94,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 5, goals: 0, cleanSheets: 5, ratingRationale: "Returned from ACL to keep clean sheet in 2-0 Wembley final vs Dortmund.",
    sourceId: "uefa-cl-history", sourceFact: "Clean sheet in 2024 Wembley final"
  },
  {
    id: "dani-carvajal-madrid-2024", identityId: "dani-carvajal", editionId: "real-madrid-2023-24", name: "Dani Carvajal", squadNumber: 2, ovr: 91,
    naturalPositions: ["RB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "UEFA Champions League Final Player of the Match; scored winning header in Wembley final to secure his 6th European Cup",
    appearances: 41, goals: 6, assists: 5, ratingRationale: "Career-defining season with 6 goals, winning both Champions League and Euro 2024.",
    sourceId: "uefa-cl-history", sourceFact: "UCL Final Player of the Match & scored winner"
  },
  {
    id: "antonio-rudiger-madrid-2024", identityId: "antonio-rudiger", editionId: "real-madrid-2023-24", name: "Antonio Rüdiger", squadNumber: 22, ovr: 92,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 48, goals: 2, cleanSheets: 20, ratingRationale: "Colossal defensive warrior pocketing Haaland and Kane in UCL knockouts.",
    sourceId: "uefa-cl-history", sourceFact: "Started Wembley final & scored winning shootout penalty vs City"
  },
  {
    id: "nacho-fernandez-madrid-2024", identityId: "nacho-fernandez", editionId: "real-madrid-2023-24", name: "Nacho", squadNumber: 6, ovr: 88,
    naturalPositions: ["CB"], secondaryPositions: ["RB", "LB"], hasLegendSeal: false,
    appearances: 45, goals: 0, cleanSheets: 18, ratingRationale: "One-club captain lifting La Liga and Champions League trophies at Wembley.",
    sourceId: "uefa-cl-history", sourceFact: "Captain lifting 15th European Cup"
  },
  {
    id: "ferland-mendy-madrid-2024", identityId: "ferland-mendy", editionId: "real-madrid-2023-24", name: "Ferland Mendy", squadNumber: 23, ovr: 88,
    naturalPositions: ["LB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 37, goals: 1, cleanSheets: 17, ratingRationale: "Defensive fortress hailed by Ancelotti as the best defensive left-back in the world.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2024 Wembley final"
  },
  {
    id: "eduardo-camavinga-madrid-2024", identityId: "eduardo-camavinga", editionId: "real-madrid-2023-24", name: "Eduardo Camavinga", squadNumber: 12, ovr: 89,
    naturalPositions: ["CDM"], secondaryPositions: ["CM", "LB"], hasLegendSeal: false,
    appearances: 46, goals: 0, assists: 4, ratingRationale: "Supreme tackle success and press evasion in Wembley final starting XI.",
    sourceId: "uefa-cl-history", sourceFact: "Started 2024 Wembley final"
  },
  {
    id: "toni-kroos-madrid-2024", identityId: "toni-kroos", editionId: "real-madrid-2023-24", name: "Toni Kroos", squadNumber: 8, ovr: 93,
    naturalPositions: ["CM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Legendary farewell club match; assisted Carvajal's winning goal in Wembley final to win his 6th European Cup before retirement",
    appearances: 48, goals: 1, assists: 10, ratingRationale: "Retired at the absolute summit of world football with 95% pass accuracy.",
    sourceId: "uefa-cl-history", sourceFact: "Assisted winning goal in Wembley final farewell"
  },
  {
    id: "federico-valverde-madrid-2024", identityId: "federico-valverde", editionId: "real-madrid-2023-24", name: "Fede Valverde", squadNumber: 15, ovr: 92,
    naturalPositions: ["CM"], secondaryPositions: ["RM", "RW"], hasLegendSeal: false,
    appearances: 54, goals: 3, assists: 8, ratingRationale: "Inexhaustible engine playing 54 matches, scoring iconic volley vs Manchester City.",
    sourceId: "uefa-cl-history", sourceFact: "Scored iconic volley vs Man City in 3-3 thriller"
  },
  {
    id: "jude-bellingham-madrid-2024", identityId: "jude-bellingham", editionId: "real-madrid-2023-24", name: "Jude Bellingham", squadNumber: 5, ovr: 96,
    naturalPositions: ["CAM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "La Liga Player of the Year & Laureus Breakthrough of the Year; 23 goals and 13 assists in debut season, assisted Vinícius in Wembley final",
    appearances: 42, goals: 23, assists: 13, ratingRationale: "Sensational debut season taking world football by storm wearing Zidane's #5.",
    sourceId: "uefa-cl-history", sourceFact: "La Liga Player of the Season & UCL winner"
  },
  {
    id: "rodrygo-goes-madrid-2024", identityId: "rodrygo-goes", editionId: "real-madrid-2023-24", name: "Rodrygo", squadNumber: 11, ovr: 90,
    naturalPositions: ["RW", "ST"], secondaryPositions: ["LW"], hasLegendSeal: false,
    appearances: 51, goals: 17, assists: 9, ratingRationale: "Scored home and away vs Manchester City in UCL quarter-finals.",
    sourceId: "uefa-cl-history", sourceFact: "Scored in both legs vs Man City"
  },
  {
    id: "vinicius-junior-madrid-2024", identityId: "vinicius-junior", editionId: "real-madrid-2023-24", name: "Vinícius Jr", squadNumber: 7, ovr: 97,
    naturalPositions: ["LW"], secondaryPositions: ["ST"], hasLegendSeal: true,
    legendSealReason: "2023-24 UEFA Champions League Player of the Season; scored the decisive 2nd goal in the Wembley final and brace vs Bayern Munich",
    appearances: 39, goals: 24, assists: 11, ratingRationale: "The most electrifying, uncontainable attacking winger on the planet.",
    sourceId: "uefa-cl-history", sourceFact: "2023-24 UEFA Champions League Player of the Season"
  },

  // ==========================================
  // 11. REAL MADRID 2024-25
  // ==========================================
  {
    id: "thibaut-courtois-madrid-2025", identityId: "thibaut-courtois", editionId: "real-madrid-2024-25", name: "Thibaut Courtois", squadNumber: 1, ovr: 94,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 35, goals: 0, cleanSheets: 16, ratingRationale: "Elite clean sheet in UEFA Super Cup triumph.",
    sourceId: "uefa-cl-history", sourceFact: "Clean sheet in 2024 UEFA Super Cup"
  },
  {
    id: "dani-carvajal-madrid-2025", identityId: "dani-carvajal", editionId: "real-madrid-2024-25", name: "Dani Carvajal", squadNumber: 2, ovr: 90,
    naturalPositions: ["RB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 25, goals: 1, assists: 3, ratingRationale: "Ballon d'Or 4th place after historic year.",
    sourceId: "rsssf-global", sourceFact: "2024 Ballon d'Or top 4 finish"
  },
  {
    id: "eder-militao-madrid-2025", identityId: "eder-militao", editionId: "real-madrid-2024-25", name: "Éder Militão", squadNumber: 3, ovr: 89,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 28, goals: 1, cleanSheets: 13, ratingRationale: "Dynamic recovery pace in central defense.",
    sourceId: "uefa-cl-history", sourceFact: "Started UEFA Super Cup win"
  },
  {
    id: "antonio-rudiger-madrid-2025", identityId: "antonio-rudiger", editionId: "real-madrid-2024-25", name: "Antonio Rüdiger", squadNumber: 22, ovr: 91,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 38, goals: 2, cleanSheets: 17, ratingRationale: "Defensive leader and clutch set-piece threat.",
    sourceId: "uefa-cl-history", sourceFact: "Key defensive anchor"
  },
  {
    id: "ferland-mendy-madrid-2025", identityId: "ferland-mendy", editionId: "real-madrid-2024-25", name: "Ferland Mendy", squadNumber: 23, ovr: 87,
    naturalPositions: ["LB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 32, goals: 0, cleanSheets: 15, ratingRationale: "Solid 1v1 defensive containment.",
    sourceId: "uefa-cl-history", sourceFact: "Started UEFA Super Cup"
  },
  {
    id: "aurelien-tchouameni-madrid-2025", identityId: "aurelien-tchouameni", editionId: "real-madrid-2024-25", name: "Aurélien Tchouaméni", squadNumber: 14, ovr: 89,
    naturalPositions: ["CDM"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 36, goals: 1, assists: 2, ratingRationale: "Physical anchor breaking play and recycling possession.",
    sourceId: "uefa-cl-history", sourceFact: "Started UEFA Super Cup win"
  },
  {
    id: "federico-valverde-madrid-2025", identityId: "federico-valverde", editionId: "real-madrid-2024-25", name: "Fede Valverde", squadNumber: 8, ovr: 92,
    naturalPositions: ["CM"], secondaryPositions: ["RM"], hasLegendSeal: false,
    appearances: 40, goals: 5, assists: 7, ratingRationale: "Inherited Kroos' #8 shirt, scored opening goal in UEFA Super Cup.",
    sourceId: "uefa-cl-history", sourceFact: "Scored opening goal in 2024 UEFA Super Cup"
  },
  {
    id: "jude-bellingham-madrid-2025", identityId: "jude-bellingham", editionId: "real-madrid-2024-25", name: "Jude Bellingham", squadNumber: 5, ovr: 95,
    naturalPositions: ["CAM", "CM"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 36, goals: 12, assists: 11, ratingRationale: "Man of the Match in UEFA Super Cup with sublime assist to Mbappé.",
    sourceId: "uefa-cl-history", sourceFact: "Man of the Match in 2024 UEFA Super Cup"
  },
  {
    id: "rodrygo-goes-madrid-2025", identityId: "rodrygo-goes", editionId: "real-madrid-2024-25", name: "Rodrygo", squadNumber: 11, ovr: 90,
    naturalPositions: ["RW"], secondaryPositions: ["LW"], hasLegendSeal: false,
    appearances: 38, goals: 13, assists: 8, ratingRationale: "Incisive wide attacker completing Madrid's world-class front line.",
    sourceId: "uefa-cl-history", sourceFact: "Started UEFA Super Cup triumph"
  },
  {
    id: "kylian-mbappe-madrid-2025", identityId: "kylian-mbappe", editionId: "real-madrid-2024-25", name: "Kylian Mbappé", squadNumber: 9, ovr: 97,
    naturalPositions: ["ST"], secondaryPositions: ["LW"], hasLegendSeal: true,
    legendSealReason: "Global superstar arrival; scored on Real Madrid debut in 2-0 UEFA Super Cup win vs Atalanta in Warsaw",
    appearances: 38, goals: 28, assists: 6, ratingRationale: "World's most lethal striker leading the line for the European champions.",
    sourceId: "uefa-cl-history", sourceFact: "Scored on Real Madrid debut in Super Cup"
  },
  {
    id: "vinicius-junior-madrid-2025", identityId: "vinicius-junior", editionId: "real-madrid-2024-25", name: "Vinícius Jr", squadNumber: 7, ovr: 96,
    naturalPositions: ["LW"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 38, goals: 22, assists: 12, ratingRationale: "Devastating one-on-one dribbler, assisted Valverde in Super Cup final.",
    sourceId: "uefa-cl-history", sourceFact: "Assisted in UEFA Super Cup win"
  },

  // ==========================================
  // 12. ARSENAL 2001-02
  // ==========================================
  {
    id: "david-seaman-arsenal-2002", identityId: "david-seaman", editionId: "arsenal-2001-02", name: "David Seaman", squadNumber: 1, ovr: 90,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 25, goals: 0, cleanSheets: 12, ratingRationale: "'Safe Hands' clean sheet in 2-0 FA Cup final vs Chelsea.",
    sourceId: "rsssf-global", sourceFact: "Clean sheet in 2002 FA Cup final"
  },
  {
    id: "lauren-arsenal-2002", identityId: "lauren", editionId: "arsenal-2001-02", name: "Lauren", squadNumber: 12, ovr: 87,
    naturalPositions: ["RB"], secondaryPositions: ["RM"], hasLegendSeal: false,
    appearances: 41, goals: 2, cleanSheets: 18, ratingRationale: "Tough-tackling Cameroonian full-back scoring winner in North London derby.",
    sourceId: "rsssf-global", sourceFact: "Started 2002 FA Cup final"
  },
  {
    id: "sol-campbell-arsenal-2002", identityId: "sol-campbell", editionId: "arsenal-2001-02", name: "Sol Campbell", squadNumber: 23, ovr: 91,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 44, goals: 3, cleanSheets: 19, ratingRationale: "Sensational debut season winning the Double after crossing North London.",
    sourceId: "rsssf-global", sourceFact: "Premier League & FA Cup double winner"
  },
  {
    id: "martin-keown-arsenal-2002", identityId: "martin-keown", editionId: "arsenal-2001-02", name: "Martin Keown", squadNumber: 5, ovr: 87,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 34, goals: 0, cleanSheets: 15, ratingRationale: "Fierce, unyielding defensive presence in title run-in.",
    sourceId: "rsssf-global", sourceFact: "Double-winning central defender"
  },
  {
    id: "ashley-cole-arsenal-2002", identityId: "ashley-cole", editionId: "arsenal-2001-02", name: "Ashley Cole", squadNumber: 3, ovr: 89,
    naturalPositions: ["LB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 40, goals: 2, assists: 4, ratingRationale: "Breakout season establishing himself as England's finest left-back.",
    sourceId: "rsssf-global", sourceFact: "Started 2002 FA Cup final"
  },
  {
    id: "ray-parlour-arsenal-2002", identityId: "ray-parlour", editionId: "arsenal-2001-02", name: "Ray Parlour", squadNumber: 15, ovr: 87,
    naturalPositions: ["CM", "RM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "The 'Romford Pelé'; scored sensational 25-yard curling screamer in 2002 FA Cup final vs Chelsea",
    appearances: 40, goals: 3, assists: 5, ratingRationale: "Workhorse midfield hero delivering unforgettable Millennium Stadium moment.",
    sourceId: "rsssf-global", sourceFact: "Scored iconic FA Cup final opening goal"
  },
  {
    id: "patrick-vieira-arsenal-2002", identityId: "patrick-vieira", editionId: "arsenal-2001-02", name: "Patrick Vieira", squadNumber: 4, ovr: 94,
    naturalPositions: ["CM", "CDM"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Colossal midfield leader; PFA Team of the Year, dominated Old Trafford title win and FA Cup final",
    appearances: 54, goals: 3, assists: 7, ratingRationale: "The gold standard of complete box-to-box midfield mastery.",
    sourceId: "rsssf-global", sourceFact: "2002 PFA Team of the Year"
  },
  {
    id: "freddie-ljungberg-arsenal-2002", identityId: "freddie-ljungberg", editionId: "arsenal-2001-02", name: "Freddie Ljungberg", squadNumber: 8, ovr: 91,
    naturalPositions: ["RM"], secondaryPositions: ["LM", "RW"], hasLegendSeal: true,
    legendSealReason: "2001-02 Premier League Player of the Season; scored 17 goals including solo masterpiece in FA Cup final and crucial title run-in streak",
    appearances: 39, goals: 17, assists: 6, ratingRationale: "Red-haired dynamo timing penetrative runs into the box to perfection.",
    sourceId: "rsssf-global", sourceFact: "2001-02 Premier League Player of the Season"
  },
  {
    id: "robert-pires-arsenal-2002", identityId: "robert-pires", editionId: "arsenal-2001-02", name: "Robert Pirès", squadNumber: 7, ovr: 93,
    naturalPositions: ["LM"], secondaryPositions: ["LW", "CAM"], hasLegendSeal: true,
    legendSealReason: "2001-02 FWA Footballer of the Year; Premier League top assist provider with 15 assists and 13 goals despite cruciate injury in March",
    appearances: 45, goals: 13, assists: 15, ratingRationale: "Sublime aesthetic French poetry down the left flank.",
    sourceId: "rsssf-global", sourceFact: "2002 FWA Footballer of the Year"
  },
  {
    id: "dennis-bergkamp-arsenal-2002", identityId: "dennis-bergkamp", editionId: "arsenal-2001-02", name: "Dennis Bergkamp", squadNumber: 10, ovr: 93,
    naturalPositions: ["CF"], secondaryPositions: ["CAM", "ST"], hasLegendSeal: true,
    legendSealReason: "Scored the greatest goal in Premier League history: the impossible pirouette and flick past Dabizas at Newcastle",
    appearances: 46, goals: 14, assists: 15, ratingRationale: "Genius technique and spatial awareness orchestrating the attack.",
    sourceId: "rsssf-global", sourceFact: "Iconic Newcastle pirouette goal"
  },
  {
    id: "thierry-henry-arsenal-2002", identityId: "thierry-henry", editionId: "arsenal-2001-02", name: "Thierry Henry", squadNumber: 14, ovr: 95,
    naturalPositions: ["ST"], secondaryPositions: ["LW"], hasLegendSeal: true,
    legendSealReason: "Premier League Golden Boot Winner with 24 goals (32 overall); unstoppable electrifying pace and finishing in Double season",
    appearances: 49, goals: 32, assists: 8, ratingRationale: "Ascended into the premier striker in world football.",
    sourceId: "rsssf-global", sourceFact: "2001-02 Premier League Golden Boot"
  },

  // ==========================================
  // 13. ARSENAL 2023-24
  // ==========================================
  {
    id: "david-raya-arsenal-2024", identityId: "david-raya", editionId: "arsenal-2023-24", name: "David Raya", squadNumber: 22, ovr: 89,
    naturalPositions: ["GK"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "2023-24 Premier League Golden Glove Winner with 16 clean sheets; penalty shootout hero vs Porto in UCL",
    appearances: 41, goals: 0, cleanSheets: 20, ratingRationale: "Flawless proactive cross-claiming and distribution.",
    sourceId: "rsssf-global", sourceFact: "2023-24 Premier League Golden Glove"
  },
  {
    id: "ben-white-arsenal-2024", identityId: "ben-white", editionId: "arsenal-2023-24", name: "Ben White", squadNumber: 4, ovr: 88,
    naturalPositions: ["RB"], secondaryPositions: ["CB"], hasLegendSeal: false,
    appearances: 51, goals: 4, assists: 5, ratingRationale: "Ironman overlapping full-back scoring brace vs Chelsea in 5-0 rout.",
    sourceId: "rsssf-global", sourceFact: "Brace in 5-0 win over Chelsea"
  },
  {
    id: "william-saliba-arsenal-2024", identityId: "william-saliba", editionId: "arsenal-2023-24", name: "William Saliba", squadNumber: 2, ovr: 93,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: true,
    legendSealReason: "Played every single minute (3,420') of Arsenal's 89-point Premier League season; PFA Team of the Year anchor of best defense in England",
    appearances: 50, goals: 2, cleanSheets: 22, ratingRationale: "Rolls-Royce center-back conceding zero dribbles in multiple high-stakes tests.",
    sourceId: "rsssf-global", sourceFact: "Played every minute of 89-point campaign"
  },
  {
    id: "gabriel-magalhaes-arsenal-2024", identityId: "gabriel-magalhaes", editionId: "arsenal-2023-24", name: "Gabriel Magalhães", squadNumber: 6, ovr: 90,
    naturalPositions: ["CB"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 50, goals: 4, cleanSheets: 22, ratingRationale: "Ferocious, dominant aerial monster in both boxes and set-piece titan.",
    sourceId: "rsssf-global", sourceFact: "PFA Team of the Year nominee"
  },
  {
    id: "oleksandr-zinchenko-arsenal-2024", identityId: "oleksandr-zinchenko", editionId: "arsenal-2023-24", name: "Oleksandr Zinchenko", squadNumber: 35, ovr: 86,
    naturalPositions: ["LB"], secondaryPositions: ["CM"], hasLegendSeal: false,
    appearances: 35, goals: 1, assists: 2, ratingRationale: "Inverted full-back creating midfield overloads in possession.",
    sourceId: "rsssf-global", sourceFact: "Key inverted full-back"
  },
  {
    id: "declan-rice-arsenal-2024", identityId: "declan-rice", editionId: "arsenal-2023-24", name: "Declan Rice", squadNumber: 41, ovr: 92,
    naturalPositions: ["CDM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "Transformative £105m midfield general; 7 goals, 8 assists, iconic 96th-minute winner vs Manchester United, PFA Team of the Year",
    appearances: 51, goals: 7, assists: 10, ratingRationale: "Imperious ball-carrying and ground duel dominance.",
    sourceId: "rsssf-global", sourceFact: "2023-24 PFA Team of the Year"
  },
  {
    id: "martin-odegaard-arsenal-2024", identityId: "martin-odegaard", editionId: "arsenal-2023-24", name: "Martin Ødegaard", squadNumber: 8, ovr: 93,
    naturalPositions: ["CAM"], secondaryPositions: ["CM"], hasLegendSeal: true,
    legendSealReason: "Arsenal Captain & PFA Team of the Year; Premier League leader in open-play chances created with 11 goals and 11 assists",
    appearances: 48, goals: 11, assists: 11, ratingRationale: "Surgical left foot and relentless pressing trigger.",
    sourceId: "rsssf-global", sourceFact: "2023-24 PFA Team of the Year & Captain"
  },
  {
    id: "kai-havertz-arsenal-2024", identityId: "kai-havertz", editionId: "arsenal-2023-24", name: "Kai Havertz", squadNumber: 29, ovr: 88,
    naturalPositions: ["CF", "ST"], secondaryPositions: ["CAM", "CM"], hasLegendSeal: false,
    appearances: 51, goals: 14, assists: 7, ratingRationale: "Transformative second-half of season leading the line with 14 goals.",
    sourceId: "rsssf-global", sourceFact: "14 Premier League goals"
  },
  {
    id: "bukayo-saka-arsenal-2024", identityId: "bukayo-saka", editionId: "arsenal-2023-24", name: "Bukayo Saka", squadNumber: 7, ovr: 92,
    naturalPositions: ["RW"], secondaryPositions: ["RM"], hasLegendSeal: true,
    legendSealReason: "20 goals and 14 assists across all competitions; Ballon d'Or nominee and talismanic right-wing dynamo",
    appearances: 47, goals: 20, assists: 14, ratingRationale: "Consistently decisive world-class output facing relentless double-teams.",
    sourceId: "rsssf-global", sourceFact: "20 goals & 14 assists in 2023-24"
  },
  {
    id: "gabriel-jesus-arsenal-2024", identityId: "gabriel-jesus", editionId: "arsenal-2023-24", name: "Gabriel Jesus", squadNumber: 9, ovr: 87,
    naturalPositions: ["ST"], secondaryPositions: ["LW", "RW"], hasLegendSeal: false,
    appearances: 36, goals: 8, assists: 8, ratingRationale: "Champions League clutch goals and relentless pressing fluidity.",
    sourceId: "uefa-cl-history", sourceFact: "4 goals in Champions League"
  },
  {
    id: "gabriel-martinelli-arsenal-2024", identityId: "gabriel-martinelli", editionId: "arsenal-2023-24", name: "Gabriel Martinelli", squadNumber: 11, ovr: 88,
    naturalPositions: ["LW"], secondaryPositions: [], hasLegendSeal: false,
    appearances: 44, goals: 8, assists: 5, ratingRationale: "Blistering pace, scored late 86th-minute winner vs Manchester City.",
    sourceId: "rsssf-global", sourceFact: "Scored winner vs Manchester City"
  }
];
