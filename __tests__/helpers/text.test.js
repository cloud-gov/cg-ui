import { describe, expect, it } from '@jest/globals';
import { underscoreToText } from '@/helpers/text';

describe('underscoreToText', () => {
  it('removes underscores globally from a line of text', () => {
    const input = '_foo_bar_baz_';
    const result = underscoreToText(input);

    expect(result).toEqual('foo bar baz');
  });
});
