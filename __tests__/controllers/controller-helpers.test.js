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
        const result = associateUsersWithRoles(mockUsersBySpace.resources);
        const testUser = result['73193f8c-e03b-43c8-aeee-8670908899d2'];
        // assert
        expect(testUser.org).toEqual([]);
        expect(
          testUser.space['dedb82bb-9f35-49f4-8ff9-7130ae2e3198'][0].guid
        ).toEqual('dedb82bb-9f35-49f4-8ff9-7130ae2e3198');
        expect(
          testUser.space['dedb82bb-9f35-49f4-8ff9-7130ae2e3198'][0].role
        ).toEqual('space_developer');
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
              guid: 'dedb82bb-9f35-49f4-8ff9-7130ae2e3198',
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
