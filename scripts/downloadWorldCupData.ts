import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv';
const FILES = [
  'tournaments.csv',
  'teams.csv',
  'tournament_standings.csv',
  'squads.csv',
  'player_appearances.csv',
  'award_winners.csv',
  'goals.csv',
];

const TARGET_DIR = path.resolve(process.cwd(), 'data/world_cup_raw');

async function download() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  for (const file of FILES) {
    const dest = path.join(TARGET_DIR, file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[SKIP] ${file} already exists (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
      continue;
    }

    console.log(`[DOWNLOADING] ${file} from ${BASE_URL}/${file} ...`);
    const res = await fetch(`${BASE_URL}/${file}`);
    if (!res.ok) {
      throw new Error(`Failed to download ${file}: ${res.statusText}`);
    }
    const text = await res.text();
    fs.writeFileSync(dest, text, 'utf-8');
    console.log(`[SAVED] ${file} (${(text.length / 1024).toFixed(1)} KB)`);
  }

  console.log('All historical World Cup source datasets downloaded successfully!');
}

download().catch((err) => {
  console.error('Download error:', err);
  process.exit(1);
});

