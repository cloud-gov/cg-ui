import nock         from 'nock';
import { getData }  from './api';
import mockUsers    from './mocks/users';

describe('api tests', () => {

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
        const scope = nock('http://example.com')
            .get('/error')
            .reply(500);

        try {
            await getData('http://example.com/error');
        } catch (error) {
            expect(error.message).toEqual('an error occurred with response code 500');
        }
    });

    test('returns json if response is ok', async () => {
        const scope = nock('http://example.com')
            .get('/success')
            .reply(200, mockUsers);

        expect(
            await getData('http://example.com/success')
        ).toEqual(mockUsers);
    });
});
