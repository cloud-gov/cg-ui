import { describe, it, expect } from '@jest/globals';
import { cfRequest } from '../../../api/cf/cloudfoundry';
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
      request.mockImplementation(() => {
        throw new Error('some error');
      });

      expect(async () => {
        await cfRequest('path');
      }).rejects.toThrow(new Error('something went wrong: some error'));
    });
  });
});
