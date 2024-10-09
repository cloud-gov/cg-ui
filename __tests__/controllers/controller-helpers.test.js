import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  associateUsersWithRoles,
  filterUserLogonInfo,
  pollForJobCompletion,
  countUsersPerOrg,
  allocatedMemoryPerOrg,
  memoryUsagePerOrg,
  countSpacesPerOrg,
  countAppsPerOrg,
  getOrgRolesForCurrentUser,
} from '@/controllers/controller-helpers';
import {
  mockUsersByOrganization,
  mockUsersBySpace,
  mockRolesFilteredByOrgAndUser,
} from '../api/mocks/roles';
import { mockS3Object } from '../api/mocks/lastlogon-summary';
import nock from 'nock';
import mockUsers from '../api/mocks/users';
import { mockOrgQuotas } from '../api/mocks/orgQuotas';
import { mockSpaces } from '../api/mocks/spaces';
import { mockApps } from '../api/mocks/apps';
// eslint-disable-next-line no-unused-vars
import { getUserId } from '@/api/cf/token';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/api/cf/token', () => ({
  ...jest.requireActual('../../src/api/cf/token'),
  getUserId: jest.fn(() => '46ff1fd5-4238-4e22-a00a-1bec4fc0f9da'), // same user guid as in mockRolesFilteredByOrgAndUser
}));
/* eslint no-undef: "error" */

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

