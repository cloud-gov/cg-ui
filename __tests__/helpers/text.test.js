import { describe, expect, it } from '@jest/globals';
import { underscoreToText, emailIsValid } from '@/helpers/text';

describe('underscoreToText', () => {
  it('removes underscores globally from a line of text', () => {
    const input = '_foo_bar_baz_';
    const result = underscoreToText(input);

    expect(result).toEqual('foo bar baz');
  });
});

describe('emailIsValid', () => {
  it('returns false for an invalid email', () => {
    expect(emailIsValid('foobar')).toBe(false);
  });
  it('returns true for a valid email', () => {
    expect(emailIsValid('foo@example.com')).toBe(true);
  });
});
