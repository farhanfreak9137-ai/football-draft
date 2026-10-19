import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Load current data
const identities = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'identities.json'), 'utf-8'));
const nationalEditions = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'editions_national.json'), 'utf-8'));
const clubEditions = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'editions_club.json'), 'utf-8'));
let nationalPlayers = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_national.json'), 'utf-8'));
let clubPlayers = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'players_club.json'), 'utf-8'));

console.log(`Starting with ${nationalPlayers.length} national players, ${clubPlayers.length} club players.`);

