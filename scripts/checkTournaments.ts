import fs from 'fs';
import path from 'path';

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

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

const rawDir = path.resolve(process.cwd(), 'data/world_cup_raw');
const tournaments = parseCsv(fs.readFileSync(path.join(rawDir, 'tournaments.csv'), 'utf-8'));
const squads = parseCsv(fs.readFileSync(path.join(rawDir, 'squads.csv'), 'utf-8'));

const menYears = new Map<string, number>();
tournaments.forEach((t) => {
  const y = parseInt(t.year, 10);
  if (y >= 1950 && t.tournament_name.includes("Men's")) {
    menYears.set(t.tournament_id, y);
  }
});

const teamsByTournament = new Map<string, Set<string>>();
squads.forEach((s) => {
  if (menYears.has(s.tournament_id)) {
    if (!teamsByTournament.has(s.tournament_id)) {
      teamsByTournament.set(s.tournament_id, new Set());
    }
    teamsByTournament.get(s.tournament_id)!.add(s.team_name);
  }
});

console.log('--- TOURNAMENT BREAKDOWN (1950-2022) ---');
let totalTeams = 0;
Array.from(menYears.entries())
  .sort((a, b) => a[1] - b[1])
  .forEach(([tid, year]) => {
    const teamSet = teamsByTournament.get(tid) || new Set();
    totalTeams += teamSet.size;
    console.log(`${year} (${tid}): ${teamSet.size} teams -> ${Array.from(teamSet).slice(0, 4).join(', ')}...`);
  });

console.log(`\nTotal team files to generate: ${totalTeams}`);

