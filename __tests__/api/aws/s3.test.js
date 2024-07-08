import { beforeEach, describe, expect, it } from '@jest/globals';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { getUserLogonInfo } from '@/api/aws/s3';

const s3Mock = mockClient(S3Client);

describe('s3 tests', () => {
  beforeEach(() => {
    process.env.AWS_ACCESS_KEY_ID = 'some-key';
    process.env.AWS_BUCKET = 'some-bucket';

    s3Mock.reset();
  });

  describe('getUserLogonInfo', () => {
    it('when no environment variable set, returns undefined', async () => {
      delete process.env.AWS_ACCESS_KEY_ID;
      const res = await getUserLogonInfo();
      expect(res).toBeUndefined();
    });

    it('when s3 throws an error, returns undefined', async () => {
      s3Mock.on(GetObjectCommand, {}).rejects('aws error');
      const res = await getUserLogonInfo();
      expect(res).toBeUndefined();
    });

    it('when set up correctly, s3 called with bucket name, returns JSON', async () => {
      const expected = {
        Bucket: process.env.BUCKET,
        Key: 'development-list-lastlogon-summary.json',
      };
      s3Mock.on(GetObjectCommand, expected).resolves({
        Body: {
          // eslint-disable-next-line no-undef
          transformToString: () => Promise.resolve('{"fake": "json"}'),
        },
      });

      const res = await getUserLogonInfo();
      expect(res).toEqual({ fake: 'json' });
    });
  });
});
