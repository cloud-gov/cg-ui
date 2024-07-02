import { beforeEach, describe, expect, it } from '@jest/globals';
import { getUserLogonInfo } from '@/api/aws/s3';

describe('s3 tests', () => {
  beforeEach(() => {
    process.env['AWS_ACCESS_KEY_ID'] = 'some-key';
    process.env['BUCKET'] = 'some-bucket';
  });

  describe('getUserLogonInfo', () => {
    it('when no environment variable set, returns undefined', async () => {
      delete process.env.AWS_ACCESS_KEY_ID;
      const res = await getUserLogonInfo();
      expect(res).toBeUndefined();
    });

    it.todo('when s3 throws an error, returns undefined');
    it.todo('when set up correctly, s3 called with bucket name, returns JSON');
  });
});
