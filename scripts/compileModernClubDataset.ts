import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DATA_DIR,
  toPlayerVersion,
  keptClubEditions,
  keptClubPlayers,
  existingIdentities,
  IdentityDef,
} from './modernClubBase.js';
import { newClubEditions } from './modernClubAdditions.js';
import { modernClubPlayersPart1 } from './modernClubPlayers1.js';
import { modernClubPlayersPart2 } from './modernClubPlayers2.js';
import { expansionClubEditions } from './expansionEditions.js';
import { expansionPlayersPart1 } from './expansionPlayersPart1.js';
import { expansionPlayersPart2 } from './expansionPlayersPart2.js';
import { expansionPlayersPart3 } from './expansionPlayersPart3.js';
import { expansionIdentities } from './expansionIdentities.js';
import { benchPart1 } from './generateBenchPart1.js';
import { benchPart2 } from './generateBenchPart2.js';
import { benchPart3 } from './generateBenchPart3.js';
import { benchPart4 } from './generateBenchPart4.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to convert bench player input to PlayerDef format
function benchToPlayerDef(b: any): PlayerDef {
  return {
    id: b.id,
    identityId: b.identityId,
    editionId: b.editionId,
    name: b.name,
    squadNumber: b.squadNumber,
    ovr: b.ovr,
    naturalPositions: b.naturalPositions,
    secondaryPositions: b.secondaryPositions,
    hasLegendSeal: !!b.hasLegendSeal,
    ...(b.legendSealReason ? { legendSealReason: b.legendSealReason } : {}),
    appearances: b.appearances,
    goals: b.goals,
    ...(b.assists !== undefined ? { assists: b.assists } : {}),
    ...(b.cleanSheets !== undefined ? { cleanSheets: b.cleanSheets } : {}),
    ratingRationale: b.ratingRationale,
    sourceId: b.sourceId,
    sourceFact: b.sourceFact,
  };
}

const allBenchPlayerDefs = [
  ...benchPart1,
  ...benchPart2,
  ...benchPart3,
  ...benchPart4,
].map(benchToPlayerDef);

// Combined new players from starting XI and full bench expansions
const allNewPlayerDefs = [
  ...modernClubPlayersPart1,
  ...modernClubPlayersPart2,
  ...expansionPlayersPart1,
  ...expansionPlayersPart2,
  ...expansionPlayersPart3,
  ...allBenchPlayerDefs,
];

