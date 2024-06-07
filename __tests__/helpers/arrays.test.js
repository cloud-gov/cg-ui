import { describe, expect, it } from '@jest/globals';
import { sortObjectsByParam } from '@/helpers/arrays';

describe('sortObjectsByParam', () => {
  // setup
  const users = [
    { username: 'charlie bar' },
    { username: null },
    { username: 'alpha foo' },
    { username: undefined },
    { username: 'beta baz' },
  ];
  it('orders objects in ascending order by a possibly empty parameter', () => {
    // act
    const result = sortObjectsByParam(users, 'username');
    // assert
    expect(result[0].username).toEqual('alpha foo');
    expect(result[1].username).toEqual('beta baz');
    expect(result[2].username).toEqual('charlie bar');
    expect(result[3].username).toEqual(null);
    expect(result[4].username).toEqual(undefined);
  });

  it('orders objects in descending order by a possibly empty parameter', () => {
    // act
    const result = sortObjectsByParam(users, 'username', 'desc');
    // assert
    expect(result[0].username).toEqual('charlie bar');
    expect(result[1].username).toEqual('beta baz');
    expect(result[2].username).toEqual('alpha foo');
    expect(result[3].username).toEqual(null);
    expect(result[4].username).toEqual(undefined);
  });
});
