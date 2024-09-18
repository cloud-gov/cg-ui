import { describe, it, expect, afterEach } from '@jest/globals';
import { cfRequest } from '@/api/cf/cloudfoundry-helpers';
import { request } from '@/api/api';
import { redirect } from 'next/navigation';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/api/api');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
/* eslint no-undef: "error" */

afterEach(() => {
  jest.clearAllMocks();
});

// this test is in its own file because of difficulties mocking request and
// the api file without interfering with other tests calling the original function
describe('cloudfoundry tests', () => {
  describe('cfRequest', () => {
    it('when a request returns a 401 response, it should redirect to login route', async () => {
      request.mockImplementation(() => ({
        status: 401,
      }));

      await cfRequest('/foobar');

      expect(redirect).toHaveBeenCalledTimes(1);
    });

    it('when a request returns not a 401 response, it returns the response', async () => {
      const mockResponse = {
        status: 200,
      };
      request.mockImplementation(() => mockResponse);

      const res = await cfRequest('/foobar');

      expect(redirect).not.toHaveBeenCalled();
      expect(res).toBe(mockResponse);
    });
  });
});
