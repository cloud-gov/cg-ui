import {
    describe, beforeEach, afterEach, it, expect
}                   from '@jest/globals';
import nock         from 'nock';
import {
    getUsers,
    getUser,
    userDomain,
    allUserRoute,
}                   from './users';
import mockUsers    from './mocks/users';

describe('users api', () => {

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

    describe('getUsers', () => {
        it('throws error if response is 500', async () => {
            nock(userDomain)
                .get(allUserRoute)
                .reply(500);

            try {
                await getUsers();
            } catch (error) {
                expect(error.message).toEqual('an error occurred with response code 500');
            }
        });

        it('returns list of users if response is ok', async () => {
            nock(userDomain)
                .get(allUserRoute)
                .reply(200, mockUsers);

            expect(
                await getUsers()
            ).toEqual(mockUsers);
        });
    });

    describe('getUser', () => {
        it('throws error if response is 500', async () => {
            nock(userDomain)
                .get(allUserRoute + "/1")
                .reply(500);

            try {
                await getUser(1);
            } catch (error) {
                expect(error.message).toEqual('an error occurred with response code 500');
            }
        });

        it('returns the user if response is ok', async () => {
            const mockUser = mockUsers[0];

            nock(userDomain)
                .get(allUserRoute + "/1")
                .reply(200, mockUser);

            expect(
                await getUser(1)
            ).toEqual(mockUser);
        });
    });
});
