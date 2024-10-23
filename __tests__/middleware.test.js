import { describe, expect, it, beforeAll, afterEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import middleware from '@/middleware.ts';
// Need to disable eslint for this import because
// you need to import the module you're going to mock with Jest
// eslint-disable-next-line no-unused-vars
import { postToAuthTokenUrl } from '@/api/auth';

const mockEmailAddress = 'foo@example.com';
const mockUserName = 'fooUserName';
const mockUserId = 'fooUserId';
const mockAccessToken = jwt.sign(
  {
    email: mockEmailAddress,
    user_name: mockUserName,
    user_id: mockUserId,
  },
  'fooPrivateKey'
);
const mockRefreshToken = 'fooRefreshToken';
const mockExpiry = 43199;
const mockAuthResponse = {
  access_token: mockAccessToken,
  refresh_token: mockRefreshToken,
  expires_in: mockExpiry,
};

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/api/auth', () => ({
  postToAuthTokenUrl: jest.fn(() => mockAuthResponse),
}));
/* eslint no-undef: "error" */

describe('/login', () => {
  // setup
  const request = new NextRequest(
    new URL('/login?state=baz', process.env.ROOT_URL)
  );
  let response;
  beforeAll(async () => {
    // run
    response = await middleware(request);
  });

  it('sets the state cookie', () => {
    expect(response.cookies.get('state')['value']).toBe('baz');
  });

  it('redirects to uaa auth path with proper query params', () => {
    const location = response.headers.get('location');
    expect(location).toMatch(
      process.env.UAA_ROOT_URL + process.env.UAA_AUTH_PATH
    );
    expect(location).toMatch('client_id=');
    expect(location).toMatch('state=baz');
    expect(location).toMatch('response_type=code');
  });
});

describe('auth/login/callback', () => {
  describe('when states do not match', () => {
    it('does not set auth session when states do not match', async () => {
      // setup
      const request = new NextRequest(
        new URL('/auth/login/callback?state=bar', process.env.ROOT_URL)
      );
      request.cookies.set('state', 'foo');
      // run
      const response = await middleware(request);
      // assert
      expect(response.cookies.get('authsession')).toBeUndefined();
    });
  });

  describe('when states match', () => {
    let request;
    let response;
    beforeAll(async () => {
      // setup
      request = new NextRequest(
        new URL('/auth/login/callback?state=foo', process.env.ROOT_URL)
      );
      request.cookies.set('state', 'foo');
      request.cookies.set('last_page', '/bar');
      // run
      response = await middleware(request);
    });

    it('sets the auth session with expected info', async () => {
      const authCookieObj = JSON.parse(
        response.cookies.get('authsession')['value']
      );
      expect(authCookieObj.email).toMatch(mockEmailAddress);
      expect(authCookieObj.user_id).toMatch(mockUserId);
      expect(authCookieObj.user_name).toMatch(mockUserName);
      expect(authCookieObj.accessToken).toMatch(mockAccessToken);
      expect(authCookieObj.refreshToken).toMatch(mockRefreshToken);
      expect(authCookieObj.expiry).toBeDefined();
    });
    it('unsets the state cookie', async () => {
      expect(response.cookies.get('state')['value']).toBe('');
    });
    it('unsets the last page cookie', async () => {
      expect(response.cookies.get('last_page')['value']).toBe('');
    });
    it('redirects back to last page if it exists', () => {
      const location = response.headers.get('location');
      expect(location).toMatch(process.env.ROOT_URL + 'bar');
    });
  });
});

describe('/logout', () => {
  const request = new NextRequest(new URL('/logout', process.env.ROOT_URL));
  let response;

  beforeAll(async () => {
    // setup
    request.cookies.set('authsession', 'foobar');
    expect(request.cookies.get('authsession')['value']).toMatch('foobar');
    // run
    response = await middleware(request);
  });

  it('deletes the auth session cookie', () => {
    expect(response.cookies.get('authsession')['value']).toBe('');
  });

  it('redirects to the logout url with the proper query params', () => {
    const location = response.headers.get('location');
    expect(location).toMatch(
      process.env.UAA_ROOT_URL + process.env.UAA_LOGOUT_PATH
    );
    expect(location).toMatch('client_id=');
    expect(location).toMatch('redirect=');
  });
});

