import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  getEditOrgRoles,
  getOrgPage,
  getOrgAppsPage,
  getOrgUsagePage,
  removeUserFromOrg,
} from '@/controllers/controllers';
import { pollForJobCompletion } from '@/controllers/controller-helpers';
import { mockApps } from '@/__tests__/api/mocks/apps';
import {
  mockRolesFilteredByOrgAndUser,
  mockUsersByOrganization,
  mockUsersBySpace,
} from '@/__tests__/api/mocks/roles';
import { getUserLogonInfo } from '@/api/aws/s3';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../controllers/controller-helpers', () => ({
  ...jest.requireActual('../../controllers/controller-helpers'),
  pollForJobCompletion: jest.fn(),
}));
jest.mock('../../api/aws/s3', () => ({
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
