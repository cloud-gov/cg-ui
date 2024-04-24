import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { addCFOrgRole, deleteCFOrgRole } from '../../../api/cloudfoundry';
import {
  mockRoleCreate,
  mockRoleCreateBadRole,
  mockRoleCreateExisting,
  mockRoleCreateInvalid,
  mockRoleDeleteInvalid,
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
      expect(async () => {
        await addCFOrgRole({
          orgGuid: 'validOrg',
          roleType: 'bad_role',
          username: 'validUser',
        });
      }).rejects.toThrow(
        new Error(
          'failed to add user to org: an error occurred with response code 422'
        )
      );
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
      expect(async () => {
        await addCFOrgRole({
          orgGuid: 'validOrg',
          roleType: 'organization_user',
          username: 'validUser',
        });
      }).rejects.toThrow(
        new Error(
          'failed to add user to org: an error occurred with response code 422'
        )
      );
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
      expect(async () => {
        await addCFOrgRole({
          orgGuid: 'validOrg',
          roleType: 'organization_user',
          username: 'invalidUser',
        });
      }).rejects.toThrow(
        new Error(
          'failed to add user to org: an error occurred with response code 422'
        )
      );
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
