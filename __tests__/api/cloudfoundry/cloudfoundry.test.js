import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getCFOrg, getCFOrgs } from '../../../api/cloudfoundry/cloudfoundry';
import { mockOrg, mockOrgNotFound, mockOrgs } from '../mocks/organizations';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
/* eslint no-undef: "error" */

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

  describe('getCFOrg', () => {
    it('when given a valid org guid, returns a single org', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/validGUID')
        .reply(200, mockOrg);
      const res = await getCFOrg('validGUID');
      expect(res).toEqual(mockOrg);
    });

    it('when given an invalid or unauthorized org guid, throws an error', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/invalidGUID')
        .reply(404, mockOrgNotFound);

      expect(async () => {
        await getCFOrg('invalidGUID');
      }).rejects.toThrow(new Error('an error occurred with response code 404'));
    });
  });

  describe('get CFOrgs', () => {
    it('returns orgs available to the user', async () => {
      nock(process.env.CF_API_URL).get('/organizations').reply(200, mockOrgs);
      const res = await getCFOrgs();
      expect(res).toEqual(mockOrgs.resources);
    });
  });
});
