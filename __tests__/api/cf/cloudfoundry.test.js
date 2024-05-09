import nock from 'nock';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { deleteOrgUser, getOrg, getOrgs } from '../../../api/cf/cloudfoundry';
import { mockOrg, mockOrgs, mockOrgNotFound } from '../mocks/organizations';
import { mockRolesFilteredByOrgAndUser } from '../mocks/roles';

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
        errors: [],
        messages: ['Accepted', 'Accepted'],
      });
    });

    it.todo(
      'when something goes wrong with a request, we should determine what the user sees'
    );
  });

  describe('getOrg', () => {
    it('when given a valid org guid, returns a single org', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/validGUID')
        .reply(200, mockOrg);
      const res = await getOrg('validGUID');
      expect(res).toEqual({
        statusCode: 200,
        errors: [],
        messages: ['OK'],
        body: mockOrg,
      });
    });

    it('when given an invalid or unauthorized org guid, throws an error', async () => {
      nock(process.env.CF_API_URL)
        .get('/organizations/invalidGUID')
        .reply(404, mockOrgNotFound);

      const res = await getOrg('invalidGUID');
      expect(res).toEqual({
        statusCode: 404,
        errors: ['Not Found'],
        messages: [],
        body: undefined,
      });
    });
  });

  describe('getOrgs', () => {
    it('returns orgs available to the user', async () => {
      nock(process.env.CF_API_URL).get('/organizations').reply(200, mockOrgs);
      const res = await getOrgs();
      expect(res).toEqual({
        statusCode: 200,
        errors: [],
        messages: ['OK'],
        body: mockOrgs,
      });
    });
  });
});
