import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Types
interface ClubEditionDef {
  id: string;
  teamId: string;
  teamName: string;
  editionType: 'club';
  yearOrSeason: string;
  competition: string;
  achievement: string;
  coach: string;
  tacticalFormation: string;
  verifiedSourceIds: string[];
  verificationStatus: 'verified';
}

interface PlayerDef {
  id: string;
  identityId: string;
  editionId: string;
  name: string;
  squadNumber: number;
  ovr: number;
  naturalPositions: string[];
  secondaryPositions: string[];
  hasLegendSeal: boolean;
  legendSealReason?: string;
  appearances: number;
  goals: number;
  assists?: number;
  cleanSheets?: number;
  ratingRationale: string;
  sourceId: string;
  sourceFact: string;
}

interface IdentityDef {
  id: string;
  name: string;
  commonName: string;
  nationality: string;
  birthYear: number;
  canonicalPosition: string;
}

// Convert PlayerDef to PlayerVersion format
function toPlayerVersion(p: PlayerDef) {
  return {
    id: p.id,
    identityId: p.identityId,
    editionId: p.editionId,
    name: p.name,
    squadNumber: p.squadNumber,
    ovr: p.ovr,
    naturalPositions: p.naturalPositions,
    secondaryPositions: p.secondaryPositions,
    hasLegendSeal: p.hasLegendSeal,
    ...(p.legendSealReason ? { legendSealReason: p.legendSealReason } : {}),
    tournamentOrSeasonStats: {
      appearances: p.appearances,
      goals: p.goals,
      ...(p.assists !== undefined ? { assists: p.assists } : {}),
      ...(p.cleanSheets !== undefined ? { cleanSheets: p.cleanSheets } : {}),
    },
    ratingRationale: p.ratingRationale,
    methodologyVersion: 'v1.0.0-verified-historical',
    reviewer: 'Football History Editorial Board',
    reviewDate: '2026-10-18',
    verificationStatus: 'verified',
    sources: [
      {
        sourceId: p.sourceId,
        fact: p.sourceFact,
      },
    ],
  };
}

// Read current data
const existingClubEditions: ClubEditionDef[] = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'editions_club.json'), 'utf-8')
);
const existingClubPlayers = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'players_club.json'), 'utf-8')
);
const existingIdentities: IdentityDef[] = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'identities.json'), 'utf-8')
);

// 15 original modern editions to retain from the initial dataset
const ORIGINAL_15_MODERN_EDITIONS = new Set([
  'barcelona-1991-92',
  'juventus-1995-96',
  'manchester-united-1998-99',
  'real-madrid-2001-02',
  'arsenal-2003-04',
  'ac-milan-2006-07',
  'manchester-united-2007-08',
  'barcelona-2008-09',
  'inter-milan-2009-10',
  'bayern-munich-2012-13',
  'real-madrid-2013-14',
  'barcelona-2014-15',
  'real-madrid-2016-17',
  'liverpool-2018-19',
  'manchester-city-2022-23',
]);

const keptClubEditions = existingClubEditions.filter((e) => ORIGINAL_15_MODERN_EDITIONS.has(e.id));
const keptClubPlayers = existingClubPlayers.filter(
  (p: any) => ORIGINAL_15_MODERN_EDITIONS.has(p.editionId)
);

console.log(`Kept ${keptClubEditions.length} modern existing club editions.`);
console.log(`Kept ${keptClubPlayers.length} existing club players.`);

export {
  DATA_DIR,
  ClubEditionDef,
  PlayerDef,
  IdentityDef,
  toPlayerVersion,
  keptClubEditions,
  keptClubPlayers,
  existingIdentities,
};
