import { describe, expect, it } from '@jest/globals';
import {
  formatInt,
  convertBytes,
  megaBytesToBytes,
  formatMb,
} from '@/helpers/numbers';

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

describe('convertBytes', () => {
  describe('when no options passed', () => {
    it('returns value using default options', () => {
      const result = convertBytes(10240000000); // 10240 MB in bytes
      expect(result.value).toEqual('10.2');
      expect(result.unit).toEqual('GB');
    });
  });
});

describe('megaBytesToBytes', () => {
  it('converts megabytes to bytes', () => {
    expect(megaBytesToBytes(1)).toEqual(1000000);
    expect(megaBytesToBytes(5)).toEqual(5000000);
  });
});

describe('formatMb', () => {
  it('returns a human readable string', () => {
    expect(formatMb(10240)).toEqual('10.2GB');
  });
});
