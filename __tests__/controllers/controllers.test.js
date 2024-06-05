import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  deleteOrgUser,
  getOrgPage,
  getOrgTestPage,
  getSpaceUsers,
} from '@/controllers/controllers';
import { mockOrg } from '@/__tests__/api/mocks/organizations';
import {
  mockRolesFilteredByOrgAndUser,
  mockUsersByOrganization,
  mockUsersBySpace,
} from '@/__tests__/api/mocks/roles';
import { mockSpaces } from '@/__tests__/api/mocks/spaces';
import { mockUaaUsers } from '@/__tests__/api/mocks/uaa-users';

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

describe('controllers tests', () => {
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

    it.todo(
      'when something goes wrong with a request, we should determine what the user sees'
    );
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

    describe('if the CF requests succeed', () => {
      it('returns the expected controller result', async () => {
        // setup
        const orgGuid = 'orgGuid';
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
        nock(process.env.UAA_API_URL).get(/Users/).reply(200, mockUaaUsers);

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
          org: [
            {
              guid: '89c0b2a8-957d-4900-abab-87395efaffdb',
              role: 'organization_user',
            },
          ],
          space: [
            {
              guid: 'dedb82bb-9f35-49f4-8ff9-7130ae2e3198',
              role: 'space_manager',
            },
            {
              guid: 'dedb82bb-9f35-49f4-8ff9-7130ae2e3198',
              role: 'space_developer',
            },
          ],
        });
        expect(
          result.payload.uaaUsers['986e21c9-ed0a-480f-9198-23b9a6720518']
        ).toEqual({
          active: true,
          id: '986e21c9-ed0a-480f-9198-23b9a6720518',
          previousLogonTime: 1717424827664,
          verified: true,
        });
      });
    });
  });

  // TODO delete getOrgTestPage tests after we no longer need the prototype
  // test org detail page
  describe('getOrgTestPage', () => {
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
          await getOrgTestPage(guid);
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
        const result = await getOrgTestPage(guid);
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
