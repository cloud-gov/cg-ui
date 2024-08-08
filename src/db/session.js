import { Client } from 'pg';

// TODO look into putting this into a function that we can more easily
// mock for testing purposes
const connectionString =
  process.env.DATABASE_URL + (process.env.DATABASE_SSL ? '?ssl=true' : '');

export async function queryClient(query = {}) {
  const client = new Client({ connectionString });
  client.connect();
  const res = await client.query(query);
  await client.end();
  return res;
}

export async function addSession(username) {
  try {
    const insert = {
      text: 'INSERT INTO session(username) VALUES($1) RETURNING id, username',
      values: [username],
    };
    const res = await queryClient(insert);
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
    const res = await queryClient({
      text: 'CREATE TABLE IF NOT EXISTS session ( id SERIAL PRIMARY KEY, username VARCHAR (50) NOT NULL );',
    });
    return res;
  } catch (error) {
    throw new Error(
      'Something went wrong creating the session table: ' + error.message
    );
  }
}

export async function deleteSessionTable() {
  try {
    const res = await queryClient({ text: 'DROP TABLE IF EXISTS session' });
    return res;
  } catch (error) {
    throw new Error('Unable to drop table: ' + error.message);
  }
}

export async function viewSessions() {
  try {
    const res = await queryClient({ text: 'SELECT * FROM session' });
    return res.rows;
  } catch (error) {
    throw new Error('Unable to view sessions: ' + error.message);
  }
}
