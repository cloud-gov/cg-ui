import nock         from 'nock';
import {
    getUsers,
    userDomain,
    allUserRoute,
}                   from './users';
import userMocks    from './mocks/users';

describe('users api tests', () => {

    beforeAll(() => {
        nock.disableNetConnect();
    });

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

    test('throws error if response is 500', async () => {
        const scope = nock(userDomain)
            .get(allUserRoute)
            .reply(500);

        try {
            await getUsers();
        } catch (error) {
            expect(error.message).toEqual('an error occurred with response code 500');
        }
    });

    test('returns list of users if response is ok', async () => {
        const scope = nock(userDomain)
            .get(allUserRoute)
            .reply(200, userMocks);

        expect(
            await getUsers()
        ).toEqual(userMocks);
    });
});
