import fs from 'fs';
import path from 'path';

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  // Parse header
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = vals[j] || '';
    }
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const dir = path.resolve(process.cwd(), 'data/world_cup_raw');
const tournaments = parseCsv(fs.readFileSync(path.join(dir, 'tournaments.csv'), 'utf-8'));
const standings = parseCsv(fs.readFileSync(path.join(dir, 'tournament_standings.csv'), 'utf-8'));
const squads = parseCsv(fs.readFileSync(path.join(dir, 'squads.csv'), 'utf-8'));
const awards = parseCsv(fs.readFileSync(path.join(dir, 'award_winners.csv'), 'utf-8'));

console.log('--- TOURNAMENTS (1950 - 2022) ---');
const menTournaments = tournaments.filter((t) => {
  const year = parseInt(t.year, 10);
  return year >= 1950 && t.tournament_name.includes("Men's");
});

console.log(`Found ${menTournaments.length} Men's World Cup tournaments from 1950 to 2022:`);
menTournaments.forEach((t) => console.log(`  ${t.year}: ${t.tournament_name} (${t.count_teams} teams)`));

// Count total team editions from 1950 to 2022
const tournamentIds = new Set(menTournaments.map((t) => t.tournament_id));
const relevantSquads = squads.filter((s) => tournamentIds.has(s.tournament_id));

const uniqueTeamEditions = new Set<string>();
relevantSquads.forEach((s) => uniqueTeamEditions.add(`${s.tournament_id}_${s.team_name}`));

console.log(`\nTotal Relevant Squad Entries: ${relevantSquads.length}`);
console.log(`Total Team Editions (1950-2022): ${uniqueTeamEditions.size}`);

// Sample team roster
const sample = relevantSquads.filter((s) => s.tournament_id === 'WC-1970' && s.team_name === 'Brazil');
console.log(`\nSample Brazil 1970 squad size: ${sample.length}`);
console.log('Sample players:');
sample.slice(0, 5).forEach((p) => console.log(`  #${p.shirt_number} ${p.given_name} ${p.family_name} (${p.position_name} / ${p.position_code})`));

// Check awards sample
console.log(`\nTotal Awards: ${awards.length}`);
const sampleAwards = awards.filter((a) => a.tournament_id === 'WC-1970');
console.log(`1970 Awards count: ${sampleAwards.length}`);
sampleAwards.forEach((a) => console.log(`  ${a.award_name} -> ${a.given_name} ${a.family_name} (${a.team_name})`));

