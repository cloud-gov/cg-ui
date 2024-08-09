import { describe, expect, it, afterEach } from '@jest/globals';
import { updateSpaceRolesForUser } from '@/app/orgs/[orgId]/users/[userId]/actions';
import { addRole, deleteRole } from '@/api/cf/cloudfoundry';
import { pollForJobCompletion } from '@/controllers/controller-helpers';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/api/cf/cloudfoundry');
jest.mock('@/controllers/controller-helpers');
/* eslint no-undef: "error" */

const userGuid = 'fooUserGuid';

const rolesState1 = {
  spaceGuid1: {
    space_supporter: {
      type: 'space_supporter',
      selected: false,
    },
    space_auditor: {
      type: 'space_auditor',
      selected: false,
    },
    space_developer: {
      // role to add
      type: 'space_developer',
      selected: true,
    },
    space_manager: {
      // role to remove
      type: 'space_manager',
      guid: 'fooGuid1',
      selected: false,
    },
  },
};

describe('updateSpaceRolesForUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when passed items to change', () => {
    it('calls the appropriate API functions', async () => {
      // setup
      deleteRole.mockImplementation(() => {
        return new Response({}, { headers: { location: 'fooLocation1' } });
      });
      addRole.mockImplementation(() => {
        return new Response({}, { status: 200 });
      });
      pollForJobCompletion.mockImplementation(jest.fn);
      // act
      const response = await updateSpaceRolesForUser(userGuid, rolesState1);
      expect(deleteRole).toHaveBeenCalledTimes(1);
      expect(deleteRole).toHaveBeenCalledWith('fooGuid1');
      expect(pollForJobCompletion).toHaveBeenCalledTimes(1);
      expect(pollForJobCompletion).toHaveBeenCalledWith('fooLocation1');
      expect(addRole).toHaveBeenCalledTimes(1);
      expect(addRole).toHaveBeenCalledWith({
        spaceGuid: 'spaceGuid1',
        roleType: 'space_developer',
        userGuid: userGuid,
      });
      expect(response).toBe(true);
    });
  });
});
