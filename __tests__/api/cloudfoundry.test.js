import nock from 'nock';
import { cookies } from 'next/headers';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  addCFOrgRole,
  deleteCFOrgRole,
  getToken,
  getCFOrg,
  getCFOrgUsers,
  getCFOrgs,
} from '../../api/cloudfoundry';
import {
  mockOrg,
  mockOrgNotFound,
  mockOrgUsers,
  mockOrgs,
} from './mocks/organizations';
import {
  mockRoleCreate,
  mockRoleCreateBadRole,
  mockRoleCreateExisting,
  mockRoleCreateInvalid,
  mockRoleDeleteInvalid,
} from './mocks/roles';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
/* eslint no-undef: "error" */

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

  describe('getCFOrg', () => {
    it('when given a valid org guid, returns a single org', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/validGUID')
        .reply(200, mockOrg);
      const res = await getCFOrg('validGUID');
      expect(res).toEqual(mockOrg);
    });

    it('when given an invalid or unauthorized org guid, throws an error', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/invalidGUID')
        .reply(404, mockOrgNotFound);

      expect(async () => {
        await getCFOrg('invalidGUID');
      }).rejects.toThrow(new Error('an error occurred with response code 404'));
    });
  });

  describe('getCFOrgUsers', () => {
    it('when given a valid org guid, returns associated users', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/validGUID/users')
        .reply(200, mockOrgUsers);
      const res = await getCFOrgUsers('validGUID');
      expect(res).toEqual(mockOrgUsers.resources);
    });

    it('when given an invalid or unauthorized org guid, throws an error', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/invalidGUID/users')
        .reply(404, mockOrgNotFound);

      expect(async () => {
        await getCFOrgUsers('invalidGUID');
      }).rejects.toThrow(new Error('an error occurred with response code 404'));
    });
  });

  describe('get CFOrgs', () => {
    it('returns orgs available to the user', async () => {
      nock(process.env.CF_API_URL).get('/organizations').reply(200, mockOrgs);
      const res = await getCFOrgs();
      expect(res).toEqual(mockOrgs.resources);
    });
  });

  describe('getToken', () => {
    describe('when token environment variable is set', () => {
      beforeEach(() => {
        process.env.CF_API_TOKEN = 'manual-token';
      });
      afterEach(() => {
        delete process.env.CF_API_TOKEN;
      });
      it('returns a manual token', () => {
        expect(getToken()).toBe('manual-token');
      });
    });

    describe('when token environment variable is not set', () => {
      describe('when auth cookie is set', () => {
        beforeEach(() => {
          cookies.mockImplementation(() => ({
            get: () => ({ value: '{"accessToken":"cookie-token"}' }),
          }));
        });
        it('returns a token from a cookie', () => {
          expect(getToken()).toBe('cookie-token');
        });
      });
      describe('when auth cookie is not set', () => {
        beforeEach(() => {
          cookies.mockImplementation(() => ({
            get: () => null,
          }));
        });
        it('throws an error when no cookie is set', () => {
          expect(() => getToken()).toThrow(
            'accessToken not found, please confirm you are logged in'
          );
        });
      });
    });
  });
});
