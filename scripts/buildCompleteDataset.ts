import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

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

// Function to convert PlayerDef to PlayerVersion format
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

// Read existing datasets
const existingIdentities: IdentityDef[] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'identities.json'), 'utf-8'));
const existingNatPlayers = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_national.json'), 'utf-8'));
const existingClubPlayers = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_club.json'), 'utf-8'));

console.log(`Loaded ${existingIdentities.length} existing identities.`);

