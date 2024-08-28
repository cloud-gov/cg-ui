import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  getEditOrgRoles,
  getOrgPage,
  getOrgAppsPage,
  getOrgUsagePage,
  getUser,
  removeUserFromOrg,
} from '@/controllers/controllers';
import { pollForJobCompletion } from '@/controllers/controller-helpers';
import { mockApps } from '../api/mocks/apps';
import {
  mockRolesFilteredByOrgAndUser,
  mockUsersByOrganization,
  mockUsersBySpace,
} from '../api/mocks/roles';
import { getUserLogonInfo } from '@/api/aws/s3';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/controllers/controller-helpers', () => ({
  ...jest.requireActual('../../src/controllers/controller-helpers'),
  pollForJobCompletion: jest.fn(),
}));
jest.mock('@/api/aws/s3', () => ({
  getUserLogonInfo: jest.fn(),
}));
/* eslint no-undef: "error" */

beforeEach(() => {
  if (!nock.isActive()) {
    nock.activate();
  }
  // jest mocks
  getUserLogonInfo.mockImplementation();
  pollForJobCompletion.mockImplementation();
});

afterEach(() => {
  nock.cleanAll();
  // https://github.com/nock/nock#memory-issues-with-jest
  nock.restore();
});

describe('controllers tests', () => {
  describe('getOrgPage', () => {
    describe('if any of the first CF requests fail', () => {
      it('throws an error', async () => {
        // setup
        const orgGuid = 'orgGuid';
        nock(process.env.CF_API_URL)
          .get(
            `/roles?organization_guids=${orgGuid}&include=organization,user&per_page=5000`
          )
          .reply(500);
        nock(process.env.CF_API_URL)
          .get(`/spaces?organization_guids=${orgGuid}`)
          .reply(200);

        // assert
        expect(async () => {
          await getOrgPage(orgGuid);
        }).rejects.toThrow(new Error('something went wrong with the request'));
      });
    });

    describe('if the s3 request fails', () => {
      it('returns normal response data with undefined user login info', async () => {
        // setup
        const orgGuid = 'orgGuidS3Fails';
        const testSpaceGuids = {
          resources: [
            {
              guid: 'space1',
            },
            {
              guid: 'space2',
            },
            {
              guid: 'space3',
            },
          ],
        };
        nock(process.env.CF_API_URL)
          .get(
            `/roles?organization_guids=${orgGuid}&per_page=5000&include=organization,user`
          )
          .reply(200, mockUsersByOrganization);
        nock(process.env.CF_API_URL)
          .get(`/spaces?organization_guids=${orgGuid}`)
          .reply(200, testSpaceGuids);
        nock(process.env.CF_API_URL)
          .get('/roles?per_page=5000&space_guids=space1,space2,space3')
          .reply(200, mockUsersBySpace);
        getUserLogonInfo.mockImplementation(() => {
          return undefined;
        });

        const res = await getOrgPage(orgGuid);

        // assert
        expect(res.payload.userLogonInfo).toBeUndefined();
        expect(res.payload.users).toBeDefined();
      });
    });

    describe('if the CF requests succeed', () => {
      it('returns the expected controller result', async () => {
        // setup
        const orgGuid = 'orgGuidSucceeded';
        const testSpaceGuids = {
          resources: [
            {
              guid: 'space1',
            },
            {
              guid: 'space2',
            },
            {
              guid: 'space3',
            },
          ],
        };
        nock(process.env.CF_API_URL)
          .get(
            `/roles?organization_guids=${orgGuid}&per_page=5000&include=organization,user`
          )
          .reply(200, mockUsersByOrganization);
        nock(process.env.CF_API_URL)
          .get(`/spaces?organization_guids=${orgGuid}`)
          .reply(200, testSpaceGuids);
        nock(process.env.CF_API_URL)
          .get('/roles?per_page=5000&space_guids=space1,space2,space3')
          .reply(200, mockUsersBySpace);
        getUserLogonInfo.mockImplementation(() => {
          return {
            user_summary: {
              '73193f8c-e03b-43c8-aeee-8670908899d2': {
                lastLogonTime: 1111,
                active: true,
              },
              'some-user-guid-that-is-not-part-of-org': {
                lastLogonTime: 2222,
                active: false,
              },
            },
          };
        });

        const result = await getOrgPage(orgGuid);
        const firstUserRoles =
          result.payload.roles['73193f8c-e03b-43c8-aeee-8670908899d2'];
        const firstUser = result.payload.users[0];

        // assert
        expect(result).toHaveProperty('meta');
        expect(result).toHaveProperty('payload');
        expect(result.payload.org).toEqual(
          mockUsersByOrganization.included.organizations[0]
        );
        expect(result.payload.spaces).toBeDefined();
        expect(result.payload.users).toBeDefined();
        expect(firstUserRoles).toEqual({
          allOrgRoleGuids: ['fb55574d-6b84-405e-b23c-0984f0a0964a'],
          allSpaceRoleGuids: [
            '12ac7aa5-8a8e-48a4-9c90-a3b908c6e702',
            '1293d5ae-0266-413c-bacf-9f5474be984d',
          ],
          org: [
            {
              guid: '89c0b2a8-957d-4900-abab-87395efaffdb',
              role: 'organization_user',
            },
          ],
          space: {
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
          },
        });
        expect(
          result.payload.userLogonInfo['73193f8c-e03b-43c8-aeee-8670908899d2']
        ).toEqual({
          lastLogonTime: 1111,
          active: true,
        });
        expect(
          result.payload.userLogonInfo['some-user-guid-that-is-not-part-of-org']
        ).not.toBeDefined();

        // rollup numbers
        expect(firstUser.orgRolesCount).toEqual(1);
        expect(firstUser.spaceRolesCount).toEqual(1);
        expect(firstUser.daysToExpiration).toBeLessThan(0);
        expect(firstUser.lastLogonTime).toEqual(1111);
      });

      it('returns service credential binding information for non human users', async () => {
        // setup
        const orgGuid = 'orgGuidSucceeded';
        const testSpaceGuids = {
          resources: [
            {
              guid: 'space1',
            },
            {
              guid: 'space2',
            },
            {
              guid: 'space3',
            },
          ],
        };
        // insert a service account user into the mock users object
        mockUsersByOrganization.resources.push({
          guid: '630a474a-3a10-487e-8913-c86765bfa56e',
          created_at: '2024-01-17T19:10:53Z',
          updated_at: '2024-01-17T19:10:53Z',
          type: 'organization_auditor',
          relationships: {
            user: {
              data: {
                guid: '6d9f5e19-3437-4de4-a565-3a34bccb8cf9',
              },
            },
            organization: {
              data: {
                guid: '89c0b2a8-957d-4900-abab-87395efaffdb',
              },
            },
            space: {
              data: null,
            },
          },
        });
        mockUsersByOrganization.included.users.push({
          guid: '6d9f5e19-3437-4de4-a565-3a34bccb8cf9',
          username: '107a159b-6bc6-4ad8-989d-0c65433f351d',
          origin: 'uaa',
        });

        const mockServiceBindings = {
          resources: [
            {
              guid: '107a159b-6bc6-4ad8-989d-0c65433f351d',
              name: 'service account example',
            },
          ],
        };
        nock(process.env.CF_API_URL)
          .get(
            `/roles?organization_guids=${orgGuid}&per_page=5000&include=organization,user`
          )
          .reply(200, mockUsersByOrganization);
        nock(process.env.CF_API_URL)
          .get(`/spaces?organization_guids=${orgGuid}`)
          .reply(200, testSpaceGuids);
        nock(process.env.CF_API_URL)
          .get('/roles?per_page=5000&space_guids=space1,space2,space3')
          .reply(200, mockUsersBySpace);
        nock(process.env.CF_API_URL)
          .get(
            '/service_credential_bindings?guids=107a159b-6bc6-4ad8-989d-0c65433f351d'
          )
          .reply(200, mockServiceBindings);

        // act
        const result = await getOrgPage(orgGuid);

        // assert
        expect(result).toHaveProperty('meta');
        expect(result).toHaveProperty('payload');
        expect(result.payload.serviceAccounts).toEqual({
          '107a159b-6bc6-4ad8-989d-0c65433f351d':
            mockServiceBindings.resources[0],
        });
      });
    });
  });

  describe('getOrgAppsPage', () => {
    it('when requests are successful, returns apps and related spaces info', async () => {
      // setup
      nock(process.env.CF_API_URL)
        .get('/apps?organization_guids=org1&include=space&per_page=5000')
        .reply(200, mockApps);

      // act
      const res = await getOrgAppsPage('org1');

      // expect
      expect(res.meta.status).toEqual('success');
      expect(res.payload.apps.length).toEqual(2);
      // check that the spaces have been reorganized by space guid
      expect(
        res.payload.spaces['042655eb-6cea-4fd8-ad8b-d03048f95072']
      ).toBeDefined();
    });
  });

  describe('getOrgUsagePage', () => {
    it('when requests are successful, returns quota, usage, and service info', async () => {
      // setup
      // note, using incomplete json mocks for brevity
      const orgGuid = 'org1';
      const quotaGuid = 'quota1';
      const svcPlanGuid1 = 'servicePlan1';
      const svcPlanGuid2 = 'servicePlan2';
      const mockQuota = {
        resources: [
          {
            guid: quotaGuid,
            relationships: { organizations: { data: [{ guid: orgGuid }] } },
          },
        ],
      };
      const mockUsage = { usage_summary: { routes: 3, memory_in_mb: 3072 } };
      const mockSvcInstances = {
        resources: [
          {
            guid: 'svcinstance1',
            type: 'managed',
            relationships: { service_plan: { data: { guid: svcPlanGuid1 } } },
          },
          {
            guid: 'svcinstance2',
            type: 'managed',
            relationships: { service_plan: { data: { guid: svcPlanGuid2 } } },
          },
        ],
      };
      const mockSvcPlans = {
        resources: [
          { guid: svcPlanGuid1, name: 'micro-psql', free: true },
          { guid: svcPlanGuid2, name: 'mega-psql', free: false },
        ],
      };

      nock(process.env.CF_API_URL)
        .get(`/organization_quotas?organization_guids=${orgGuid}`)
        .reply(200, mockQuota);
      nock(process.env.CF_API_URL)
        .get(`/organizations/${orgGuid}/usage_summary`)
        .reply(200, mockUsage);
      nock(process.env.CF_API_URL)
        .get(`/service_instances?organization_guids=${orgGuid}`)
        .reply(200, mockSvcInstances);
      nock(process.env.CF_API_URL)
        .get(`/service_plans?guids=${svcPlanGuid1},${svcPlanGuid2}`)
        .reply(200, mockSvcPlans);

      // act
      const result = await getOrgUsagePage(orgGuid);

      // expect
      // quota and usage should be single object, instances an array, and plans reorganized by guid
      expect(result.meta.status).toEqual('success');
      expect(result.payload.quota.guid).toEqual(quotaGuid);
      expect(result.payload.usage).toEqual(mockUsage);
      expect(result.payload.services.instances).toEqual(
        mockSvcInstances.resources
      );
      expect(result.payload.services.plans[svcPlanGuid1].name).toEqual(
        'micro-psql'
      );
      expect(result.payload.services.plans[svcPlanGuid2]).toBeDefined();
    });
  });

  describe('getUser', () => {
    const userGuid = 'userGuid';
    describe('if the user is a human account', () => {
      const humanUserRes = {
        guid: userGuid,
        username: 'User 1',
        origin: 'example.com',
      };
      it('should only send one API call and return a user object', async () => {
        // setup
        nock(process.env.CF_API_URL)
          .get(`/users/${userGuid}`)
          .reply(200, humanUserRes);
        // act
        const res = await getUser(userGuid);
        // expect
        expect(res.meta.status).toEqual('success');
        expect(res.payload.user).toEqual(humanUserRes);
        expect(res.payload.serviceAccount).toBeUndefined();
      });
      it('failing requests throw an error', async () => {
        // setup
        nock(process.env.CF_API_URL).get(`/users/${userGuid}`).reply(500);
        // act and expect
        expect(async () => {
          await getUser(userGuid);
        }).rejects.toThrow(new Error('something went wrong with the request'));
      });
    });

    describe('if this is a service account user', () => {
      const identifier = '4d9edb29-94d9-41ff-b2f2-e44b8f7eb73c';
      const nonHumanUserRes = {
        guid: userGuid,
        username: identifier,
        origin: 'uaa',
      };
      const credBindRes = {
        resources: [
          {
            guid: identifier,
            username: 'service account 1',
          },
        ],
      };
      it('should send two requests and return an object with the credential binding', async () => {
        // setup
        nock(process.env.CF_API_URL)
          .get(`/users/${userGuid}`)
          .reply(200, nonHumanUserRes);
        nock(process.env.CF_API_URL)
          .get(`/service_credential_bindings?guids=${identifier}`)
          .reply(200, credBindRes);
        // act
        const res = await getUser(userGuid);
        // expect
        expect(res.meta.status).toEqual('success');
        expect(res.payload.user).toEqual(nonHumanUserRes);
        expect(res.payload.serviceAccount).toEqual(credBindRes.resources[0]);
      });
      it('sends two requests and if the cred lookup fails, returns a user object', async () => {
        // setup
        nock(process.env.CF_API_URL)
          .get(`/users/${userGuid}`)
          .reply(200, nonHumanUserRes);
        nock(process.env.CF_API_URL)
          .get(`/service_credential_bindings?guids=${identifier}`)
          .reply(500);
        // act
        const res = await getUser(userGuid);
        // expect
        expect(res.meta.status).toEqual('success');
        expect(res.payload.user).toEqual(nonHumanUserRes);
        expect(res.payload.serviceAccount).toBeUndefined();
      });
    });
  });

  describe('removeUserFromOrg', () => {
    const mockSpaceRoleGuids = ['foo', 'bar'];
    const mockOrgRoleGuids = ['baz', 'far'];

    describe('if all requests succeed', () => {
      it('returns a success message', async () => {
        // setup
        nock(process.env.CF_API_URL).persist().delete(/roles/).reply(200);
        // act
        const result = await removeUserFromOrg(
          mockSpaceRoleGuids,
          mockOrgRoleGuids
        );
        // expect
        expect(result.meta.status).toEqual('success');
      });
    });

    describe('if one request fails', () => {
      it('returns an error message', async () => {
        // setup
        nock(process.env.CF_API_URL).delete(/roles/).reply(430);
        // act
        const result = await removeUserFromOrg(
          mockSpaceRoleGuids,
          mockOrgRoleGuids
        );
        // expect
        expect(result.meta.status).toEqual('error');
        expect(result.meta.errors.length).toEqual(1);
      });
    });

    describe('if one job polling request fails', () => {
      it('returns an error message', async () => {
        // setup
        nock(process.env.CF_API_URL).persist().delete(/roles/).reply(200);

        pollForJobCompletion.mockImplementation(() => {
          throw new Error('some polling error');
        });
        // act
        const result = await removeUserFromOrg(
          mockSpaceRoleGuids,
          mockOrgRoleGuids
        );
        // expect
        expect(result.meta.status).toEqual('error');
        expect(result.meta.errors.length).toEqual(1);
      });
    });
  });

  describe('getEditOrgRoles', () => {
    const orgGuid = 'foo';
    const userGuid = 'bar';

    it('returns payload on success', async () => {
      // setup
      nock(process.env.CF_API_URL)
        .get(/roles/)
        .reply(200, mockRolesFilteredByOrgAndUser);
      // act
      const result = await getEditOrgRoles(orgGuid, userGuid);
      // assert
      expect(result).toHaveProperty('meta');
      expect(result.meta.status).toEqual('success');
      expect(result).toHaveProperty('payload');
    });

    it('throws an error on failure', async () => {
      // setup
      nock(process.env.CF_API_URL).get(/roles/).reply(403);
      // act/assert
      expect(async () => {
        await getEditOrgRoles(orgGuid, userGuid);
      }).rejects.toThrow(
        new Error(
          'Something went wrong with loading the form. Please try again later.'
        )
      );
    });
  });
});
