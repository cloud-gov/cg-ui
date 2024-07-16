import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  getApps,
  getOrg,
  getOrgs,
  getSpace,
  getSpaces,
} from '@/api/cf/cloudfoundry';
import { mockApps } from '../mocks/apps';
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

  describe('app endpoints', () => {
    describe('getApps', () => {
      it('when given no arguments, looks for all apps', async () => {
        nock(process.env.CF_API_URL)
          .get('/apps?per_page=5000')
          .reply(200, mockApps);

        const res = await getApps({});
        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual(mockApps);
      });
      it('when given org and include arguments, sends appropriate request', async () => {
        nock(process.env.CF_API_URL)
          .get('/apps?organization_guids=org1&include=space&per_page=5000')
          .reply(200, {});

        const res = await getApps({
          organizationGuids: ['org1'],
          include: ['space'],
        });
        expect(res.status).toEqual(200);
      });
    });
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
      it('when filtered by org guid, returns relevant spaces available to the user', async () => {
        nock(process.env.CF_API_URL)
          .get('/spaces?organization_guids=org1')
          .reply(200, mockSpaces);
        const res = await getSpaces({ organizationGuids: ['org1'] });

        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual(mockSpaces);
      });
    });
  });
});
