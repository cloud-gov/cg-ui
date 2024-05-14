import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { addRole, deleteRole } from '@/api/cf/cloudfoundry';
import {
  mockRoleCreate,
  mockRoleCreateBadRole,
  mockRoleCreateExisting,
  mockRoleCreateInvalid,
  mockRoleDeleteInvalid,
} from '@/mocks/roles';

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

  describe('addRole', () => {
    it('when given a valid org, user, and role type, returns create message', async () => {
      const reqData = reqDataBuilder(
        'validOrg',
        'organization_user',
        'validUser'
      );
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(201, mockRoleCreate);
      const res = await addRole({
        orgGuid: 'validOrg',
        roleType: 'organization_user',
        username: 'validUser',
      });
      expect(await res.json()).toEqual(mockRoleCreate);
    });

    it('when given an invalid role type, returns an error message', async () => {
      const reqData = reqDataBuilder('validOrg', 'bad_role', 'validUser');
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(422, mockRoleCreateBadRole);
      const res = await addRole({
        orgGuid: 'validOrg',
        roleType: 'bad_role',
        username: 'validUser',
      });
      expect(res.status).toEqual(422);
      expect(await res.json()).toEqual(mockRoleCreateBadRole);
    });

    it('when the role already exists, returns error message', async () => {
      const reqData = reqDataBuilder(
        'Org1',
        'organization_user',
        'existing@example.com'
      );
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(422, mockRoleCreateExisting);
      const res = await addRole({
        orgGuid: 'Org1',
        roleType: 'organization_user',
        username: 'existing@example.com',
      });
      expect(res.status).toEqual(422);
      expect(await res.json()).toEqual(mockRoleCreateExisting);
    });

    it('when given a nonexistent user, returns error message', async () => {
      const reqData = reqDataBuilder(
        'validOrg',
        'organization_user',
        'fake@example.com'
      );
      nock(process.env.CF_API_URL)
        .post('/roles', reqData)
        .reply(422, mockRoleCreateInvalid);
      const res = await addRole({
        orgGuid: 'validOrg',
        roleType: 'organization_user',
        username: 'fake@example.com',
      });
      expect(res.status).toEqual(422);
      expect(await res.json()).toEqual(mockRoleCreateInvalid);
    });
  });

  describe('deleteRole', () => {
    it('when given a valid role, returns true', async () => {
      nock(process.env.CF_API_URL).delete('/roles/validGUID').reply(202);
      const res = await deleteRole('validGUID');
      expect(res.status).toEqual(202);
    });

    it('when given an invalid role guid, returns an error message', async () => {
      nock(process.env.CF_API_URL)
        .delete('/roles/invalidGUID')
        .reply(404, mockRoleDeleteInvalid);

      const res = await deleteRole('invalidGUID');
      expect(res.status).toEqual(404);
      expect(await res.json()).toEqual(mockRoleDeleteInvalid);
    });
  });

  describe('getRoles', () => {
    it.todo('returns an unfiltered list of roles');
    it.todo('when given an org and user filter, returns a list of roles');
  });
});
