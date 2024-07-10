import { describe, expect, it } from '@jest/globals';
import { addSession, viewSessions } from '../../../../db/session';
import { GET, POST } from '@/app/prototype/api/session/route';

/* global jest */
/* global Promise */

/* eslint no-undef: "off" */
jest.mock('../../../../db/session', () => ({
  addSession: jest.fn(),
  viewSessions: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('With valid DB connection', () => {
  describe('GET api/session', () => {
    it('returns a list of sessions and the total count', async () => {
      viewSessions.mockImplementation(() => {
        return [{ id: 1, username: 'Test' }];
      });
      const res = await GET();
      const data = await res.json();
      expect(data.count).toBe(1);
      expect(data.rows[0].id).toBe(1);
      expect(data.rows[0].username).toBe('Test');
    });
  });

  describe('POST api/session', () => {
    it('adds a new session to the db and returns it with an id', async () => {
      // imitate an http Request object for our purposes
      const request = {
        /* es-lint no-undef: "off" */
        json() {
          return Promise.resolve({ username: 'Test2' });
        },
        /* es-lint no-undef: "error" */
      };

      addSession.mockImplementation(() => {
        return { id: 2, username: 'Test2' };
      });

      const res = await POST(request);
      const data = await res.json();

      // check API response
      expect(data.count).toBe(1);
      expect(data.rows[0].id).toBe(2);
      expect(data.rows[0].username).toBe('Test2');
      expect(addSession).toHaveBeenCalled();
    });

    it('prevents a blank username from being added', async () => {
      // TODO this is technically different than the database behavior
      // which does not care if the username is blank, do we care?
      const request = {
        /* es-lint no-undef: "off" */
        json() {
          return Promise.resolve({ username: null });
        },
        /* es-lint no-undef: "error" */
      };
      // Note: do not need to mock database as we expect POST
      // to catch the error before we get there
      const res = await POST(request);
      const data = await res.json();

      expect(data.error).toBe('no username supplied');
    });
  });
});

describe('With an invalid db connection', () => {
  describe('GET api/session', () => {
    it.todo('returns an API response with an error message');
  });

  describe('POST api/session', () => {
    it.todo('returns an API response with an error message');
  });
});
