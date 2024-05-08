import { describe, it, expect } from '@jest/globals';
import { cfRequest } from '../../../api/cloudfoundry/cloudfoundry';
import { request } from '../../../api/api';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../api/api');
/* eslint no-undef: "error" */

// this test is in its own file because of difficulties mocking request and
// the api file without interfering with other tests calling the original function
describe('cloudfoundry tests', () => {
  describe('cfRequest', () => {
    it('when an api request throws an error, catches and returns as ApiResponse object', async () => {
      // make sure that the console.error isn't what is caught up by this test
      jest.spyOn(console, 'error').mockImplementation(() => {});
      request.mockImplementation(() => {
        throw new Error('something went wrong');
      });
      const res = await cfRequest('path');
      expect(res).toEqual({
        status: 'error',
        messages: ['something went wrong'],
        body: undefined,
      });
    });
  });
});
