import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  deleteOrgUser,
  getOrgPage,
  getSpaceUsers,
} from '@/controllers/prototype-controller';
import { mockOrg } from '../api/mocks/organizations';
import {
  mockRolesFilteredByOrgAndUser,
  mockUsersByOrganization,
  mockUsersBySpace,
} from '../api/mocks/roles';
import { mockSpaces } from '../api/mocks/spaces';

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

describe('prototype-controller tests', () => {
  describe('deleteOrgUser', () => {
    it('when given a valid org and user, removes all user roles from org', async () => {
      nock(process.env.CF_API_URL)
        .get(
          '/roles?organization_guids=orgGuid&user_guids=userGuid&per_page=5000'
        )
        .reply(200, mockRolesFilteredByOrgAndUser);

      // expects two different requests to delete by guid
      nock(process.env.CF_API_URL)
        .delete(/\/roles\/([\d\w]+-)+/)
        .times(2)
        .reply(202);

      const res = await deleteOrgUser('orgGuid', 'userGuid');
      expect(res).toEqual({
        success: true,
        status: 'success',
        message: 'removed user from org',
      });
    });
  });

  describe('getOrgPage', () => {
    describe('if any CF requests fail', () => {
      it('throws an error', async () => {
        // setup
        const guid = 'foo';
        const errMessage = { message: 'failed' };
        nock(process.env.CF_API_URL)
          .get(/spaces/)
          .reply(500, errMessage);
        nock(process.env.CF_API_URL)
          .get(/roles/)
          .reply(200, { message: 'foo success' });
        nock(process.env.CF_API_URL)
          .get(/organizations/)
          .reply(200, { message: 'foo success' });
        // act and assert
        expect(async () => {
          await getOrgPage(guid);
        }).rejects.toThrow(new Error('something went wrong with the request'));
      });
    });

    describe('if all requests succeed', () => {
      it('returns the expected controller result', async () => {
        // setup
        const guid = 'foo';
        nock(process.env.CF_API_URL)
          .get(/spaces/)
          .reply(200, mockSpaces);
        nock(process.env.CF_API_URL)
          .get(/roles/)
          .reply(200, mockUsersByOrganization);
        nock(process.env.CF_API_URL)
          .get(/organizations/)
          .reply(200, mockOrg);
        // sends a second request to get the roles associated with spaces
        nock(process.env.CF_API_URL).get(/roles/).reply(200, mockUsersBySpace);
        // act
        const result = await getOrgPage(guid);
        // assert
        expect(result).toHaveProperty('meta');
        expect(result).toHaveProperty('payload');
        expect(result.payload.org).toEqual(mockOrg);
        expect(result.payload.spaces).toEqual(mockSpaces.resources);
        expect(result.payload.users).toBeDefined();
      });
    });
  });

  describe('getSpaceUsers', () => {
    it('when given a valid space guid, returns associated users', async () => {
      nock(process.env.CF_API_URL)
        .get('/roles?space_guids=validGUID&include=user&per_page=5000')
        .reply(200, mockUsersBySpace);
      const res = await getSpaceUsers('validGUID');

      // one user with multiple roles should be returned
      const expected = [
        {
          guid: '73193f8c-e03b-43c8-aeee-8670908899d2',
          origin: 'example.com',
          roles: [
            {
              guid: '12ac7aa5-8a8e-48a4-9c90-a3b908c6e702',
              type: 'space_manager',
            },
            {
              guid: '1293d5ae-0266-413c-bacf-9f5474be984d',
              type: 'space_developer',
            },
          ],
          username: 'z_user1@example.com',
        },
      ];
      expect(res.payload).toEqual(expected);
    });
  });

  describe('getOrgPage', () => {
    describe('if any CF requests fail', () => {
      it('throws an error', async () => {
        // setup
        const guid = 'foo';
        const errMessage = { message: 'failed' };
        nock(process.env.CF_API_URL)
          .get(/spaces/)
          .reply(500, errMessage);
        nock(process.env.CF_API_URL)
          .get(/roles/)
          .reply(200, { message: 'foo success' });
        nock(process.env.CF_API_URL)
          .get(/organizations/)
          .reply(200, { message: 'foo success' });
        // act and assert
        expect(async () => {
          await getOrgPage(guid);
        }).rejects.toThrow(new Error('something went wrong with the request'));
      });
    });

    describe('if all requests succeed', () => {
      it('returns the expected controller result', async () => {
        // setup
        const guid = 'foo';
        nock(process.env.CF_API_URL)
          .get(/spaces/)
          .reply(200, mockSpaces);
        nock(process.env.CF_API_URL)
          .get(/roles/)
          .reply(200, mockUsersByOrganization);
        nock(process.env.CF_API_URL)
          .get(/organizations/)
          .reply(200, mockOrg);
        // sends a second request to get the roles associated with spaces
        nock(process.env.CF_API_URL).get(/roles/).reply(200, mockUsersBySpace);
        // act
        const result = await getOrgPage(guid);
        // assert
        expect(result).toHaveProperty('meta');
        expect(result).toHaveProperty('payload');
        expect(result.payload.org).toEqual(mockOrg);
        expect(result.payload.spaces).toEqual(mockSpaces.resources);
        expect(result.payload.users).toBeDefined();
      });
    });
  });
});
