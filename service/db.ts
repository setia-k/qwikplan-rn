import { openDatabaseAsync, openDatabaseSync } from 'expo-sqlite';

export function DBCreateTable() {
  const db = openDatabaseSync('qwikplan.db');
  const query = `
  DROP TABLE IF EXISTS task;
  
  CREATE TABLE IF NOT EXISTS task (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    event TEXT,
    details TEXT,
    datetime TEXT NOT NULL,
    created_at TEXT,
    updated_at TEXT
  );
  `

  db.execSync(query);
  db.closeSync();
}

export function DBDebugInit() {
  const db = openDatabaseSync('qwikplan.db');
  const task = db.getAllSync('SELECT * FROM task');

  if (task.length) return;
  db.execSync(`
  INSERT INTO task (id, title, event, details, datetime, created_at, updated_at)
  VALUES ('1','Test Task', 'daily', 'test task details', '2024-05-17T12:49:06.429Z', '2024-05-17T12:49:06.429Z', '2024-05-17T12:49:06.429Z');
  `);
  db.closeSync();
}