// Known identity dictionary for any newly introduced players
const baseIdentityRegistry: Record<string, Omit<IdentityDef, 'id'>> = {
  // Barcelona 2011 & 2006
  'oleguer-presas': { name: 'Oleguer Presas Renom', commonName: 'Oleguer', nationality: 'Spain', birthYear: 1980, canonicalPosition: 'RB' },
  'edmilson': { name: 'José Edmílson Gomes de Moraes', commonName: 'Edmílson', nationality: 'Brazil', birthYear: 1976, canonicalPosition: 'CDM' },
  'mark-van-bommel': { name: 'Mark van Bommel', commonName: 'Van Bommel', nationality: 'Netherlands', birthYear: 1977, canonicalPosition: 'CM' },
  'ludovic-giuly': { name: 'Ludovic Giuly', commonName: 'Giuly', nationality: 'France', birthYear: 1976, canonicalPosition: 'RW' },
  'pedro-rodriguez': { name: 'Pedro Rodríguez Ledesma', commonName: 'Pedro', nationality: 'Spain', birthYear: 1987, canonicalPosition: 'RW' },
  'eric-abidal': { name: 'Éric Abidal', commonName: 'Éric Abidal', nationality: 'France', birthYear: 1979, canonicalPosition: 'LB' },

  // Real Madrid 2012 & 2022
  'alvaro-arbeloa': { name: 'Álvaro Arbeloa Coca', commonName: 'Álvaro Arbeloa', nationality: 'Spain', birthYear: 1983, canonicalPosition: 'RB' },
  'sami-khedira': { name: 'Sami Khedira', commonName: 'Khedira', nationality: 'Germany', birthYear: 1987, canonicalPosition: 'CDM' },
  'eder-militao': { name: 'Éder Gabriel Militão', commonName: 'Éder Militão', nationality: 'Brazil', birthYear: 1998, canonicalPosition: 'CB' },
  'ferland-mendy': { name: 'Ferland Mendy', commonName: 'Ferland Mendy', nationality: 'France', birthYear: 1995, canonicalPosition: 'LB' },
  'federico-valverde': { name: 'Federico Santiago Valverde Dipetta', commonName: 'Fede Valverde', nationality: 'Uruguay', birthYear: 1998, canonicalPosition: 'CM' },
  'vinicius-junior': { name: 'Vinícius José Paixão de Oliveira Júnior', commonName: 'Vinícius Jr', nationality: 'Brazil', birthYear: 2000, canonicalPosition: 'LW' },

  // Manchester United 1994
  'paul-parker': { name: 'Paul Parker', commonName: 'Paul Parker', nationality: 'England', birthYear: 1964, canonicalPosition: 'RB' },
  'steve-bruce': { name: 'Steve Bruce', commonName: 'Steve Bruce', nationality: 'England', birthYear: 1960, canonicalPosition: 'CB' },
  'gary-pallister': { name: 'Gary Pallister', commonName: 'Gary Pallister', nationality: 'England', birthYear: 1965, canonicalPosition: 'CB' },
  'andrei-kanchelskis': { name: 'Andrei Kanchelskis', commonName: 'Andrei Kanchelskis', nationality: 'Russia', birthYear: 1969, canonicalPosition: 'RM' },
  'paul-ince': { name: 'Paul Ince', commonName: 'Paul Ince', nationality: 'England', birthYear: 1967, canonicalPosition: 'CM' },
  'eric-cantona': { name: 'Éric Daniel Pierre Cantona', commonName: 'Éric Cantona', nationality: 'France', birthYear: 1966, canonicalPosition: 'CF' },
  'mark-hughes': { name: 'Leslie Mark Hughes', commonName: 'Mark Hughes', nationality: 'Wales', birthYear: 1963, canonicalPosition: 'ST' },

  // Chelsea 2005, 2012, 2021
  'paulo-ferreira': { name: 'Paulo Ferreira', commonName: 'Paulo Ferreira', nationality: 'Portugal', birthYear: 1979, canonicalPosition: 'RB' },
  'william-gallas': { name: 'William Gallas', commonName: 'William Gallas', nationality: 'France', birthYear: 1977, canonicalPosition: 'CB' },
  'tiago-mendes': { name: 'Tiago Cardoso Mendes', commonName: 'Tiago', nationality: 'Portugal', birthYear: 1981, canonicalPosition: 'CM' },
  'damien-duff': { name: 'Damien Duff', commonName: 'Damien Duff', nationality: 'Ireland', birthYear: 1979, canonicalPosition: 'LW' },
  'jose-bosingwa': { name: 'José Bosingwa da Silva', commonName: 'Bosingwa', nationality: 'Portugal', birthYear: 1982, canonicalPosition: 'RB' },
  'gary-cahill': { name: 'Gary Cahill', commonName: 'Gary Cahill', nationality: 'England', birthYear: 1985, canonicalPosition: 'CB' },
  'john-obi-mikel': { name: 'John Obi Mikel', commonName: 'Mikel', nationality: 'Nigeria', birthYear: 1987, canonicalPosition: 'CDM' },
  'ramires': { name: 'Ramires Santos do Nascimento', commonName: 'Ramires', nationality: 'Brazil', birthYear: 1987, canonicalPosition: 'CM' },
  'juan-mata': { name: 'Juan Manuel Mata García', commonName: 'Juan Mata', nationality: 'Spain', birthYear: 1988, canonicalPosition: 'CAM' },
  'salomon-kalou': { name: 'Salomon Kalou', commonName: 'Salomon Kalou', nationality: 'Ivory Coast', birthYear: 1985, canonicalPosition: 'LW' },
  'edouard-mendy': { name: 'Édouard Mendy', commonName: 'Édouard Mendy', nationality: 'Senegal', birthYear: 1992, canonicalPosition: 'GK' },
  'antonio-rudiger': { name: 'Antonio Rüdiger', commonName: 'Rüdiger', nationality: 'Germany', birthYear: 1993, canonicalPosition: 'CB' },
  'reece-james': { name: 'Reece James', commonName: 'Reece James', nationality: 'England', birthYear: 1999, canonicalPosition: 'RB' },
  'ben-chilwell': { name: 'Benjamin Chilwell', commonName: 'Ben Chilwell', nationality: 'England', birthYear: 1996, canonicalPosition: 'LB' },
  'jorginho': { name: 'Jorge Luiz Frello Filho (Jorginho)', commonName: 'Jorginho', nationality: 'Italy', birthYear: 1991, canonicalPosition: 'CM' },
  'ngolo-kante': { name: "N'Golo Kanté", commonName: "Kanté", nationality: 'France', birthYear: 1991, canonicalPosition: 'CDM' },
  'mason-mount': { name: 'Mason Mount', commonName: 'Mason Mount', nationality: 'England', birthYear: 1999, canonicalPosition: 'CAM' },
  'kai-havertz': { name: 'Kai Havertz', commonName: 'Kai Havertz', nationality: 'Germany', birthYear: 1999, canonicalPosition: 'CF' },
  'timo-werner': { name: 'Timo Werner', commonName: 'Timo Werner', nationality: 'Germany', birthYear: 1996, canonicalPosition: 'ST' },

  // Liverpool 2005
  'jerzy-dudek': { name: 'Jerzy Dudek', commonName: 'Jerzy Dudek', nationality: 'Poland', birthYear: 1973, canonicalPosition: 'GK' },
  'steve-finnan': { name: 'Steve Finnan', commonName: 'Steve Finnan', nationality: 'Ireland', birthYear: 1976, canonicalPosition: 'RB' },
  'sami-hyypia': { name: 'Sami Hyypiä', commonName: 'Sami Hyypiä', nationality: 'Finland', birthYear: 1973, canonicalPosition: 'CB' },
  'djimi-traore': { name: 'Djimi Traoré', commonName: 'Djimi Traoré', nationality: 'Mali', birthYear: 1980, canonicalPosition: 'LB' },
  'dietmar-hamann': { name: 'Dietmar Hamann', commonName: 'Didi Hamann', nationality: 'Germany', birthYear: 1973, canonicalPosition: 'CDM' },
  'luis-garcia': { name: 'Luis Javier García Sanz', commonName: 'Luis García', nationality: 'Spain', birthYear: 1978, canonicalPosition: 'RW' },
  'john-arne-riise': { name: 'John Arne Riise', commonName: 'John Arne Riise', nationality: 'Norway', birthYear: 1980, canonicalPosition: 'LB' },
  'milan-baros': { name: 'Milan Baroš', commonName: 'Milan Baroš', nationality: 'Czech Republic', birthYear: 1981, canonicalPosition: 'ST' },

  // Manchester City 2018
  'fabian-delph': { name: 'Fabian Delph', commonName: 'Fabian Delph', nationality: 'England', birthYear: 1989, canonicalPosition: 'LB' },
  'fernandinho': { name: 'Fernando Luiz Roza (Fernandinho)', commonName: 'Fernandinho', nationality: 'Brazil', birthYear: 1985, canonicalPosition: 'CDM' },
  'leroy-sane': { name: 'Leroy Sané', commonName: 'Leroy Sané', nationality: 'Germany', birthYear: 1996, canonicalPosition: 'LW' },

  // Bayern Munich 2020 & 2001
  'alphonso-davies': { name: 'Alphonso Davies', commonName: 'Alphonso Davies', nationality: 'Canada', birthYear: 2000, canonicalPosition: 'LB' },
  'leon-goretzka': { name: 'Leon Goretzka', commonName: 'Goretzka', nationality: 'Germany', birthYear: 1995, canonicalPosition: 'CM' },
  'thiago-alcantara': { name: 'Thiago Alcântara do Nascimento', commonName: 'Thiago', nationality: 'Spain', birthYear: 1991, canonicalPosition: 'CM' },
  'serge-gnabry': { name: 'Serge Gnabry', commonName: 'Serge Gnabry', nationality: 'Germany', birthYear: 1995, canonicalPosition: 'RW' },
  'kingsley-coman': { name: 'Kingsley Coman', commonName: 'Coman', nationality: 'France', birthYear: 1996, canonicalPosition: 'LW' },
  'oliver-kahn': { name: 'Oliver Kahn', commonName: 'Oliver Kahn', nationality: 'Germany', birthYear: 1969, canonicalPosition: 'GK' },
  'willy-sagnol': { name: 'Willy Sagnol', commonName: 'Willy Sagnol', nationality: 'France', birthYear: 1977, canonicalPosition: 'RB' },
  'samuel-kuffour': { name: 'Samuel Osei Kuffour', commonName: 'Sammy Kuffour', nationality: 'Ghana', birthYear: 1976, canonicalPosition: 'CB' },
  'patrik-andersson': { name: 'Patrik Andersson', commonName: 'Patrik Andersson', nationality: 'Sweden', birthYear: 1971, canonicalPosition: 'CB' },
  'thomas-linke': { name: 'Thomas Linke', commonName: 'Thomas Linke', nationality: 'Germany', birthYear: 1969, canonicalPosition: 'CB' },
  'jens-jeremies': { name: 'Jens Jeremies', commonName: 'Jens Jeremies', nationality: 'Germany', birthYear: 1974, canonicalPosition: 'CDM' },
  'stefan-effenberg': { name: 'Stefan Effenberg', commonName: 'Stefan Effenberg', nationality: 'Germany', birthYear: 1968, canonicalPosition: 'CM' },
  'mehmet-scholl': { name: 'Mehmet Scholl', commonName: 'Mehmet Scholl', nationality: 'Germany', birthYear: 1970, canonicalPosition: 'CAM' },
  'giovane-elber': { name: 'Giovane Élber de Souza', commonName: 'Giovane Élber', nationality: 'Brazil', birthYear: 1972, canonicalPosition: 'ST' },
  'carsten-jancker': { name: 'Carsten Jancker', commonName: 'Carsten Jancker', nationality: 'Germany', birthYear: 1974, canonicalPosition: 'ST' },

  // Borussia Dortmund 2013
  'roman-weidenfeller': { name: 'Roman Weidenfeller', commonName: 'Weidenfeller', nationality: 'Germany', birthYear: 1980, canonicalPosition: 'GK' },
  'lukasz-piszczek': { name: 'Łukasz Piszczek', commonName: 'Piszczek', nationality: 'Poland', birthYear: 1985, canonicalPosition: 'RB' },
  'neven-subotic': { name: 'Neven Subotić', commonName: 'Subotić', nationality: 'Serbia', birthYear: 1988, canonicalPosition: 'CB' },
  'marcel-schmelzer': { name: 'Marcel Schmelzer', commonName: 'Schmelzer', nationality: 'Germany', birthYear: 1988, canonicalPosition: 'LB' },
  'sven-bender': { name: 'Sven Bender', commonName: 'Sven Bender', nationality: 'Germany', birthYear: 1989, canonicalPosition: 'CDM' },
  'jakub-blaszczykowski': { name: 'Jakub Błaszczykowski', commonName: 'Kuba', nationality: 'Poland', birthYear: 1985, canonicalPosition: 'RM' },
  'mario-gotze': { name: 'Mario Götze', commonName: 'Götze', nationality: 'Germany', birthYear: 1992, canonicalPosition: 'CAM' },
  'marco-reus': { name: 'Marco Reus', commonName: 'Reus', nationality: 'Germany', birthYear: 1989, canonicalPosition: 'LW' },

  // Bayer Leverkusen 2024
  'lukas-hradecky': { name: 'Lukáš Hrádecký', commonName: 'Hrádecký', nationality: 'Finland', birthYear: 1989, canonicalPosition: 'GK' },
  'odilon-kossounou': { name: 'Odilon Kossounou', commonName: 'Kossounou', nationality: 'Ivory Coast', birthYear: 2001, canonicalPosition: 'CB' },
  'jonathan-tah': { name: 'Jonathan Glao Tah', commonName: 'Tah', nationality: 'Germany', birthYear: 1996, canonicalPosition: 'CB' },
  'edmond-tapsoba': { name: 'Edmond Fayçal Tapsoba', commonName: 'Tapsoba', nationality: 'Burkina Faso', birthYear: 1999, canonicalPosition: 'CB' },
  'jeremie-frimpong': { name: 'Jeremie Agyekum Frimpong', commonName: 'Frimpong', nationality: 'Netherlands', birthYear: 2000, canonicalPosition: 'RWB' },
  'alejandro-grimaldo': { name: 'Alejandro Grimaldo García', commonName: 'Grimaldo', nationality: 'Spain', birthYear: 1995, canonicalPosition: 'LWB' },
  'granit-xhaka': { name: 'Granit Xhaka', commonName: 'Xhaka', nationality: 'Switzerland', birthYear: 1992, canonicalPosition: 'CM' },
  'exequiel-palacios': { name: 'Exequiel Alejandro Palacios', commonName: 'Palacios', nationality: 'Argentina', birthYear: 1998, canonicalPosition: 'CM' },
  'florian-wirtz': { name: 'Florian Richard Wirtz', commonName: 'Wirtz', nationality: 'Germany', birthYear: 2003, canonicalPosition: 'CAM' },
  'jonas-hofmann': { name: 'Jonas Hofmann', commonName: 'Hofmann', nationality: 'Germany', birthYear: 1992, canonicalPosition: 'CAM' },
  'victor-boniface': { name: 'Victor Okoh Boniface', commonName: 'Boniface', nationality: 'Nigeria', birthYear: 2000, canonicalPosition: 'ST' },

  // AC Milan 2005 & 1994
  'sebastiano-rossi': { name: 'Sebastiano Rossi', commonName: 'Sebastiano Rossi', nationality: 'Italy', birthYear: 1964, canonicalPosition: 'GK' },
  'filippo-galli': { name: 'Filippo Galli', commonName: 'Filippo Galli', nationality: 'Italy', birthYear: 1963, canonicalPosition: 'CB' },
  'christian-panucci': { name: 'Christian Panucci', commonName: 'Panucci', nationality: 'Italy', birthYear: 1973, canonicalPosition: 'RB' },
  'demetrio-albertini': { name: 'Demetrio Albertini', commonName: 'Albertini', nationality: 'Italy', birthYear: 1971, canonicalPosition: 'CM' },
  'zvonimir-boban': { name: 'Zvonimir Boban', commonName: 'Boban', nationality: 'Croatia', birthYear: 1968, canonicalPosition: 'CAM' },
  'dejan-savicevic': { name: 'Dejan Savićević', commonName: 'Savićević', nationality: 'Montenegro', birthYear: 1966, canonicalPosition: 'CAM' },
  'daniele-massaro': { name: 'Daniele Massaro', commonName: 'Massaro', nationality: 'Italy', birthYear: 1961, canonicalPosition: 'ST' },
  'andriy-shevchenko': { name: 'Andriy Mykolayovych Shevchenko', commonName: 'Shevchenko', nationality: 'Ukraine', birthYear: 1976, canonicalPosition: 'ST' },
  'hernan-crespo': { name: 'Hernán Jorge Crespo', commonName: 'Crespo', nationality: 'Argentina', birthYear: 1975, canonicalPosition: 'ST' },

  // Inter Milan 1998
  'salvatore-fresi': { name: 'Salvatore Fresi', commonName: 'Fresi', nationality: 'Italy', birthYear: 1973, canonicalPosition: 'CB' },
  'francesco-colonnese': { name: 'Francesco Colonnese', commonName: 'Colonnese', nationality: 'Italy', birthYear: 1971, canonicalPosition: 'CB' },
  'taribo-west': { name: 'Taribo West', commonName: 'Taribo West', nationality: 'Nigeria', birthYear: 1974, canonicalPosition: 'CB' },
  'aron-winter': { name: 'Aron Mohamed Winter', commonName: 'Aron Winter', nationality: 'Netherlands', birthYear: 1967, canonicalPosition: 'CM' },
  'youri-djorkaeff': { name: 'Youri Raffi Djorkaeff', commonName: 'Djorkaeff', nationality: 'France', birthYear: 1968, canonicalPosition: 'CAM' },
  'ivan-zamorano': { name: 'Iván Luis Zamorano Zamora', commonName: 'Zamorano', nationality: 'Chile', birthYear: 1967, canonicalPosition: 'ST' },

  // Juventus 2015
  'stephan-lichtsteiner': { name: 'Stephan Lichtsteiner', commonName: 'Lichtsteiner', nationality: 'Switzerland', birthYear: 1984, canonicalPosition: 'RB' },
  'claudio-marchisio': { name: 'Claudio Marchisio', commonName: 'Marchisio', nationality: 'Italy', birthYear: 1986, canonicalPosition: 'CM' },
  'paul-pogba': { name: 'Paul Lile Pogba', commonName: 'Pogba', nationality: 'France', birthYear: 1993, canonicalPosition: 'CM' },
  'arturo-vidal': { name: 'Arturo Erasmo Vidal Pardo', commonName: 'Vidal', nationality: 'Chile', birthYear: 1987, canonicalPosition: 'CM' },
  'alvaro-morata': { name: 'Álvaro Borja Morata Martín', commonName: 'Morata', nationality: 'Spain', birthYear: 1992, canonicalPosition: 'ST' },
  'carlos-tevez': { name: 'Carlos Alberto Tévez', commonName: 'Tévez', nationality: 'Argentina', birthYear: 1984, canonicalPosition: 'ST' },

  // AS Roma 2001
  'francesco-antonioli': { name: 'Francesco Antonioli', commonName: 'Antonioli', nationality: 'Italy', birthYear: 1969, canonicalPosition: 'GK' },
  'jonathan-zebina': { name: 'Jonathan Zebina', commonName: 'Zebina', nationality: 'France', birthYear: 1978, canonicalPosition: 'CB' },
  'antonio-carlos-zago': { name: 'Antônio Carlos Zago', commonName: 'Zago', nationality: 'Brazil', birthYear: 1969, canonicalPosition: 'CB' },
  'vincent-candela': { name: 'Vincent Candela', commonName: 'Candela', nationality: 'France', birthYear: 1973, canonicalPosition: 'LB' },
  'damiano-tommasi': { name: 'Damiano Tommasi', commonName: 'Tommasi', nationality: 'Italy', birthYear: 1974, canonicalPosition: 'CM' },
  'gabriel-batistuta': { name: 'Gabriel Omar Batistuta', commonName: 'Batistuta', nationality: 'Argentina', birthYear: 1969, canonicalPosition: 'ST' },
  'vincenzo-montella': { name: 'Vincenzo Montella', commonName: 'Montella', nationality: 'Italy', birthYear: 1974, canonicalPosition: 'ST' },

  // Parma 1999
  'roberto-sensini': { name: 'Roberto Néstor Sensini', commonName: 'Sensini', nationality: 'Argentina', birthYear: 1966, canonicalPosition: 'CB' },
  'diego-fuser': { name: 'Diego Fuser', commonName: 'Fuser', nationality: 'Italy', birthYear: 1968, canonicalPosition: 'RM' },
  'paolo-vanoli': { name: 'Paolo Vanoli', commonName: 'Vanoli', nationality: 'Italy', birthYear: 1972, canonicalPosition: 'LB' },
  'alain-boghossian': { name: 'Alain Boghossian', commonName: 'Boghossian', nationality: 'France', birthYear: 1970, canonicalPosition: 'CM' },
  'juan-sebastian-veron': { name: 'Juan Sebastián Verón', commonName: 'Verón', nationality: 'Argentina', birthYear: 1975, canonicalPosition: 'CAM' },
  'enrico-chiesa': { name: 'Enrico Chiesa', commonName: 'Chiesa', nationality: 'Italy', birthYear: 1970, canonicalPosition: 'ST' },

  // PSG 2020
  'thilo-kehrer': { name: 'Thilo Kehrer', commonName: 'Kehrer', nationality: 'Germany', birthYear: 1996, canonicalPosition: 'RB' },
  'presnel-kimpembe': { name: 'Presnel Kimpembe', commonName: 'Kimpembe', nationality: 'France', birthYear: 1995, canonicalPosition: 'CB' },
  'juan-bernat': { name: 'Juan Bernat Velasco', commonName: 'Bernat', nationality: 'Spain', birthYear: 1993, canonicalPosition: 'LB' },
  'marquinhos': { name: 'Marcos Aoás Corrêa (Marquinhos)', commonName: 'Marquinhos', nationality: 'Brazil', birthYear: 1994, canonicalPosition: 'CB' },
  'marco-verratti': { name: 'Marco Verratti', commonName: 'Verratti', nationality: 'Italy', birthYear: 1992, canonicalPosition: 'CM' },
  'leandro-paredes': { name: 'Leandro Daniel Paredes', commonName: 'Paredes', nationality: 'Argentina', birthYear: 1994, canonicalPosition: 'CM' },
  'kylian-mbappe': { name: 'Kylian Mbappé Lottin', commonName: 'Mbappé', nationality: 'France', birthYear: 1998, canonicalPosition: 'ST' },

  // Atlético Madrid 2014
  'juanfran': { name: 'Juan Francisco Torres Belén (Juanfran)', commonName: 'Juanfran', nationality: 'Spain', birthYear: 1985, canonicalPosition: 'RB' },
  'joao-miranda': { name: 'João Miranda de Souza Filho', commonName: 'Miranda', nationality: 'Brazil', birthYear: 1984, canonicalPosition: 'CB' },
  'diego-godin': { name: 'Diego Roberto Godín Leal', commonName: 'Diego Godín', nationality: 'Uruguay', birthYear: 1986, canonicalPosition: 'CB' },
  'filipe-luis': { name: 'Filipe Luís Kasmirski', commonName: 'Filipe Luís', nationality: 'Brazil', birthYear: 1985, canonicalPosition: 'LB' },
  'gabi': { name: 'Gabriel Fernández Arenas (Gabi)', commonName: 'Gabi', nationality: 'Spain', birthYear: 1983, canonicalPosition: 'CDM' },
  'koke': { name: 'Jorge Resurrección Merodio (Koke)', commonName: 'Koke', nationality: 'Spain', birthYear: 1992, canonicalPosition: 'CM' },
  'arda-turan': { name: 'Arda Turan', commonName: 'Arda Turan', nationality: 'Turkey', birthYear: 1987, canonicalPosition: 'RM' },
  'diego-costa': { name: 'Diego da Silva Costa', commonName: 'Diego Costa', nationality: 'Spain', birthYear: 1988, canonicalPosition: 'ST' },

  // Additional Superstars
  'rafael-marquez': { name: 'Rafael Márquez Álvarez', commonName: 'Rafa Márquez', nationality: 'Mexico', birthYear: 1979, canonicalPosition: 'CB' },
  'giovanni-van-bronckhorst': { name: 'Giovanni Christiaan van Bronckhorst', commonName: 'Van Bronckhorst', nationality: 'Netherlands', birthYear: 1975, canonicalPosition: 'LB' },
  'deco': { name: 'Anderson Luís de Souza (Deco)', commonName: 'Deco', nationality: 'Portugal', birthYear: 1977, canonicalPosition: 'CAM' },
  'mesut-ozil': { name: 'Mesut Özil', commonName: 'Özil', nationality: 'Germany', birthYear: 1988, canonicalPosition: 'CAM' },
  'thibaut-courtois': { name: 'Thibaut Nicolas Marc Courtois', commonName: 'Thibaut Courtois', nationality: 'Belgium', birthYear: 1992, canonicalPosition: 'GK' },
  'petr-cech': { name: 'Petr Čech', commonName: 'Petr Čech', nationality: 'Czech Republic', birthYear: 1982, canonicalPosition: 'GK' },
  'john-terry': { name: 'John George Terry', commonName: 'John Terry', nationality: 'England', birthYear: 1980, canonicalPosition: 'CB' },
  'ricardo-carvalho': { name: 'Ricardo Alberto Silveira de Carvalho', commonName: 'Ricardo Carvalho', nationality: 'Portugal', birthYear: 1978, canonicalPosition: 'CB' },
  'frank-lampard': { name: 'Frank James Lampard', commonName: 'Frank Lampard', nationality: 'England', birthYear: 1978, canonicalPosition: 'CM' },
  'didier-drogba': { name: 'Didier Yves Drogba Tébily', commonName: 'Didier Drogba', nationality: 'Ivory Coast', birthYear: 1978, canonicalPosition: 'ST' },
  'david-luiz': { name: 'David Luiz Moreira Marinho', commonName: 'David Luiz', nationality: 'Brazil', birthYear: 1987, canonicalPosition: 'CB' },
  'cesar-azpilicueta': { name: 'César Azpilicueta Tanco', commonName: 'Azpilicueta', nationality: 'Spain', birthYear: 1989, canonicalPosition: 'RB' },
  'thiago-silva': { name: 'Thiago Emiliano da Silva', commonName: 'Thiago Silva', nationality: 'Brazil', birthYear: 1984, canonicalPosition: 'CB' },
  'jamie-carragher': { name: 'James Lee Duncan Carragher', commonName: 'Jamie Carragher', nationality: 'England', birthYear: 1978, canonicalPosition: 'CB' },
  'steven-gerrard': { name: 'Steven George Gerrard', commonName: 'Steven Gerrard', nationality: 'England', birthYear: 1980, canonicalPosition: 'CM' },
  'vincent-kompany': { name: 'Vincent Jean Mpoy Kompany', commonName: 'Vincent Kompany', nationality: 'Belgium', birthYear: 1986, canonicalPosition: 'CB' },
  'david-silva': { name: 'David Josué Jiménez Silva', commonName: 'David Silva', nationality: 'Spain', birthYear: 1986, canonicalPosition: 'CAM' },
  'raheem-sterling': { name: 'Raheem Shaquille Sterling', commonName: 'Raheem Sterling', nationality: 'England', birthYear: 1994, canonicalPosition: 'RW' },
  'sergio-aguero': { name: 'Sergio Leonel Agüero del Castillo', commonName: 'Sergio Agüero', nationality: 'Argentina', birthYear: 1988, canonicalPosition: 'ST' },
  'joshua-kimmich': { name: 'Joshua Walter Kimmich', commonName: 'Joshua Kimmich', nationality: 'Germany', birthYear: 1995, canonicalPosition: 'RB' },
  'robert-lewandowski': { name: 'Robert Lewandowski', commonName: 'Lewandowski', nationality: 'Poland', birthYear: 1988, canonicalPosition: 'ST' },
  'gianluca-pagliuca': { name: 'Gianluca Pagliuca', commonName: 'Pagliuca', nationality: 'Italy', birthYear: 1966, canonicalPosition: 'GK' },
  'giuseppe-bergomi': { name: 'Giuseppe Bergomi', commonName: 'Bergomi', nationality: 'Italy', birthYear: 1963, canonicalPosition: 'CB' },
  'diego-simeone': { name: 'Diego Pablo Simeone González', commonName: 'Diego Simeone', nationality: 'Argentina', birthYear: 1970, canonicalPosition: 'CM' },
  'leonardo-bonucci': { name: 'Leonardo Bonucci', commonName: 'Bonucci', nationality: 'Italy', birthYear: 1987, canonicalPosition: 'CB' },
  'giorgio-chiellini': { name: 'Giorgio Chiellini', commonName: 'Chiellini', nationality: 'Italy', birthYear: 1984, canonicalPosition: 'CB' },
  'emerson': { name: 'Emerson Ferreira da Rosa', commonName: 'Emerson', nationality: 'Brazil', birthYear: 1976, canonicalPosition: 'CM' },
  'dino-baggio': { name: 'Dino Baggio', commonName: 'Dino Baggio', nationality: 'Italy', birthYear: 1971, canonicalPosition: 'CM' },
};

