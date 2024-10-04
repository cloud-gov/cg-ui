import { describe, it, expect } from '@jest/globals';
import { logInPath } from '@/helpers/authentication';

describe('logInPath', () => {
  it('returns the correct path with state', async () => {
    expect(logInPath()).toMatch(/^\/login\?state=[a-z|\d]+$/);
  });
});
