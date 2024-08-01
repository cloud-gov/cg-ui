import { describe, expect, it, afterEach } from '@jest/globals';
import { addUserToOrg } from '@/app/orgs/[orgId]/users/add/actions';
import { addRole } from '@/api/cf/cloudfoundry';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../../../../src/api/cf/cloudfoundry');
/* eslint no-undef: "error" */

describe('addUserToOrg', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when no email is found', () => {
    it('returns an error controller result', async () => {
      // setup
      const formData = new FormData();
      // act
      const response = await addUserToOrg(formData);
      const resJson = JSON.parse(response);
      // expect
      expect(resJson.meta.status).toEqual('error');
      expect(resJson.meta.errors[0]).toEqual(
        'No email found. Please enter a valid email and try again.'
      );
    });
  });
  describe('when email is invalid', () => {
    it('returns an error controller result', async () => {
      // setup
      const formData = new FormData();
      formData.append('add-user-to-org-form-email', 'foo');
      // act
      const response = await addUserToOrg(formData);
      const resJson = JSON.parse(response);
      // expect
      expect(resJson.meta.status).toEqual('error');
      expect(resJson.meta.errors[0]).toEqual(
        'Email is missing an "@". Please enter a valid email and try again.'
      );
    });
  });
  describe('when API response is not okay', () => {
    it('returns an error controller result', async () => {
      // setup
      const resBody = JSON.stringify({
        errors: [
          {
            detail:
              "user 'foo@bar.gov' already has 'organization_user' role in organization 'foo-org'",
          },
        ],
      });
      addRole.mockImplementation(() => {
        return new Response(resBody, { status: 422 });
      });
      const formData = new FormData();
      formData.append('add-user-to-org-form-email', 'foo@bar.gov');
      formData.append('add-user-to-org-form-org', 'fooOrgId');
      // act
      const response = await addUserToOrg(formData);
      const resJson = JSON.parse(response);
      // expect
      expect(resJson.meta.status).toEqual('error');
      expect(resJson.meta.errors[0]).toEqual(
        "user 'foo@bar.gov' already belongs to organization 'foo-org'"
      );
    });
  });
  describe('when API response is okay', () => {
    it('returns a success controller result with user id in the payload', async () => {
      // setup
      const resBody = JSON.stringify({
        relationships: {
          user: {
            data: {
              guid: 'fooUserId',
            },
          },
        },
      });
      addRole.mockImplementation(() => {
        return new Response(resBody, { status: 201 });
      });
      const formData = new FormData();
      formData.append('add-user-to-org-form-email', 'foo@bar.gov');
      formData.append('add-user-to-org-form-org', 'fooOrgId');
      // act
      const response = await addUserToOrg(formData);
      const resJson = JSON.parse(response);
      // expect
      expect(resJson.meta.status).toEqual('success');
      expect(resJson.payload.userId).toEqual('fooUserId');
    });
  });
});
