import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Pool } from 'pg';
import {
  addSession,
  createSessionTable,
  deleteSessionTable,
  viewSessions,
} from '../../src/db/session';

describe('With a valid database connection', () => {
  let pool;

  beforeEach(async () => {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({ connectionString });

    await pool.query('DROP TABLE IF EXISTS session');
    // QUESTION: should we actually use createSessionTable for this to make sure
    // that the rest of the tests are using the same table that would normally be created
    // with that function?
    await pool.query(
      'CREATE TABLE session ( id SERIAL PRIMARY KEY, username VARCHAR (50) NOT NULL )'
    );
  });

  afterEach(async () => {
    pool.end();
  });

  describe('addSession', () => {
    it('adds a new user to the session table and augments id', async () => {
      const res1 = await addSession('Test1');
      expect(res1).toStrictEqual({
        id: 1,
        username: 'Test1',
      });

      const res2 = await addSession('Test2');
      expect(res2).toStrictEqual({
        id: 2,
        username: 'Test2',
      });

      const rowCount = await pool.query('SELECT COUNT(id) FROM session');
      const count = rowCount['rows'][0]['count'];
      expect(count).toBe('2');
    });

    it('adds a user with a blank name', async () => {
      const res = await addSession('');
      expect(res).toStrictEqual({
        id: 1,
        username: '',
      });
    });
  });

  describe('createSessionTable', () => {
    it('should create the session table when none exists', async () => {
      await pool.query('DROP TABLE IF EXISTS session');
      const res = await createSessionTable();
      expect(res['command']).toBe('CREATE');
      expect(res['rowCount']).toBeNull();
    });

    it('should not overwrite the session table when one already exists', async () => {
      await pool.query("INSERT INTO session(username) VALUES ('Test')");
      await createSessionTable();
      const res = await pool.query('SELECT * FROM session');
      expect(res.rows[0]['username']).toBe('Test');
    });
  });

  describe('deleteSessionTable', () => {
    it('should drop the existing session table even when populated', async () => {
      await pool.query("INSERT INTO session(username) VALUES ('Test')");
      const res = await deleteSessionTable();
      expect(res['command']).toBe('DROP');
    });
  });

  describe('viewSessions', () => {
    it('returns an empty array if there are no sessions', async () => {
      const res = await viewSessions();
      expect(res).toStrictEqual([]);
    });

    it('returns a list of ids and usernames in the sessions table', async () => {
      await pool.query(
        "INSERT INTO session(username) VALUES ('Test1'), ('Test2'), ('Test3');"
      );
      const res = await viewSessions();
      expect(res).toStrictEqual([
        { id: 1, username: 'Test1' },
        { id: 2, username: 'Test2' },
        { id: 3, username: 'Test3' },
      ]);
    });
  });
});

describe('With an invalid database connection', () => {
  // TODO there isn't behavior implemented in the db/session
  // module yet to handle an incorrect database connection
  describe('addSession', () => {
    it.todo('should throw an error');
  });
});

describe('connectionString', () => {
  // TODO the assignment for connection string is difficult to
  // test with its current implementation
  describe('when SSL is true', () => {
    it.todo('should end in ?ssl=true');
  });
  describe('when SSL is false or absent', () => {
    it.todo('should not include the ssl parameter');
  });
});
