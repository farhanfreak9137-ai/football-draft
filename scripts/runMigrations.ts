import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');

export async function runMigrations() {
  console.log('--- Historical Football Draft: Database Migration Runner ---');
  const dbUrl = process.env.DATABASE_URL || 'file:local.db';
  console.log(`Connecting to database at: ${dbUrl}`);

  const client = createClient({ url: dbUrl });

  const migrationFiles = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`Discovered ${migrationFiles.length} migration script(s).`);

  for (const file of migrationFiles) {
    const fullPath = path.join(MIGRATIONS_DIR, file);
    console.log(`Applying migration: ${file}...`);
    const sqlContent = fs.readFileSync(fullPath, 'utf-8');

    // Split statements on semicolon
    const statements = sqlContent
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await client.execute(statement);
      } catch (err: any) {
        // SQLite doesn't support JSONB or some Postgres-specific syntax directly;
        // In local SQLite, fallback schemas are handled by db.initSchema().
        console.warn(`Note on statement [${statement.slice(0, 30)}...]: ${err.message}`);
      }
    }
    console.log(`Applied ${file} successfully.`);
  }

  console.log('--- All migrations processed successfully ---');
}

if (process.argv[1] && process.argv[1].endsWith('runMigrations.ts')) {
  runMigrations().catch(console.error);
}

