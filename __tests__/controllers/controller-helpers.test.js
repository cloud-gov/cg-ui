import { describe, it, expect } from '@jest/globals';
import {
  associateUsersWithOrgAndSpaceRoles,
  associateUsersWithSpaceRoles,
} from '../../controllers/controller-helpers';
import { mockUsersByOrganization, mockUsersBySpace } from '../api/mocks/roles';

describe('controller-helpers', () => {
  describe('associateUsersWithOrgAndSpaceRoles', () => {
    describe('when only receiving an organization result', () => {
      it('returns an array of users with a roles array', () => {
        // act
        const result = associateUsersWithOrgAndSpaceRoles(
          mockUsersByOrganization
        );
        const testUser = result[0];
        // assert
        expect(result.length).toBeGreaterThan(0);
        expect(testUser.guid).toEqual('ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199');
        expect(testUser.origin).toEqual('example.com');
        expect(testUser.username).toEqual('a_user2@example.com');
        expect(testUser.orgRoles).toEqual([
          {
            guid: 'c98f8f55-dc53-498a-bb65-9991ab9f8b78',
            type: 'organization_manager',
          },
        ]);
      });
    });

    describe('when receiving both org and space roles', () => {
      it('returns an array of users with a org and space role arrays', () => {
        // act
        const result = associateUsersWithOrgAndSpaceRoles(
          mockUsersByOrganization,
          mockUsersBySpace
        );
        const testUser = result[1];
        // assert
        expect(result.length).toBeGreaterThan(0);
        expect(testUser.guid).toEqual('73193f8c-e03b-43c8-aeee-8670908899d2');
        expect(testUser.origin).toEqual('example.com');
        expect(testUser.username).toEqual('z_user1@example.com');
        expect(testUser.orgRoles).toEqual([
          {
            guid: 'fb55574d-6b84-405e-b23c-0984f0a0964a',
            type: 'organization_user',
          },
        ]);
        expect(testUser.spaceRoles).toEqual([
          {
            guid: '12ac7aa5-8a8e-48a4-9c90-a3b908c6e702',
            spaceGuid: 'dedb82bb-9f35-49f4-8ff9-7130ae2e3198',
            spaceName: 'Space1',
            type: 'space_manager',
          },
          {
            guid: '1293d5ae-0266-413c-bacf-9f5474be984d',
            spaceGuid: 'dedb82bb-9f35-49f4-8ff9-7130ae2e3198',
            spaceName: 'Space1',
            type: 'space_developer',
          },
        ]);
      });
    });
  });

  describe('associateUsersWithSpaceRoles', () => {
    it('returns an array of users with a space roles array', () => {
      // act
      const result = associateUsersWithSpaceRoles(mockUsersBySpace);
      const testUser = result[0];
      // assert
      expect(result.length).toBeGreaterThan(0);
      expect(testUser.guid).toEqual('73193f8c-e03b-43c8-aeee-8670908899d2');
      expect(testUser.origin).toEqual('example.com');
      expect(testUser.username).toEqual('z_user1@example.com');
      expect(testUser.spaceRoles).toEqual([
        {
          guid: '12ac7aa5-8a8e-48a4-9c90-a3b908c6e702',
          type: 'space_manager',
        },
        {
          guid: '1293d5ae-0266-413c-bacf-9f5474be984d',
          type: 'space_developer',
        },
      ]);
    });
  });
});