// Merged dictionary
const benchPlayerMap = new Map<string, any>(
  [...benchPart1, ...benchPart2, ...benchPart3, ...benchPart4].map((b) => [b.identityId, b])
);

const identityRegistry: Record<string, Omit<IdentityDef, 'id'>> = {
  ...baseIdentityRegistry,
  ...expansionIdentities,
};

// 1. Process and update identities
const existingIdSet = new Set(existingIdentities.map((i) => i.id));
const updatedIdentities = [...existingIdentities];

for (const player of allNewPlayerDefs) {
  if (!existingIdSet.has(player.identityId)) {
    const reg = identityRegistry[player.identityId] || benchPlayerMap.get(player.identityId);
    if (reg) {
      const newIdentity: IdentityDef = {
        id: player.identityId,
        name: reg.name,
        commonName: reg.commonName,
        nationality: reg.nationality,
        birthYear: reg.birthYear,
        canonicalPosition: reg.canonicalPosition as any,
      };
      updatedIdentities.push(newIdentity);
      existingIdSet.add(player.identityId);
      console.log(`Added new identity: ${player.identityId}`);
    } else {
      console.error(`WARNING: No registry entry found for identity: ${player.identityId}`);
    }
  }
}

// 2. Assemble new club editions
const finalClubEditions = [
  ...keptClubEditions,
  ...newClubEditions,
  ...expansionClubEditions,
];

// 3. Assemble new club players (deduplicating by player ID)
const newClubPlayersFormatted = allNewPlayerDefs.map(toPlayerVersion);
const playerMap = new Map<string, any>();
for (const p of keptClubPlayers) {
  playerMap.set(p.id, p);
}
for (const p of newClubPlayersFormatted) {
  playerMap.set(p.id, p);
}
const finalClubPlayers = Array.from(playerMap.values());

console.log(`Total Modern Club Editions: ${finalClubEditions.length}`);
console.log(`Total Modern Club Players: ${finalClubPlayers.length}`);
console.log(`Total Identities: ${updatedIdentities.length}`);

// Write files
fs.writeFileSync(
  path.join(DATA_DIR, 'editions_club.json'),
  JSON.stringify(finalClubEditions, null, 2),
  'utf-8'
);
fs.writeFileSync(
  path.join(DATA_DIR, 'players_club.json'),
  JSON.stringify(finalClubPlayers, null, 2),
  'utf-8'
);
fs.writeFileSync(
  path.join(DATA_DIR, 'identities.json'),
  JSON.stringify(updatedIdentities, null, 2),
  'utf-8'
);

console.log('Successfully written datasets to disk!');
