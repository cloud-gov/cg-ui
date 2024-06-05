import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getUsers } from '@/api/uaa/uaa';

describe('uaa tests', () => {
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

  describe('/Users endpoints', () => {
    describe('getUsers', () => {
      it('when the api rejects the request, returns an error Response', async () => {
        nock(process.env.UAA_API_URL).get(/Users/).reply(500);
        const res = await getUsers(['id']);
        expect(res.status).toEqual(500);
      });

      it('when given a list of fields, prepares a url with those fields', async () => {
        nock(process.env.UAA_API_URL)
          .get('/Users?attributes=field1,field2')
          .reply(200);
        const res = await getUsers(['field1', 'field2']);
        expect(res.status).toEqual(200);
      });

      it('when given a filter field and values, prepares a url with that filter', async () => {
        nock(process.env.UAA_API_URL)
          .get(
            '/Users?attributes=id&filter=userName+eq+"User1"+or+userName+eq+"User2"'
          )
          .reply(200);
        const res = await getUsers(['id'], 'userName', ['User1', 'User2']);
        expect(res.status).toEqual(200);
      });
    });
  });
});
