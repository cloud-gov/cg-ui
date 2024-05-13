import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import nock from 'nock';
import { postToAuthTokenUrl } from '@api/auth';

describe('auth api', () => {
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

  describe('postToAuthTokenUrl', () => {
    const payload = {
      code: 'foobar',
      grant_type: 'authorization_code',
      response_type: 'token',
      client_id: 'foo_client_id',
      client_secret: 'foo_client_secret',
    };

    describe('on generic request error', () => {
      it("throws an error with error's message", async () => {
        // setup
        nock(process.env.UAA_ROOT_URL)
          .post(process.env.UAA_TOKEN_PATH)
          .replyWithError('something bad happened');
        // assert
        await expect(postToAuthTokenUrl(payload)).rejects.toThrow(
          'something bad happened'
        );
      });
    });

    describe('on unsuccessful response', () => {
      it('throws an error with response code', async () => {
        // setup
        nock(process.env.UAA_ROOT_URL)
          .post(process.env.UAA_TOKEN_PATH)
          .reply(500, {
            error: 'foo_code',
            error_description: 'foo description',
          });
        // assert
        await expect(postToAuthTokenUrl(payload)).rejects.toThrow(
          'an error occurred with response code 500'
        );
      });
    });
    describe('on request success', () => {
      it('returns the json response', async () => {
        // setup
        nock(process.env.UAA_ROOT_URL)
          .post(process.env.UAA_TOKEN_PATH)
          .reply(200, { foo: 'bar' });
        // run
        const response = await postToAuthTokenUrl(payload);

        expect(response.foo).toEqual('bar');
      });
    });
  });
});
