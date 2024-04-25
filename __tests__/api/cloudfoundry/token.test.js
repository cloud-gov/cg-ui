import { cookies } from 'next/headers';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getToken } from '../../../api/cloudfoundry/token';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('cloudfoundry token tests', () => {
  describe('getToken', () => {
    describe('when token environment variable is set', () => {
      beforeEach(() => {
        process.env.CF_API_TOKEN = 'manual-token';
      });
      afterEach(() => {
        delete process.env.CF_API_TOKEN;
      });
      it('returns a manual token', () => {
        expect(getToken()).toBe('manual-token');
      });
    });

    describe('when token environment variable is not set', () => {
      describe('when auth cookie is set', () => {
        beforeEach(() => {
          cookies.mockImplementation(() => ({
            get: () => ({ value: '{"accessToken":"cookie-token"}' }),
          }));
        });
        it('returns a token from a cookie', () => {
          expect(getToken()).toBe('cookie-token');
        });
      });
      describe('when auth cookie is not set', () => {
        beforeEach(() => {
          cookies.mockImplementation(() => ({
            get: () => null,
          }));
        });
        it('throws an error when no cookie is set', () => {
          expect(() => getToken()).toThrow(
            'accessToken not found, please confirm you are logged in'
          );
        });
      });
    });
  });
});
