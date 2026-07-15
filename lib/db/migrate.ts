import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index';
import path from 'path';

export async function runMigrations() {
  try {
    await migrate(db, {
      migrationsFolder: path.resolve(process.cwd(), 'drizzle'),
    });
    console.log('[DB] Migrations completed successfully');
  } catch (error) {
    console.error('[DB] Migration error:', error);
    throw error;
  }
}
