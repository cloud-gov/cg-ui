import { cookies } from 'next/headers';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getToken, isLoggedIn, getUserId } from '@/api/cf/token';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('cloudfoundry token tests', () => {
  describe('when token environment variable is set', () => {
    beforeEach(() => {
      process.env.CF_API_TOKEN = 'manual-token';
    });
    afterEach(() => {
      delete process.env.CF_API_TOKEN;
    });
    it('getToken() returns a manual token', async () => {
      expect(await getToken()).toBe('manual-token');
    });
  });

  describe('when token environment variable is not set', () => {
    describe('when auth cookie is set', () => {
      beforeEach(() => {
        cookies.mockImplementation(() => ({
          get: () => ({ value: '{"accessToken":"cookie-token"}' }),
        }));
      });
      it('getToken() returns a token from a cookie', async () => {
        expect(await getToken()).toBe('cookie-token');
      });
      it('isLoggedIn() returns true', async () => {
        expect(await isLoggedIn()).toBeTruthy();
      });
    });
    describe('when auth cookie is not set', () => {
      beforeEach(() => {
        cookies.mockImplementation(async () => ({
          get: () => undefined,
        }));
      });
      it('getToken() throws an error when no cookie is set', async () => {
        expect(await getToken()).toThrow('please confirm you are logged in');
      });
      it('isLoggedIn() returns false', async () => {
        expect(await isLoggedIn()).toBeFalsy();
      });
    });
    describe('when auth cookie is not in an expected format', () => {
      beforeEach(() => {
        cookies.mockImplementation(() => ({
          get: () => 'unexpected format',
        }));
      });
      it('getToken() throws an error', async () => {
        expect(await getToken()).toThrow('unable to parse accessToken');
      });
      it('isLoggedIn() returns falsee', async () => {
        expect(await isLoggedIn()).toBeFalsy();
      });
    });
  });
});

describe('cloudfoundry user id tests', () => {
  describe('when CF_USER_ID environment variable is set', () => {
    beforeEach(() => {
      process.env.CF_USER_ID = 'foo-user-id';
    });
    afterEach(() => {
      delete process.env.CF_USER_ID;
    });
    it('getUserId() returns a manual token', async () => {
      expect(await getUserId()).toBe('foo-user-id');
    });
  });

  describe('when CF_USER_ID environment variable is not set', () => {
    describe('when auth cookie is set', () => {
      beforeEach(() => {
        cookies.mockImplementation(() => ({
          get: () => ({ value: '{"user_id":"foo-user-id"}' }),
        }));
      });
      it('getUserId() returns a token from a cookie', async () => {
        expect(await getUserId()).toBe('foo-user-id');
      });
    });
    describe('when auth cookie is not set', () => {
      beforeEach(() => {
        cookies.mockImplementation(async () => ({
          get: () => undefined,
        }));
      });
      it.only('getToken() throws an error when no cookie is set', async () => {
        expect(await getUserId()).toThrow('please confirm you are logged in');
      });
    });
    describe('when auth cookie is not in an expected format', () => {
      beforeEach(() => {
        cookies.mockImplementation(() => ({
          get: () => 'unexpected format',
        }));
      });
      it('getToken() throws an error', async () => {
        expect(await getUserId()).toThrow(
          'unable to parse authsession user_id'
        );
      });
    });
  });
});
