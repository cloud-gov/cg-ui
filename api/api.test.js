import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import nock from 'nock';
import { addData, deleteData, getData } from './api';
import mockUsers from './mocks/users';

describe('api tests', () => {
  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.cleanAll();
    // https://github.com/nock/nock#memory-issues-with-jest
    nock.restore();
  });

  describe('addData', () => {
    it('throws error if response is 500', async () => {
      const reqData = { username: 'Test' };
      nock('http://example.com').post('/error', reqData).reply(500);

      expect(async () => {
        await addData('http://example.com/error', reqData);
      }).rejects.toThrow(new Error('an error occurred with response code 500'));
    });

    it('returns json if response is ok', async () => {
      const reqData = { username: 'Test' };
      const resData = { id: 1, username: 'Test' };
      nock('http://example.com').post('/success', reqData).reply(200, resData);

      expect(await addData('http://example.com/success', reqData)).toEqual(
        resData
      );
    });
  });

  describe('deleteData', () => {
    it('throws error if response is 500', async () => {
      nock('http://example.com').delete('/error/id').reply(500);

      expect(async () => {
        await deleteData('http://example.com/error/id');
      }).rejects.toThrow(new Error('an error occurred with response code 500'));
    });

    it('returns nothing if successful', async () => {
      nock('http://example.com').delete('/success/id').reply(202);

      expect(await deleteData('http://example.com/success/id')).toBeTruthy();
    });
  });

  describe('getData', () => {
    it('throws error if response is 500', async () => {
      nock('http://example.com').get('/error').reply(500);

      expect(async () => {
        await getData('http://example.com/error');
      }).rejects.toThrow(new Error('an error occurred with response code 500'));
    });

    it('returns json if response is ok', async () => {
      nock('http://example.com').get('/success').reply(200, mockUsers);

      expect(await getData('http://example.com/success')).toEqual(mockUsers);
    });
  });
});
