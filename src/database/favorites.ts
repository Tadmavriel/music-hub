import * as SQLite from 'expo-sqlite';

export type SavedPost = {
  id: number;
  title: string;
  body: string;
  isRead: 0 | 1;
};

type PostInput = Pick<SavedPost, 'id' | 'title' | 'body'>;

const readyDb = (async () => {
  const db = await SQLite.openDatabaseAsync('campus_favorites.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      isRead INTEGER NOT NULL DEFAULT 0 CHECK (isRead IN (0, 1))
    );
  `);
  return db;
})();

export async function savePost(post: PostInput) {
  const db = await readyDb;
  const result = await db.runAsync(
    `INSERT INTO favorites (id, title, body) VALUES (?, ?, ?)
     ON CONFLICT(id) DO NOTHING`,
    post.id,
    post.title,
    post.body
  );
  return result.changes;
}

export async function getSavedPosts() {
  const db = await readyDb;
  return db.getAllAsync<SavedPost>(
    `SELECT id, title, body, isRead
     FROM favorites
     ORDER BY isRead ASC, id DESC`
  );
}

export async function toggleRead(id: number) {
  const db = await readyDb;
  await db.runAsync(
    `UPDATE favorites SET isRead = 1 - isRead WHERE id = ?`,
    id
  );
}

export async function removeSaved(id: number) {
  const db = await readyDb;
  await db.runAsync('DELETE FROM favorites WHERE id = ?', id);
}