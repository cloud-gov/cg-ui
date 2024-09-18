import { describe, it, expect } from '@jest/globals';
import { randomString } from '@/helpers/crypto';

describe('randomString', () => {
  it('returns a string', () => {
    expect(typeof randomString()).toBe('string');
  });
});
