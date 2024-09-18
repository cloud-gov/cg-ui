import { describe, it, expect } from '@jest/globals';
import { logInPathAsync } from '@/helpers/authentication';

describe('logInPathAsync', () => {
  it('returns the correct path with state', async () => {
    expect(await logInPathAsync()).toMatch(/^\/login\?state=[a-z|\d]+$/);
  });
});
