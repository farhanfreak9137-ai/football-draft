import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PlayerIdentitySchema,
  TeamEditionSchema,
  PlayerVersionSchema,
  SourceRecordSchema,
} from '../src/shared/schemas/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

interface ValidationReport {
  timestamp: string;
  summary: {
    totalIdentities: number;
    totalNationalEditions: number;
    totalClubEditions: number;
    totalNationalPlayers: number;
    totalClubPlayers: number;
    totalSources: number;
    totalErrors: number;
    status: 'PASSED' | 'FAILED';
  };
  acceptedRecords: {
    identities: number;
    editions: number;
    playerVersions: number;
    sources: number;
  };
  rejectedRecords: Array<{ recordId: string; type: string; errors: string[] }>;
  incompleteRecords: Array<{ recordId: string; type: string; reason: string }>;
  duplicateCandidates: Array<{ id: string; type: string; details: string }>;
  conflictingEvidence: Array<{ recordId: string; issue: string }>;
  missingSourceInformation: Array<{ recordId: string; missingSourceId: string }>;
  licenseConcerns: Array<{ sourceId: string; notes: string }>;
}

export function validateAllData(): ValidationReport {
  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIdentities: 0,
      totalNationalEditions: 0,
      totalClubEditions: 0,
      totalNationalPlayers: 0,
      totalClubPlayers: 0,
      totalSources: 0,
      totalErrors: 0,
      status: 'PASSED',
    },
    acceptedRecords: {
      identities: 0,
      editions: 0,
      playerVersions: 0,
      sources: 0,
    },
    rejectedRecords: [],
    incompleteRecords: [],
    duplicateCandidates: [],
    conflictingEvidence: [],
    missingSourceInformation: [],
    licenseConcerns: [],
  };

  // 1. Sources
  const sourcesRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sources.json'), 'utf-8'));
  report.summary.totalSources = sourcesRaw.length;
  const sourceIds = new Set<string>();

  for (const s of sourcesRaw) {
    const res = SourceRecordSchema.safeParse(s);
    if (!res.success) {
      report.rejectedRecords.push({
        recordId: s.id || 'unknown',
        type: 'SourceRecord',
        errors: res.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      });
    } else {
      if (sourceIds.has(s.id)) {
        report.duplicateCandidates.push({ id: s.id, type: 'SourceRecord', details: 'Duplicate source ID found' });
      } else {
        sourceIds.add(s.id);
        report.acceptedRecords.sources++;
      }
    }
    if (s.licenseNotes && s.licenseNotes.toLowerCase().includes('restrictive')) {
      report.licenseConcerns.push({ sourceId: s.id, notes: s.licenseNotes });
    }
  }

  // 2. Identities
  const identitiesRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'identities.json'), 'utf-8'));
  report.summary.totalIdentities = identitiesRaw.length;
  const identityIds = new Set<string>();

  for (const idObj of identitiesRaw) {
    const res = PlayerIdentitySchema.safeParse(idObj);
    if (!res.success) {
      report.rejectedRecords.push({
        recordId: idObj.id || 'unknown',
        type: 'PlayerIdentity',
        errors: res.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      });
    } else {
      if (identityIds.has(idObj.id)) {
        report.duplicateCandidates.push({ id: idObj.id, type: 'PlayerIdentity', details: 'Duplicate identity ID found' });
      } else {
        identityIds.add(idObj.id);
        report.acceptedRecords.identities++;
      }
    }
  }

  // 3. Editions (National & Club)
  const natEditionsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'editions_national.json'), 'utf-8'));
  const clubEditionsRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'editions_club.json'), 'utf-8'));
  report.summary.totalNationalEditions = natEditionsRaw.length;
  report.summary.totalClubEditions = clubEditionsRaw.length;

  const editionIds = new Set<string>();
  const allEditions = [...natEditionsRaw, ...clubEditionsRaw];

  for (const ed of allEditions) {
    const res = TeamEditionSchema.safeParse(ed);
    if (!res.success) {
      report.rejectedRecords.push({
        recordId: ed.id || 'unknown',
        type: 'TeamEdition',
        errors: res.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      });
    } else {
      if (editionIds.has(ed.id)) {
        report.duplicateCandidates.push({ id: ed.id, type: 'TeamEdition', details: 'Duplicate edition ID found' });
      } else {
        editionIds.add(ed.id);
        report.acceptedRecords.editions++;
      }
    }

    // Check sources
    for (const sid of ed.verifiedSourceIds || []) {
      if (!sourceIds.has(sid)) {
        report.missingSourceInformation.push({ recordId: ed.id, missingSourceId: sid });
      }
    }
  }

  // 4. Players (National & Club)
  const natPlayersRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_national.json'), 'utf-8'));
  const clubPlayersRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_club.json'), 'utf-8'));
  report.summary.totalNationalPlayers = natPlayersRaw.length;
  report.summary.totalClubPlayers = clubPlayersRaw.length;

  const playerVersionIds = new Set<string>();
  const allPlayers = [...natPlayersRaw, ...clubPlayersRaw];

  for (const p of allPlayers) {
    const res = PlayerVersionSchema.safeParse(p);
    if (!res.success) {
      report.rejectedRecords.push({
        recordId: p.id || 'unknown',
        type: 'PlayerVersion',
        errors: res.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
      });
    } else {
      if (playerVersionIds.has(p.id)) {
        report.duplicateCandidates.push({ id: p.id, type: 'PlayerVersion', details: 'Duplicate player version ID found' });
      } else {
        playerVersionIds.add(p.id);
        report.acceptedRecords.playerVersions++;
      }
    }

    // Verify identity exists
    if (!identityIds.has(p.identityId)) {
      report.incompleteRecords.push({
        recordId: p.id,
        type: 'PlayerVersion',
        reason: `Identity ID ${p.identityId} not found in identities.json`,
      });
    }

    // Verify edition exists
    if (!editionIds.has(p.editionId)) {
      report.incompleteRecords.push({
        recordId: p.id,
        type: 'PlayerVersion',
        reason: `Edition ID ${p.editionId} not found in editions tables`,
      });
    }

    // Verify sources exist
    for (const src of p.sources || []) {
      if (!sourceIds.has(src.sourceId)) {
        report.missingSourceInformation.push({ recordId: p.id, missingSourceId: src.sourceId });
      }
    }

    // Legend Seal validation: must have legendSealReason if true
    if (p.hasLegendSeal && (!p.legendSealReason || p.legendSealReason.trim().length === 0)) {
      report.conflictingEvidence.push({
        recordId: p.id,
        issue: 'Player has legend seal marked true but has no documented reason.',
      });
    }
  }

  // Roster completeness check (at least 11 players per edition)
  for (const edId of editionIds) {
    const count = allPlayers.filter((p) => p.editionId === edId).length;
    if (count < 11) {
      report.incompleteRecords.push({
        recordId: edId,
        type: 'TeamEdition',
        reason: `Edition has only ${count} players (minimum 11 required for full XI draft)`,
      });
    }
  }

  const totalIssues =
    report.rejectedRecords.length +
    report.incompleteRecords.length +
    report.duplicateCandidates.length +
    report.missingSourceInformation.length +
    report.conflictingEvidence.length;

  report.summary.totalErrors = totalIssues;
  report.summary.status = totalIssues === 0 ? 'PASSED' : 'FAILED';

  return report;
}

