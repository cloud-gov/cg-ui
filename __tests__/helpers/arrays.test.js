import { describe, expect, it } from '@jest/globals';
import {
  sortObjectsByParam,
  filterObjectsByParams,
  chunkArray,
} from '@/helpers/arrays';

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

describe('filterObjectsByParams', () => {
  it('filters expected objects from given array', () => {
    // setup
    const ary = [
      { name: 'abcdef', email: 'abc@example.com' }, // name but not email
      { name: 'ghijk', email: 'def@example.com' }, // email but not name
      { name: 'lmnop', email: 'lmnop@example.com' },
    ];
    const searchTerm = 'def';
    const params = { name: searchTerm, email: searchTerm };
    // act
    const result = filterObjectsByParams(ary, params);
    // expect
    expect(result.length).toEqual(2);
    expect(result[0]).toBe(ary[0]);
    expect(result[1]).toBe(ary[1]);
  });

  it('filter is case insensitive', () => {
    // setup
    const ary = [
      { name: 'abcdef', email: 'abc@example.com' }, // name but not email
      { name: 'ghijk', email: 'def@example.com' }, // email but not name
      { name: 'lmnop', email: 'lmnop@example.com' },
    ];
    const searchTerm = 'Def';
    const params = { name: searchTerm, email: searchTerm };
    // act
    const result = filterObjectsByParams(ary, params);
    // expect
    expect(result.length).toEqual(2);
    expect(result[0]).toBe(ary[0]);
    expect(result[1]).toBe(ary[1]);
  });
});

describe('chunkArray', () => {
  it('groups items in array into another array per given chunk size', () => {
    const ary = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const size = 3;
    const result = chunkArray(ary, size);
    expect(result.length).toEqual(4);
    expect(result[0].length).toEqual(3);
    expect(result[0]).toEqual([1, 2, 3]);
  });
});
