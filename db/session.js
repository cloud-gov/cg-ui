import { Pool } from 'pg';

// TODO look into putting this into a function that we can more easily
// mock for testing purposes
const connectionString =
  process.env.DATABASE_URL + (process.env.DATABASE_SSL ? '?ssl=true' : '');

export async function addSession(username) {
  try {
    const insert = {
      text: 'INSERT INTO session(username) VALUES($1) RETURNING id, username',
      values: [username],
    };
    const pool = new Pool({ connectionString });
    const res = await pool.query(insert);
    await pool.end();
    const item = res['rows'][0];
    return { id: item['id'], username: item['username'] };
  } catch (error) {
    throw new Error(
      'Something went wrong inserting a session ' + error.message
    );
  }
}

export async function createSessionTable() {
  try {
    const pool = new Pool({ connectionString });
    const res = await pool.query(
      'CREATE TABLE IF NOT EXISTS session ( id SERIAL PRIMARY KEY, username VARCHAR (50) NOT NULL );'
    );
    await pool.end();
    return res;
  } catch (error) {
    throw new Error(
      'Something went wrong creating the session table: ' + error.message
    );
  }
}

export async function deleteSessionTable() {
  const pool = new Pool({ connectionString });
  const res = await pool.query('DROP TABLE IF EXISTS session');
  await pool.end();
  return res;
}

export async function viewSessions() {
  try {
    const pool = new Pool({ connectionString });
    const res = await pool.query('SELECT * FROM session');
    await pool.end();
    return res.rows;
  } catch (error) {
    throw new Error('Unable to view sessions: ' + error.message);
  }
}