// When run directly from CLI
const report = validateAllData();
console.log('================ DATA VALIDATION REPORT ================');
console.log(`Status: ${report.summary.status}`);
console.log(`Total Errors / Issues: ${report.summary.totalErrors}`);
console.log(`Accepted Records:`);
console.log(`  Identities: ${report.acceptedRecords.identities} / ${report.summary.totalIdentities}`);
console.log(`  Editions: ${report.acceptedRecords.editions} (${report.summary.totalNationalEditions} National, ${report.summary.totalClubEditions} Club)`);
console.log(`  Player Versions: ${report.acceptedRecords.playerVersions} (${report.summary.totalNationalPlayers} National, ${report.summary.totalClubPlayers} Club)`);
console.log(`  Sources: ${report.acceptedRecords.sources} / ${report.summary.totalSources}`);

if (report.rejectedRecords.length > 0) {
  console.error('\nRejected Records:');
  console.error(JSON.stringify(report.rejectedRecords, null, 2));
}
if (report.incompleteRecords.length > 0) {
  console.error('\nIncomplete Records:');
  console.error(JSON.stringify(report.incompleteRecords, null, 2));
}
if (report.duplicateCandidates.length > 0) {
  console.error('\nDuplicate Candidates:');
  console.error(JSON.stringify(report.duplicateCandidates, null, 2));
}
if (report.missingSourceInformation.length > 0) {
  console.error('\nMissing Source Information:');
  console.error(JSON.stringify(report.missingSourceInformation, null, 2));
}
if (report.conflictingEvidence.length > 0) {
  console.error('\nConflicting Evidence:');
  console.error(JSON.stringify(report.conflictingEvidence, null, 2));
}

// Write report to docs
fs.writeFileSync(path.join(__dirname, '../docs/validation_report.json'), JSON.stringify(report, null, 2), 'utf-8');

if (report.summary.status === 'FAILED') {
  process.exit(1);
} else {
  console.log('\nAll data records strictly passed schema and relational validation!');
}

