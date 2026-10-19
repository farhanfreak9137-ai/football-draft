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
const standings = parseCsv(fs.readFileSync(path.join(rawDir, 'tournament_standings.csv'), 'utf-8'));
const squads = parseCsv(fs.readFileSync(path.join(rawDir, 'squads.csv'), 'utf-8'));
const appearances = parseCsv(fs.readFileSync(path.join(rawDir, 'player_appearances.csv'), 'utf-8'));
const awards = parseCsv(fs.readFileSync(path.join(rawDir, 'award_winners.csv'), 'utf-8'));
const goals = parseCsv(fs.readFileSync(path.join(rawDir, 'goals.csv'), 'utf-8'));

console.log('Loaded CSV files successfully:');
console.log(`- Tournaments: ${tournaments.length}`);
console.log(`- Standings: ${standings.length}`);
console.log(`- Squads: ${squads.length}`);
console.log(`- Appearances: ${appearances.length}`);
console.log(`- Awards: ${awards.length}`);
console.log(`- Goals: ${goals.length}`);

