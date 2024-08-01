import { describe, expect, it, afterEach } from '@jest/globals';
import { updateOrgRolesForUser } from '@/app/orgs/[orgId]/users/[userId]/org-roles/actions';
import { addRole, deleteRole } from '@/api/cf/cloudfoundry';
import { pollForJobCompletion } from '@/controllers/controller-helpers';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../../../../../src/api/cf/cloudfoundry');
jest.mock('../../../../../../../src/controllers/controller-helpers');
/* eslint no-undef: "error" */

const userGuid = 'fooUserGuid';
const orgGuid = 'fooOrgGuid';

describe('edit org roles actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateOrgRolesForUser', () => {
    describe('when passed items to remove', () => {
      it('calls deletion functions and returns true', async () => {
        // setup
        const roles = {
          organization_user: {
            type: 'organization_user',
            selected: false,
          },
          organization_billing_manager: {
            type: 'organization_billing_manager',
            selected: false,
          },
          // we want to remove organization_manager, because it has a guid and is unselected
          organization_manager: {
            type: 'organization_manager',
            selected: false,
            guid: 'fooGuid',
          },
        };
        deleteRole.mockImplementation(() => {
          return new Response({}, { headers: { location: 'fooLocation' } });
        });
        pollForJobCompletion.mockImplementation(jest.fn);
        addRole.mockImplementation(jest.fn);
        // act
        const response = await updateOrgRolesForUser(userGuid, orgGuid, roles);
        // expect delete to be called once
        expect(deleteRole).toHaveBeenCalledTimes(1);
        expect(pollForJobCompletion).toHaveBeenCalled();
        expect(addRole).not.toHaveBeenCalled();
        expect(response).toBe(true);
      });
    });

    describe('when passed items to add', () => {
      it('calls add functions and returns true', async () => {
        // setup
        const roles = {
          organization_user: {
            type: 'organization_user',
            selected: false,
          },
          // we want to skip billing manager because it is selected and already has a guid
          organization_billing_manager: {
            type: 'organization_billing_manager',
            selected: true,
            guid: 'fooGuid2',
          },
          // we want to add organization_manager, because it is selected and has no guid
          organization_manager: {
            type: 'organization_manager',
            selected: true,
          },
        };
        deleteRole.mockImplementation(jest.fn);
        pollForJobCompletion.mockImplementation(jest.fn);
        addRole.mockImplementation(() => {
          return new Response({}, { status: 200 });
        });
        // act
        const response = await updateOrgRolesForUser(userGuid, orgGuid, roles);
        // expect addRole to be called once
        expect(deleteRole).not.toHaveBeenCalled();
        expect(pollForJobCompletion).not.toHaveBeenCalled();
        expect(addRole).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
      });
    });

    describe('when any response is not 200', () => {
      it('throws an error', async () => {
        // setup
        // we want to add this role because it is selected
        const roles = {
          organization_manager: {
            type: 'organization_manager',
            selected: true,
          },
        };
        deleteRole.mockImplementation(jest.fn);
        pollForJobCompletion.mockImplementation(jest.fn);
        addRole.mockImplementation(() => {
          return new Response({}, { status: 422 });
        });
        // act/expect
        expect(async () => {
          await updateOrgRolesForUser(userGuid, orgGuid, roles);
        }).rejects.toThrow(
          new Error('Unable to edit org role. Please try again.')
        );
      });
    });
  });
});
