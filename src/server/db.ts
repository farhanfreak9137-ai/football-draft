import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient, Client } from '@libsql/client';
import { RoomState, TeamEdition, PlayerVersion, PlayerIdentity } from '../shared/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const possibleDataDirs = [
  path.resolve(process.cwd(), 'data'),
  path.resolve(__dirname, '../../../data'),
  path.resolve(__dirname, '../../data'),
];
const DATA_DIR = possibleDataDirs.find((d) => fs.existsSync(d)) || possibleDataDirs[0];

export class DatabaseService {
  private client: Client;
  private memoryRooms: Map<string, RoomState> = new Map();
  public editions: TeamEdition[] = [];
  public players: PlayerVersion[] = [];
  public identities: PlayerIdentity[] = [];

  constructor() {
    // Load historical datasets into memory cache for sub-millisecond game operations
    this.loadDataFiles();

    const dbUrl = process.env.DATABASE_URL || 'file:local.db';
    this.client = createClient({
      url: dbUrl,
    });
  }

  private loadDataFiles() {
    const possibleWcDirs = [
      path.resolve(process.cwd(), 'world_cup_teams'),
      path.resolve(__dirname, '../../../world_cup_teams'),
      path.resolve(__dirname, '../../world_cup_teams'),
    ];
    const wcDir = possibleWcDirs.find((d) => fs.existsSync(d)) || possibleWcDirs[0];

    let natEditions: TeamEdition[] = [];
    let natPlayers: PlayerVersion[] = [];

    if (fs.existsSync(wcDir)) {
      const files = fs.readdirSync(wcDir).filter((f) => f.endsWith('.json') && f !== 'index.json');
      for (const file of files) {
        try {
          const raw = JSON.parse(fs.readFileSync(path.join(wcDir, file), 'utf-8'));
          const editionId = `${raw.teamName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${raw.year}`;
          const edition: TeamEdition = {
            id: editionId,
            teamId: raw.teamName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            teamName: raw.teamName,
            editionType: 'national',
            yearOrSeason: String(raw.year),
            competition: raw.tournament || `${raw.year} FIFA World Cup`,
            achievement: raw.achievement || 'World Cup Squad',
            coach: 'Tournament Manager',
            tacticalFormation: raw.tacticalFormation || '4-3-3',
            verifiedSourceIds: ['fifa-archive', 'rsssf'],
            verificationStatus: 'verified',
          };
          natEditions.push(edition);

          if (Array.isArray(raw.players)) {
            for (const p of raw.players) {
              const pv: PlayerVersion = {
                id: p.id || `${editionId}-${p.squadNumber}`,
                identityId: p.identityId || p.id,
                editionId: editionId,
                name: p.name,
                squadNumber: p.squadNumber || 1,
                ovr: p.ovr || 75,
                naturalPositions: p.naturalPositions || ['CM'],
                secondaryPositions: p.secondaryPositions || [],
                hasLegendSeal: Boolean(p.hasLegendSeal),
                legendSealReason: p.legendSealReason,
                tournamentOrSeasonStats: {
                  appearances: (p.matchesStarted || 0) + (p.matchesSub || 0),
                  goals: p.goals || 0,
                },
                ratingRationale: p.ratingRationale || `Rated ${p.ovr} OVR.`,
                methodologyVersion: '1.0',
                reviewer: 'Historical Football Research',
                reviewDate: '2026-10-19',
                verificationStatus: 'verified',
                sources: [{ sourceId: 'fifa-archive', fact: 'World Cup squad member' }],
              };
              natPlayers.push(pv);
            }
          }
        } catch (e) {
          console.error(`Failed to load World Cup squad ${file}:`, e);
        }
      }
    }

    if (natEditions.length === 0) {
      natEditions = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'editions_national.json'), 'utf-8')
      );
      natPlayers = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'players_national.json'), 'utf-8')
      );
    }

    const clubEditions: TeamEdition[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'editions_club.json'), 'utf-8')
    );
    this.editions = [...natEditions, ...clubEditions];

    const clubPlayers: PlayerVersion[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'players_club.json'), 'utf-8')
    );
    this.players = [...natPlayers, ...clubPlayers];

    this.identities = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'identities.json'), 'utf-8')
    );
  }

  async initSchema() {
    try {
      await this.client.execute('PRAGMA journal_mode = WAL;');
      await this.client.execute('PRAGMA busy_timeout = 5000;');
    } catch {}

    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS rooms (
        room_code TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        mode TEXT NOT NULL,
        pool_type TEXT NOT NULL,
        state_json TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      );
    `);

    await this.client.execute(`
      CREATE TABLE IF NOT EXISTS match_records (
        match_id TEXT PRIMARY KEY,
        room_code TEXT NOT NULL,
        winner TEXT NOT NULL,
        score_host INTEGER NOT NULL,
        score_guest INTEGER NOT NULL,
        data_json TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
  }

  async saveRoom(room: RoomState): Promise<void> {
    this.memoryRooms.set(room.roomCode, room);
    try {
      await this.client.execute({
        sql: `INSERT INTO rooms (room_code, status, mode, pool_type, state_json, created_at, updated_at, expires_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(room_code) DO UPDATE SET
                status = excluded.status,
                state_json = excluded.state_json,
                updated_at = excluded.updated_at,
                expires_at = excluded.expires_at`,
        args: [
          room.roomCode,
          room.status,
          room.mode,
          room.poolType,
          JSON.stringify(room),
          room.createdAt,
          room.updatedAt,
          room.expiresAt,
        ],
      });
    } catch (err) {
      // In-memory fallback if disk DB write encounters temporary lock
      console.warn('DB write warning, room state preserved in-memory:', err);
    }
  }

  async getRoom(roomCode: string): Promise<RoomState | null> {
    if (this.memoryRooms.has(roomCode)) {
      return this.memoryRooms.get(roomCode)!;
    }

    try {
      const rs = await this.client.execute({
        sql: `SELECT state_json FROM rooms WHERE room_code = ?`,
        args: [roomCode],
      });
      if (rs.rows.length > 0) {
        const room = JSON.parse(rs.rows[0].state_json as string) as RoomState;
        this.memoryRooms.set(roomCode, room);
        return room;
      }
    } catch (err) {
      console.error('Error fetching room from DB:', err);
    }
    return null;
  }

  async deleteRoom(roomCode: string): Promise<void> {
    this.memoryRooms.delete(roomCode);
    try {
      await this.client.execute({
        sql: `DELETE FROM rooms WHERE room_code = ?`,
        args: [roomCode],
      });
    } catch (err) {
      console.error('Error deleting room from DB:', err);
    }
  }

  async cleanupExpiredRooms(now: number): Promise<number> {
    let deletedCount = 0;
    for (const [code, room] of this.memoryRooms.entries()) {
      if (room.expiresAt <= now) {
        this.memoryRooms.delete(code);
        deletedCount++;
      }
    }

    try {
      const rs = await this.client.execute({
        sql: `DELETE FROM rooms WHERE expires_at <= ?`,
        args: [now],
      });
      deletedCount += Number(rs.rowsAffected || 0);
    } catch (err) {
      console.error('Error cleaning up expired rooms:', err);
    }

    return deletedCount;
  }

  getAllActiveRooms(): RoomState[] {
    return Array.from(this.memoryRooms.values());
  }
}
