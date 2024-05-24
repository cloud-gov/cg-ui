import { describe, it, expect } from '@jest/globals';
import { associateUsersWithRoles } from '../../controllers/controller-helpers';
import { mockUsersByOrganization } from '../api/mocks/roles';

describe('associateUsersWithRoles', () => {
  it('returns an array of users with a roles array', () => {
    // act
    const result = associateUsersWithRoles(mockUsersByOrganization);
    const testUser = result[0];
    // assert
    expect(result.length).toBeGreaterThan(0);
    expect(testUser.guid).toEqual('ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199');
    expect(testUser.origin).toEqual('example.com');
    expect(testUser.username).toEqual('a_user2@example.com');
    expect(testUser.roles).toEqual([
      {
        guid: 'c98f8f55-dc53-498a-bb65-9991ab9f8b78',
        type: 'organization_manager',
      },
    ]);
  });
});