describe('/test/authenticated/:path*', () => {
  describe('when not logged in', () => {
    it('redirects back to homepage', async () => {
      // setup
      const request = new NextRequest(
        new URL('/test/authenticated/example', process.env.ROOT_URL)
      );
      // run
      const response = await middleware(request);
      // assert
      expect(response.headers.get('location')).toContain(process.env.ROOT_URL);
    });
  });

  describe('when auth token is expired', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('refreshes token, then sends you to requested page', async () => {
      // setup
      const request = new NextRequest(
        new URL('/test/authenticated/example', process.env.ROOT_URL)
      );
      request.cookies.set(
        'authsession',
        JSON.stringify({
          access_token: 'oldToken',
          refreshToken: 'fooRefreshToken',
          expiry: Date.now() - 1000,
        })
      );
      const responseSpy = jest.spyOn(NextResponse, 'next');
      // run
      const response = await middleware(request);
      // assert auth cookie is refreshed
      const newAuthCookie = JSON.parse(
        response.cookies.get('authsession')['value']
      );
      expect(newAuthCookie.accessToken).toMatch(mockAuthResponse.access_token);
      // assert passthrough
      expect(responseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when auth token is not expired', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('sends you to requested page', async () => {
      // setup
      const request = new NextRequest(
        new URL('/test/authenticated/example', process.env.ROOT_URL)
      );
      request.cookies.set(
        'authsession',
        JSON.stringify({
          expiry: Date.now() + 10000000,
        })
      );
      const responseSpy = jest.spyOn(NextResponse, 'next');
      // run
      await middleware(request);
      // assert
      expect(responseSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('/orgs/* when logged in', () => {
  describe('when org id is part of url path', () => {
    // setup
    const request = new NextRequest(
      new URL(
        '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd/bar',
        process.env.ROOT_URL
      )
    );
    let response;

    beforeAll(async () => {
      // setup
      request.cookies.set(
        'authsession',
        JSON.stringify({
          expiry: Date.now() + 10000000,
        })
      );
      // run
      response = await middleware(request);
    });

    it('sets lastViewedOrgId cookie as org id', () => {
      // assert
      expect(response.cookies.get('lastViewedOrgId').value).toEqual(
        '470bd8ff-ed0e-4d11-95c4-cf765202cebd'
      );
    });
  });

  describe('when org id is end of url path', () => {
    // setup
    const request = new NextRequest(
      new URL(
        '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd',
        process.env.ROOT_URL
      )
    );
    let response;

    beforeAll(async () => {
      // setup
      request.cookies.set(
        'authsession',
        JSON.stringify({
          expiry: Date.now() + 10000000,
        })
      );
      // run
      response = await middleware(request);
    });

    it('sets lastViewedOrgId cookie as org id', () => {
      // assert
      expect(response.cookies.get('lastViewedOrgId').value).toEqual(
        '470bd8ff-ed0e-4d11-95c4-cf765202cebd'
      );
    });
  });

  describe('when org id is not in url path', () => {
    // setup
    const request = new NextRequest(new URL('/orgs/foo', process.env.ROOT_URL));
    let response;

    beforeAll(async () => {
      // setup
      request.cookies.set(
        'authsession',
        JSON.stringify({
          expiry: Date.now() + 10000000,
        })
      );
      // run
      response = await middleware(request);
    });

    it('does not set lastViewedOrgId cookie', () => {
      // assert
      expect(response.cookies.get('lastViewedOrgId')).toBeUndefined();
    });
  });

  describe('withCSP', () => {
    it('should modify request headers', async () => {
      // setup
      const request = new NextRequest(new URL('/', process.env.ROOT_URL));

      const response = await middleware(request);

      // Assert that the headers were added as expected
      expect(response.headers.get('content-security-policy')).not.toBeNull();
    });
  });
});