describe('controller-helpers', () => {
  describe('associateUsersWithRoles', () => {
    describe('when receiving an organization specific result', () => {
      it('returns a RolesByUser object with only org roles', () => {
        // act
        const result = associateUsersWithRoles(
          mockUsersByOrganization.resources
        );
        const testUser = result['ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199'];
        // assert
        expect(testUser.org[0].guid).toEqual(
          '89c0b2a8-957d-4900-abab-87395efaffdb'
        );
        expect(testUser.org[0].role).toEqual('organization_manager');
        expect(testUser.space).toEqual({});
      });
    });

    describe('when receiving a space specific result', () => {
      it('returns an array of RolesByUser objects with only space roles', () => {
        // act
        const usersBySpaceRes = {
          resources: [
            {
              guid: 'role1',
              type: 'space_manager',
              relationships: {
                user: {
                  data: {
                    guid: 'user1',
                  },
                },
                space: {
                  data: {
                    guid: 'space1',
                  },
                },
                organization: {
                  data: null,
                },
              },
            },
            {
              guid: 'role2',
              type: 'space_developer',
              relationships: {
                user: {
                  data: {
                    guid: 'user1',
                  },
                },
                space: {
                  data: {
                    guid: 'space1',
                  },
                },
                organization: {
                  data: null,
                },
              },
            },
          ],
        };
        const result = associateUsersWithRoles(usersBySpaceRes.resources);
        const testUser = result['user1'];
        // assert
        expect(testUser.org).toEqual([]);
        expect(testUser.space['space1']).toEqual([
          {
            guid: 'role1',
            role: 'space_manager',
          },
          {
            guid: 'role2',
            role: 'space_developer',
          },
        ]);
      });
    });

    describe('when receiving org and space roles', () => {
      it('returns a RolesByUser object with both org and space roles', () => {
        // act
        const result = associateUsersWithRoles(
          mockUsersBySpace.resources.concat(mockUsersByOrganization.resources)
        );
        const testUser = result['73193f8c-e03b-43c8-aeee-8670908899d2'];

        // assert
        expect(testUser.org).toEqual([
          {
            guid: '89c0b2a8-957d-4900-abab-87395efaffdb',
            role: 'organization_user',
          },
        ]);
        expect(testUser.space).toEqual({
          'dedb82bb-9f35-49f4-8ff9-7130ae2e3198': [
            {
              guid: '12ac7aa5-8a8e-48a4-9c90-a3b908c6e702',
              role: 'space_manager',
            },
            {
              guid: '1293d5ae-0266-413c-bacf-9f5474be984d',
              role: 'space_developer',
            },
          ],
        });
      });
    });
  });

  describe('filterUserLogonInfo', () => {
    it('takes the user summary from s3 and filters by requested users', () => {
      // setup
      const allUsers = mockS3Object.user_summary;
      const [guid1, guid2, guid3] = [
        'fbe925cf-8b14-4b43-9b2d-d15c4e5c66d6',
        '5536a948-f353-4fdf-b133-76b0324a1a1b',
        '3b33255a-baec-4b88-965f-1cce958f4fa3',
      ];
      // act
      const filtered = filterUserLogonInfo(allUsers, [guid1, guid3]);
      // expect
      expect(Object.keys(filtered)).toHaveLength(2);
      expect(filtered[guid3].lastLogonTime).toEqual(
        allUsers[guid3].lastLogonTime
      );
      expect(filtered[guid2]).not.toBeDefined();
    });

    it('if a user is requested that was not in the json, provides null values', () => {
      // setup
      const allUsers = mockS3Object.user_summary;
      const [guid1, guid2] = [
        'fbe925cf-8b14-4b43-9b2d-d15c4e5c66d6',
        'user-id-not-in-the-user-summary',
      ];
      // act
      const filtered = filterUserLogonInfo(allUsers, [guid1, guid2]);
      // expect
      expect(Object.keys(filtered)).toHaveLength(2);
      expect(filtered[guid1].lastLogonTime).toEqual(
        allUsers[guid1].lastLogonTime
      );
      expect(filtered[guid2].lastLogonTime).toBeNull();
      expect(filtered[guid2].active).toBeFalsy();
    });
  });

  describe('pollForJobCompletion', () => {
    it('returns when job completes', async () => {
      // setup
      const domain = 'http://example.com';
      const path = '/jobs/foo';
      nock(domain).get(path).reply(200, { state: 'COMPLETE' });
      // act
      const result = await pollForJobCompletion(domain + path);
      // expect
      expect(result).not.toBeDefined(); // recursion just completes
    });

    it('throws an error if job fails', async () => {
      // setup
      const domain = 'http://example.com';
      const path = '/jobs/foo';
      nock(domain).get(path).reply(200, { state: 'FAILED' });
      // act, expect
      expect(async () => {
        await pollForJobCompletion(domain + path);
      }).rejects.toThrow('a CF job failed');
    });

    it('keeps polling if job is still pending', async () => {
      // setup
      const domain = 'http://example.com';
      const path = '/jobs/foo';
      nock(domain)
        .get(path)
        .reply(200, { state: 'PENDING' })
        .get(path)
        .reply(200, { state: 'PENDING' })
        .get(path)
        .reply(200, { state: 'COMPLETE' });
      // act
      const result = await pollForJobCompletion(domain + path);
      // expect
      expect(result).not.toBeDefined(); // recursion just completes
    });
  });

  describe('countUsersPerOrg', () => {
    it('returns an object keyed by org guid with value of number of users', async () => {
      // setup
      // requst 1
      nock(process.env.CF_API_URL)
        .get(/orgId1\/users/)
        .reply(200, { resources: mockUsers }); // mock users should have 10 users
      // request 2
      nock(process.env.CF_API_URL)
        .get(/orgId2\/users/)
        .reply(200, { resources: mockUsers.slice(0, 5) }); // mock users should have 10 users
      // act
      const result = await countUsersPerOrg(['orgId1', 'orgId2']);
      // assert
      expect(result['orgId1']).toEqual(10);
      expect(result['orgId2']).toEqual(5);
    });
  });

  describe('allocatedMemoryPerOrg', () => {
    it('returns an object keyed by org id with value of memory in mb', async () => {
      // setup
      const orgGuids = ['orgId1', 'orgId2'];
      nock(process.env.CF_API_URL)
        .get(/organization_quotas\?organization_guids=orgId1%2CorgId2/)
        .reply(200, mockOrgQuotas);
      // act
      const result = await allocatedMemoryPerOrg(orgGuids);
      // assert
      expect(result['orgId1']).toEqual(10240);
      expect(result['orgId2']).toEqual(500);
    });
  });

  describe('memoryUsagePerOrg', () => {
    it('returns an object keyed by org id with value of memory current usage in mb', async () => {
      // setup
      const orgGuids = ['orgId1', 'orgId2'];
      const mockOrgUsageSummary1 = {
        usage_summary: {
          memory_in_mb: 123,
        },
      };
      const mockOrgUsageSummary2 = {
        usage_summary: {
          memory_in_mb: 456,
        },
      };
      nock(process.env.CF_API_URL)
        .get(/organizations\/orgId1\/usage_summary/)
        .reply(200, mockOrgUsageSummary1);
      nock(process.env.CF_API_URL)
        .get(/organizations\/orgId2\/usage_summary/)
        .reply(200, mockOrgUsageSummary2);
      // act
      const result = await memoryUsagePerOrg(orgGuids);
      // assert
      expect(result['orgId1']).toEqual(123);
      expect(result['orgId2']).toEqual(456);
    });
  });

  describe('countSpacesPerOrg', () => {
    it('returns an object keyed by org id with value of number of spaces', async () => {
      // setup
      const orgGuids = ['914b4899-2a7c-4214-bacc-f97576e00777'];
      nock(process.env.CF_API_URL)
        .get(/spaces\?organization_guids=914b4899-2a7c-4214-bacc-f97576e00777/)
        .reply(200, mockSpaces);
      // act
      const result = await countSpacesPerOrg(orgGuids);
      // assert
      expect(result['914b4899-2a7c-4214-bacc-f97576e00777']).toEqual(3);
    });
  });

  describe('countAppsPerOrg', () => {
    it('returns an object keyed by org id with value of number of apps', async () => {
      // setup
      const orgGuids = ['orgId1', 'orgId2'];
      nock(process.env.CF_API_URL).persist().get(/apps/).reply(200, mockApps); // mock apps should have 2 apps
      // act
      const result = await countAppsPerOrg(orgGuids);
      // assert
      expect(result['orgId1']).toEqual(2);
      expect(result['orgId2']).toEqual(2);
    });
  });

  describe('getOrgRolesForCurrentUser', () => {
    it('returns an object keyed by org id with value of array of role types', async () => {
      // setup
      const orgGuids = ['e8e31994-0dba-41e3-96ea-39942f1b30a4'];
      nock(process.env.CF_API_URL)
        .get(/roles/)
        .reply(200, mockRolesFilteredByOrgAndUser);
      // act
      const result = await getOrgRolesForCurrentUser(orgGuids);
      // assert
      expect(result['e8e31994-0dba-41e3-96ea-39942f1b30a4']).toEqual([
        'organization_manager',
      ]);
    });
  });
});
