import { describe, expect, it } from '@jest/globals';
import { createSessionTable, deleteSessionTable } from '@/db/session';
import { GET, DELETE } from '@/app/prototype/api/table/route';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/db/session', () => ({
  createSessionTable: jest.fn(),
  deleteSessionTable: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('With valid DB connection', () => {
  describe('GET api/table', () => {
    it('creates a session table and responds with success', async () => {
      createSessionTable.mockImplementation(() => {
        // this is a curated version of the actual JSON response
        return {
          command: 'CREATE',
          rowCount: null,
          oid: null,
          rows: [],
          fields: [],
        };
      });

      const res = await GET();
      const data = await res.json();
      expect(data.status).toBe('success');
      expect(data.message.command).toBe('CREATE');
      expect(createSessionTable).toHaveBeenCalled();
    });
  });

  describe('DELETE api/table', () => {
    it('deletes the session table and responds with success', async () => {
      deleteSessionTable.mockImplementation(() => {
        // this is a curated version of the actual JSON response
        return {
          command: 'DROP',
          rowCount: null,
          oid: null,
          rows: [],
          fields: [],
        };
      });
      const res = await DELETE();
      const data = await res.json();
      expect(data.status).toBe('success');
      expect(data.message.command).toBe('DROP');
      expect(deleteSessionTable).toHaveBeenCalled();
    });
  });
});

describe('With an invalid db connection', () => {
  describe('GET api/table', () => {
    it.todo('returns an API response with an error message');
  });

  describe('DELETE api/table', () => {
    it.todo('returns an API response with an error message');
  });
});
