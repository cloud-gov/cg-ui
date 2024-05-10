import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { deleteOrgUser, getOrgUsers } from '../../controllers/controllers';
import { mockOrgNotFound } from '../api/mocks/organizations';
import {
  mockRolesFilteredByOrgAndUser,
  mockUsersByOrganization,
} from '../api/mocks/roles';

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
        .get('/roles?organization_guids=orgGuid&user_guids=userGuid')
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
        message: 'removed userGuid from org',
      });
    });

    it.todo(
      'when something goes wrong with a request, we should determine what the user sees'
    );
  });

  describe('getOrgUsers', () => {
    it('when given a valid org guid, returns associated users', async () => {
      nock(process.env.CF_API_URL)
        .get('/roles?organization_guids=validGUID&include=user')
        .reply(200, mockUsersByOrganization);
      const res = await getOrgUsers('validGUID');

      // getOrgUsers should rearrange the roles response to be oriented
      // around the users
      const expected = {
        '73193f8c-e03b-43c8-aeee-8670908899d2': {
          origin: 'example.com',
          roles: [
            {
              guid: 'fb55574d-6b84-405e-b23c-0984f0a0964a',
              type: 'organization_user',
            },
          ],
          username: 'user1@example.com',
          displayName: 'User1 Example',
        },
        'ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199': {
          origin: 'example.com',
          roles: [
            {
              guid: 'c98f8f55-dc53-498a-bb65-9991ab9f8b78',
              type: 'organization_manager',
            },
          ],
          username: 'user2@example.com',
          displayName: 'User2 Example',
        },
      };
      expect(res.payload).toEqual(expected);
    });

    it('when given an invalid or unauthorized org guid, returns an error message', async () => {
      nock(process.env.CF_API_URL)
        .get('/roles?organization_guids=invalidGUID&include=user')
        .reply(404, mockOrgNotFound);

      expect(async () => {
        await getOrgUsers('invalidGUID');
      }).rejects.toThrow(
        new Error('unable to list the org users: problem with getRoles 404')
      );
    });
  });
});
