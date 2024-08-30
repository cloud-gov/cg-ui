import nock from 'nock';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { getUserLogonInfo } from '@/api/aws/s3';

describe('s3 integration tests', () => {
  beforeAll(() => {
    // allow connection to AWS
    nock.enableNetConnect('amazonaws.com');
  });

  afterAll(() => {
    // disable network connections in case other tests are being run with this file
    nock.disableNetConnect();
  });

  it('connects to the bucket and retrieves the user logon info file', async () => {
    const info = await getUserLogonInfo();
    expect(info).toBeDefined();
    expect(info.user_summary).toBeDefined();
  });
});
