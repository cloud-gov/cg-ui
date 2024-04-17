import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getToken } from './cloudfoundry';

// Need to disable eslint for this import because
// you need to import the module you're going to mock with Jest
// eslint-disable-next-line no-unused-vars
import { cookies } from 'next/headers';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('next/headers', () => {
  return {
    cookies: () => {
      return {
        get: () => {
          return {
            value: '{"accessToken":"cookie-token"}'
          };
        },
      };
    },
  };
});
/* eslint no-undef: "error" */

describe('cloudfoundry tests', () => {
  describe('token', () => {
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
      it('returns a token from a cookie', () => {
        expect(getToken()).toBe('cookie-token');
      });
      it.todo('throws an error when no cookie is set');
    })
  });
});
