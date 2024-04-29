import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import {
  addCFOrgRole,
  deleteCFOrgRole,
  getCFOrgUsers,
} from '../../../api/cloudfoundry/cloudfoundry';
import { mockOrgNotFound } from '../mocks/organizations';
import {
  mockRoleCreate,
  mockRoleCreateBadRole,
  mockRoleCreateExisting,
  mockRoleCreateInvalid,
  mockRoleDeleteInvalid,
  mockUsersByOrganization,
} from '../mocks/roles';

const reqDataBuilder = function (orgGUID, roleType, username) {
  return {
    type: roleType,
    relationships: {
      user: {
        data: {
          username: username,
        },
      },
      organization: {
        data: {
          guid: orgGUID,
        },
      },
    },
  };
};

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

  describe('getCFOrgUsers', () => {
    it('when given a valid org guid, returns associated users', async () => {
      nock(process.env.CF_API_URL)
        .get('/roles?organization_guids=validGUID&include=user')
        .reply(200, mockUsersByOrganization);
      const res = await getCFOrgUsers('validGUID');

      // getCFOrgUsers should rearrange the roles response to be oriented
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
        },
      };
      expect(res).toEqual(expected);
    });

    it('when given an invalid or unauthorized org guid, throws an error', async () => {
      nock(process.env.CF_API_URL)
        .get('/roles?organization_guids=invalidGUID&include=user')
        .reply(404, mockOrgNotFound);

      expect(async () => {
        await getCFOrgUsers('invalidGUID');
      }).rejects.toThrow(
        new Error(
          'failed to get org user roles an error occurred with response code 404'
        )
      );
    });
  });

  describe('addCFOrgRole', () => {
    it('when given a valid data, returns create message', async () => {
      const reqData = reqDataBuilder(
        'validOrg',
        'organization_user',
        'validUser'
      );
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(201, mockRoleCreate);
      const res = await addCFOrgRole({
        orgGuid: 'validOrg',
        roleType: 'organization_user',
        username: 'validUser',
      });
      expect(res).toEqual(mockRoleCreate);
    });

    it('when given an invalid role type, returns an error message', async () => {
      const reqData = reqDataBuilder('validOrg', 'bad_role', 'validUser');
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(422, mockRoleCreateBadRole);
      const res = await addCFOrgRole({
        orgGuid: 'validOrg',
        roleType: 'bad_role',
        username: 'validUser',
      });
      expect(res).toEqual(mockRoleCreateBadRole);
    });

    it('when the role already exists, returns error message', async () => {
      const reqData = reqDataBuilder(
        'validOrg',
        'organization_user',
        'validUser'
      );
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(422, mockRoleCreateExisting);
      const res = await addCFOrgRole({
        orgGuid: 'validOrg',
        roleType: 'organization_user',
        username: 'validUser',
      });
      expect(res).toEqual(mockRoleCreateExisting);
    });

    it('when given a nonexistent user, returns error message', async () => {
      const reqData = reqDataBuilder(
        'validOrg',
        'organization_user',
        'invalidUser'
      );
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(422, mockRoleCreateInvalid);
      const res = await addCFOrgRole({
        orgGuid: 'validOrg',
        roleType: 'organization_user',
        username: 'invalidUser',
      });
      expect(res).toEqual(mockRoleCreateInvalid);
    });
  });

  describe('deleteCFOrgRole', () => {
    it('when given a valid role, returns true', async () => {
      nock(process.env.CF_API_URL).delete('/roles/validGUID').reply(202);
      const res = await deleteCFOrgRole('validGUID');
      expect(res).toBeTruthy();
    });

    it('when given an invalid role guid, throws an error', async () => {
      nock(process.env.CF_API_URL)
        .delete('/roles/invalidGUID')
        .reply(404, mockRoleDeleteInvalid);

      expect(async () => {
        await deleteCFOrgRole('invalidGUID');
      }).rejects.toThrow(
        new Error(
          'failed to remove user from org: an error occurred with response code 404'
        )
      );
    });
  });
});
