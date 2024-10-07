import { describe, expect, it } from '@jest/globals';
import { formatInt } from '@/helpers/numbers';

describe('formatInt', () => {
  it('returns small numbers as they are', () => {
    const result = formatInt(146);
    expect(result).toEqual('146');
  });
  it('returns commas in big numbers', () => {
    const result = formatInt(146738);
    expect(result).toEqual('146,738');
  });
});
