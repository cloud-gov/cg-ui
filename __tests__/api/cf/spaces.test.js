import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getSpace, getSpaces } from '@/api/cf/cloudfoundry';
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

  describe('getSpace', () => {
    it('when given a valid space guid, returns the space', async () => {
      nock(process.env.CF_API_URL)
        .get('/spaces/validGuid')
        .reply(200, mockSpace);

      const res = await getSpace('validGuid');
      expect(res.status).toEqual(200);
      expect(await res.json()).toEqual(mockSpace);
    });

    it('when given an invalid space guid, returns an error', async () => {
      nock(process.env.CF_API_URL)
        .get('/spaces/invalidGuid')
        .reply(404, mockSpaceInvalid);
      const res = await getSpace('invalidGuid');
      expect(res.status).toEqual(404);
      expect(await res.json()).toEqual(mockSpaceInvalid);
    });
  });

  describe('getSpaces', () => {
    it('returns spaces available to the user', async () => {
      nock(process.env.CF_API_URL).get('/spaces').reply(200, mockSpaces);
      const res = await getSpaces();
      expect(res.status).toEqual(200);
      expect(await res.json()).toEqual(mockSpaces);
    });

    it('when given a single org guid, returns spaces available to the user in that org', async () => {
      nock(process.env.CF_API_URL)
        .get('/spaces?organization_guids=org1')
        .reply(200, mockSpaces);
      const res = await getSpaces({ organizationGuids: ['org1'] });
      expect(res.status).toEqual(200);
      expect(await res.json()).toEqual(mockSpaces);
    });

    it('when given a multiple org guids, returns spaces available to the user within those orgs', async () => {
      nock(process.env.CF_API_URL)
        .get('/spaces?organization_guids=org1,org2')
        .reply(200, mockSpaces);
      const res = await getSpaces({ organizationGuids: ['org1', 'org2'] });
      expect(res.status).toEqual(200);
      expect(await res.json()).toEqual(mockSpaces);
    });
  });
});
