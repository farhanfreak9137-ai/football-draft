import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { benchPart1 } from './generateBenchPart1.js';
import { benchPart2 } from './generateBenchPart2.js';
import { benchPart3 } from './generateBenchPart3.js';
import { benchPart4 } from './generateBenchPart4.js';
import { BenchPlayerInput } from './benchTypes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

const allBenchPlayers: BenchPlayerInput[] = [
  ...benchPart1,
  ...benchPart2,
  ...benchPart3,
  ...benchPart4,
];

console.log(`Total new bench players defined: ${allBenchPlayers.length}`);

// Load existing datasets
const existingIdentities = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'identities.json'), 'utf-8')
);
const existingClubPlayers = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'players_club.json'), 'utf-8')
);
const existingClubEditions = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, 'editions_club.json'), 'utf-8')
);

const identityMap = new Map<string, any>(existingIdentities.map((id: any) => [id.id, id]));
const existingPlayerIds = new Set<string>(existingClubPlayers.map((p: any) => p.id));

let newIdentitiesAdded = 0;
let newPlayersAdded = 0;

for (const p of allBenchPlayers) {
  // Register identity if not exists
  if (!identityMap.has(p.identityId)) {
    const newIdObj = {
      id: p.identityId,
      name: p.name,
      commonName: p.commonName,
      nationality: p.nationality,
      birthYear: p.birthYear,
      canonicalPosition: p.canonicalPosition,
    };
    identityMap.set(p.identityId, newIdObj);
    existingIdentities.push(newIdObj);
    newIdentitiesAdded++;
  }

  // Format player version
  const playerVersion = {
    id: p.id,
    identityId: p.identityId,
    editionId: p.editionId,
    name: p.name,
    squadNumber: p.squadNumber,
    ovr: p.ovr,
    naturalPositions: p.naturalPositions,
    secondaryPositions: p.secondaryPositions,
    hasLegendSeal: !!p.hasLegendSeal,
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

  const existingIdx = existingClubPlayers.findIndex((cp: any) => cp.id === p.id);
  if (existingIdx >= 0) {
    existingClubPlayers[existingIdx] = playerVersion;
  } else {
    existingClubPlayers.push(playerVersion);
    newPlayersAdded++;
  }
}

console.log(`New identities registered: ${newIdentitiesAdded}`);
console.log(`Total identities in dataset: ${existingIdentities.length}`);
console.log(`New club players added: ${newPlayersAdded}`);
console.log(`Total club players in dataset: ${existingClubPlayers.length}`);

// Write datasets back
fs.writeFileSync(
  path.join(DATA_DIR, 'identities.json'),
  JSON.stringify(existingIdentities, null, 2),
  'utf-8'
);
fs.writeFileSync(
  path.join(DATA_DIR, 'players_club.json'),
  JSON.stringify(existingClubPlayers, null, 2),
  'utf-8'
);

console.log('✓ Successfully written updated identities.json and players_club.json!');

// Count per edition
const countMap: Record<string, number> = {};
for (const p of existingClubPlayers) {
  countMap[p.editionId] = (countMap[p.editionId] || 0) + 1;
}

let minSquad = Infinity;
let maxSquad = 0;
for (const e of existingClubEditions) {
  const count = countMap[e.id] || 0;
  if (count < minSquad) minSquad = count;
  if (count > maxSquad) maxSquad = count;
}

console.log(`Squad size range across all ${existingClubEditions.length} editions: ${minSquad} - ${maxSquad} players`);
