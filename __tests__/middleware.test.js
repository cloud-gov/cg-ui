import { describe, expect, it, beforeAll, afterEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { middleware } from '../middleware.js';
// Need to disable eslint for this import because
// you need to import the module you're going to mock with Jest
// eslint-disable-next-line no-unused-vars
import { postToAuthTokenUrl } from '@/api/auth';

const mockEmailAddress = 'foo@example.com';
const mockAccessToken = jwt.sign({ email: mockEmailAddress }, 'fooPrivateKey');
const mockRefreshToken = 'fooRefreshToken';
const mockExpiry = 43199;
const mockAuthResponse = {
  access_token: mockAccessToken,
  refresh_token: mockRefreshToken,
  expires_in: mockExpiry,
};

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../api/auth', () => ({
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
      // run
      response = await middleware(request);
    });

    it('sets the auth session with expected info', async () => {
      const authCookieObj = JSON.parse(
        response.cookies.get('authsession')['value']
      );
      expect(authCookieObj.email).toMatch(mockEmailAddress);
      expect(authCookieObj.accessToken).toMatch(mockAccessToken);
      expect(authCookieObj.refreshToken).toMatch(mockRefreshToken);
      expect(authCookieObj.expiry).toBeDefined();
    });
    it('unsets the state cookie', async () => {
      expect(response.cookies.get('state')['value']).toBe('');
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

describe('/authenticated/:path*', () => {
  describe('when not logged in', () => {
    it('redirects back to homepage', async () => {
      // setup
      const request = new NextRequest(
        new URL('/authenticated/example', process.env.ROOT_URL)
      );
      // run
      const response = await middleware(request);
      // assert
      expect(response.headers.get('location')).toBe(process.env.ROOT_URL);
    });
  });

  describe('when auth token is expired', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('refreshes token, then sends you to requested page', async () => {
      // setup
      const request = new NextRequest(
        new URL('/authenticated/example', process.env.ROOT_URL)
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
        new URL('/authenticated/example', process.env.ROOT_URL)
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
