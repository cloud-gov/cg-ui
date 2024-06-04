import { describe, it, expect } from '@jest/globals';
import { associateUsersWithRoles } from '@/controllers/controller-helpers';
import { mockUsersByOrganization, mockUsersBySpace } from '../api/mocks/roles';

describe('controller-helpers', () => {
  describe('associateUsersWithRoles', () => {
    describe('when receiving an organization specific result', () => {
      it('returns a RolesByUser object with only org roles', () => {
        // act
        const result = associateUsersWithRoles(
          mockUsersByOrganization.resources
        );
        const testUser = result['ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199'];
        // assert
        expect(testUser.org[0].guid).toEqual(
          '89c0b2a8-957d-4900-abab-87395efaffdb'
        );
        expect(testUser.org[0].role).toEqual('organization_manager');
        expect(testUser.space).toEqual([]);
      });
    });

    describe('when receiving a space specific result', () => {
      it('returns a RolesByUser object with only space roles', () => {
        // act
        const result = associateUsersWithRoles(mockUsersBySpace.resources);
        const testUser = result['73193f8c-e03b-43c8-aeee-8670908899d2'];
        // assert
        expect(testUser.org).toEqual([]);
        expect(testUser.space[0].guid).toEqual(
          'dedb82bb-9f35-49f4-8ff9-7130ae2e3198'
        );
        expect(testUser.space[0].role).toEqual('space_manager');
      });
    });
  });

  describe('when receiving org and space roles', () => {
    it('returns a RolesByUser object with both org and space roles', () => {
      // act
      const result = associateUsersWithRoles(
        mockUsersBySpace.resources.concat(mockUsersByOrganization.resources)
      );
      const testUser = result['73193f8c-e03b-43c8-aeee-8670908899d2'];

      // assert
      expect(testUser.org).toEqual([
        {
          guid: '89c0b2a8-957d-4900-abab-87395efaffdb',
          role: 'organization_user',
        },
      ]);
      expect(testUser.space).toEqual([
        { guid: 'dedb82bb-9f35-49f4-8ff9-7130ae2e3198', role: 'space_manager' },
        {
          guid: 'dedb82bb-9f35-49f4-8ff9-7130ae2e3198',
          role: 'space_developer',
        },
      ]);
    });
  });
});
