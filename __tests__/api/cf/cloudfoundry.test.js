import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getOrg, getOrgs, getSpace, getSpaces } from '@/api/cf/cloudfoundry';
import { mockOrg, mockOrgs, mockOrgInvalid } from '../mocks/organizations';
import { mockSpace, mockSpaceInvalid, mockSpaces } from '../mocks/spaces';

describe('cloudfoundry tests', () => {
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

  describe('organization endpoints', () => {
    describe('getOrg', () => {
      it('when given a valid org guid, returns a single org', async () => {
        nock(process.env.CF_API_URL)
          .get('/organizations/validGUID')
          .reply(200, mockOrg);

        const res = await getOrg('validGUID');
        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual(mockOrg);
      });

      it('when given an invalid or unauthorized org guid, return 404', async () => {
        nock(process.env.CF_API_URL)
          .get('/organizations/invalidGUID')
          .reply(404, mockOrgInvalid);

        const res = await getOrg('invalidGUID');
        expect(res.status).toEqual(404);
        expect(await res.json()).toEqual(mockOrgInvalid);
      });
    });

    describe('getOrgs', () => {
      it('returns orgs available to the user', async () => {
        nock(process.env.CF_API_URL).get('/organizations').reply(200, mockOrgs);
        const res = await getOrgs();

        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual(mockOrgs);
      });
    });
  });

  describe('space endpoints', () => {
    describe('getSpace', () => {
      it('when given a valid space guid, returns a single space', async () => {
        nock(process.env.CF_API_URL)
          .get('/spaces/validGUID')
          .reply(200, mockSpace);

        const res = await getSpace('validGUID');
        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual(mockSpace);
      });

      it('when given an invalid or unauthorized space guid, returns 404', async () => {
        nock(process.env.CF_API_URL)
          .get('/spaces/invalidGUID')
          .reply(404, mockSpaceInvalid);

        const res = await getSpace('invalidGUID');
        expect(res.status).toEqual(404);
        expect(await res.json()).toEqual(mockSpaceInvalid);
      });

      it('when encountering a server error, returns a 500 error', async () => {
        nock(process.env.CF_API_URL).get('/spaces/somethingBad').reply(500);

        const res = await getSpace('somethingBad');
        expect(res.status).toEqual(500);
      });
    });

    describe('getSpaces', () => {
      it('returns spaces available to the user', async () => {
        nock(process.env.CF_API_URL).get('/spaces').reply(200, mockSpaces);
        const res = await getSpaces();

        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual(mockSpaces);
      });
    });
  });
});
