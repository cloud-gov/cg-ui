import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  associateUsersWithRoles,
  pollForJobCompletion,
} from '@/controllers/controller-helpers';
import { mockUsersByOrganization, mockUsersBySpace } from '../api/mocks/roles';
import nock from 'nock';

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
        expect(testUser.space).toEqual({});
      });
    });

    describe('when receiving a space specific result', () => {
      it('returns an array of RolesByUser objects with only space roles', () => {
        // act
        const usersBySpaceRes = {
          resources: [
            {
              guid: 'role1',
              type: 'space_manager',
              relationships: {
                user: {
                  data: {
                    guid: 'user1',
                  },
                },
                space: {
                  data: {
                    guid: 'space1',
                  },
                },
                organization: {
                  data: null,
                },
              },
            },
            {
              guid: 'role2',
              type: 'space_developer',
              relationships: {
                user: {
                  data: {
                    guid: 'user1',
                  },
                },
                space: {
                  data: {
                    guid: 'space1',
                  },
                },
                organization: {
                  data: null,
                },
              },
            },
          ],
        };
        const result = associateUsersWithRoles(usersBySpaceRes.resources);
        const testUser = result['user1'];
        // assert
        expect(testUser.org).toEqual([]);
        expect(testUser.space['space1']).toEqual([
          {
            guid: 'role1',
            role: 'space_manager',
          },
          {
            guid: 'role2',
            role: 'space_developer',
          },
        ]);
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
        expect(testUser.space).toEqual({
          'dedb82bb-9f35-49f4-8ff9-7130ae2e3198': [
            {
              guid: '12ac7aa5-8a8e-48a4-9c90-a3b908c6e702',
              role: 'space_manager',
            },
            {
              guid: '1293d5ae-0266-413c-bacf-9f5474be984d',
              role: 'space_developer',
            },
          ],
        });
      });
    });
  });

  describe('pollForJobCompletion', () => {
    it('returns when job completes', async () => {
      // setup
      const domain = 'http://example.com';
      const path = '/jobs/foo';
      nock(domain).get(path).reply(200, { state: 'COMPLETE' });
      // act
      const result = await pollForJobCompletion(domain + path);
      // expect
      expect(result).not.toBeDefined(); // recursion just completes
    });

    it('throws an error if job fails', async () => {
      // setup
      const domain = 'http://example.com';
      const path = '/jobs/foo';
      nock(domain).get(path).reply(200, { state: 'FAILED' });
      // act, expect
      expect(async () => {
        await pollForJobCompletion(domain + path);
      }).rejects.toThrow('a CF job failed');
    });

    it('keeps polling if job is still pending', async () => {
      // setup
      const domain = 'http://example.com';
      const path = '/jobs/foo';
      nock(domain)
        .get(path)
        .reply(200, { state: 'PENDING' })
        .get(path)
        .reply(200, { state: 'PENDING' })
        .get(path)
        .reply(200, { state: 'COMPLETE' });
      // act
      const result = await pollForJobCompletion(domain + path);
      // expect
      expect(result).not.toBeDefined(); // recursion just completes
    });
  });
});
