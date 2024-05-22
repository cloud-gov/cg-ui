import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  deleteOrgUser,
  getOrgUsers,
  getSpaceUsers,
  getOrgPage,
} from '../../controllers/controllers';
import { mockOrg, mockOrgNotFound } from '../api/mocks/organizations';
import {
  mockRolesFilteredByOrgAndUser,
  mockUsersByOrganization,
  mockUsersBySpace,
} from '../api/mocks/roles';
import { mockSpaces } from '../api/mocks/spaces';

describe('controllers tests', () => {
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

  describe('getOrgUsers', () => {
    it('when given a valid org guid, returns associated users', async () => {
      nock(process.env.CF_API_URL)
        .get('/roles?organization_guids=validGUID&include=user&per_page=5000')
        .reply(200, mockUsersByOrganization);
      const res = await getOrgUsers('validGUID');

      // getOrgUsers should rearrange the roles response to be oriented
      // around the users
      const expected = [
        {
          guid: 'ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199',
          origin: 'example.com',
          roles: [
            {
              guid: 'c98f8f55-dc53-498a-bb65-9991ab9f8b78',
              type: 'organization_manager',
            },
          ],
          username: 'a_user2@example.com',
        },
        {
          guid: '73193f8c-e03b-43c8-aeee-8670908899d2',
          origin: 'example.com',
          roles: [
            {
              guid: 'fb55574d-6b84-405e-b23c-0984f0a0964a',
              type: 'organization_user',
            },
          ],
          username: 'z_user1@example.com',
        },
      ];
      expect(res.payload).toEqual(expected);
    });

    it('when given an invalid or unauthorized org guid, returns an error message', async () => {
      nock(process.env.CF_API_URL)
        .get('/roles?organization_guids=invalidGUID&include=user&per_page=5000')
        .reply(404, mockOrgNotFound);

      expect(async () => {
        await getOrgUsers('invalidGUID');
      }).rejects.toThrow(
        new Error('unable to list the org users: problem with getRoles 404')
      );
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
          guid: 'c0a41062-2df2-41d9-9995-50c5eb6c9a18',
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
          username: 'user1@example.com',
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
