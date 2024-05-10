import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getOrg, getOrgs } from '../../../api/cf/cloudfoundry';
import { mockOrg, mockOrgs, mockOrgInvalid } from '../mocks/organizations';

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

      it('when given an invalid or unauthorized org guid, throws an error', async () => {
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
});
