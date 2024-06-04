import { describe, expect, it } from '@jest/globals';
import { isDateExpired, daysToExpiration } from '@/helpers/dates';

describe('isDateExpired', () => {
  it("returns true when today's date is past expiration", () => {
    const timestamp = '2020-05-29T13:27:12+0000'; // years ago
    const result = isDateExpired(timestamp, 90); // years ago plus 90 days
    expect(result).toEqual(true);
  });

  it("returns false when today's date is before expiration", () => {
    const now = new Date();
    const timestamp = new Date(now.setDate(now.getDate() - 2)).toISOString(); // 2 days ago
    const result = isDateExpired(timestamp, 90); // 2 days ago plus 90 days
    expect(result).toEqual(false);
  });
});

describe('daysToExpiration', () => {
  it('returns number of days away from expiration', () => {
    const now = new Date();
    const timestamp = new Date(now.setDate(now.getDate() - 2)).toISOString(); // 2 days ago
    const result = daysToExpiration(timestamp, 90); // 90 day expiration window
    expect(result).toEqual(88);
  });
});
