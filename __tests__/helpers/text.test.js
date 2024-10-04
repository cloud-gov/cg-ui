import { describe, expect, it } from '@jest/globals';
import {
  camelToSnakeCase,
  emailIsValid,
  underscoreToText,
  pluralize,
  newOrgPathname,
  randomString,
} from '@/helpers/text';

describe('text helpers', () => {
  describe('camelToSnakeCase', () => {
    it('replaces upcases with underscore and lowcase character', () => {
      expect(camelToSnakeCase('organizationGuids')).toEqual(
        'organization_guids'
      );
    });
    it('leaves existing snake case alone', () => {
      expect(camelToSnakeCase('space_guids')).toEqual('space_guids');
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

  describe('underscoreToText', () => {
    it('removes underscores globally from a line of text', () => {
      const input = '_foo_bar_baz_';
      const result = underscoreToText(input);

      expect(result).toEqual('foo bar baz');
    });
  });

  describe('pluralize', () => {
    it('adds an s when plural or 0', () => {
      expect(pluralize('role', 2)).toBe('roles');
      expect(pluralize('role', -2)).toBe('roles');
      expect(pluralize('role', 0)).toBe('roles');
    });
    it('keeps s off when not plural', () => {
      expect(pluralize('role', 1)).toBe('role');
      expect(pluralize('role', -1)).toBe('role');
    });
  });

  describe('newOrgPathname', () => {
    const newGUID = 'foobar';

    describe('when last GUID starts with an a-z character', () => {
      it('removes last GUID from pathname', () => {
        const path =
          '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd/users/add/b70bd8ff-ed0e-4d11-95c4-cf765202cebd'; // last GUID starts with an a-z character
        const result = newOrgPathname(path, newGUID);
        expect(result).toEqual('/orgs/foobar/users/add/');
      });
    });

    describe('last GUID starts with an a-z character, but then keeps going with more path sections', () => {
      it('removes last GUID and beyond from pathname', () => {
        const path =
          '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd/users/add/b70bd8ff-ed0e-4d11-95c4-cf765202cebd/keeps-going'; // last GUID starts with an a-z character, but then keeps going with more path sections
        const result = newOrgPathname(path, newGUID);
        expect(result).toEqual('/orgs/foobar/users/add/');
      });
    });

    describe('when last GUID starts with a digit', () => {
      it('removes last GUID from pathname', () => {
        const path =
          '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd/users/add/470bd8ff-ed0e-4d11-95c4-cf765202cebd/'; // next GUID starts with a digit
        const result = newOrgPathname(path, newGUID);
        expect(result).toEqual('/orgs/foobar/users/add/');
      });
    });

    describe('when no other GUID but the org GUID', () => {
      it('just replaces the org guid with new guid', () => {
        const path = '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd'; // without trailing slash
        const result = newOrgPathname(path, newGUID);
        expect(result).toEqual('/orgs/foobar');
      });

      it('just replaces the org guid with new guid', () => {
        const path = '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd/'; // with trailing slash
        const result = newOrgPathname(path, newGUID);
        expect(result).toEqual('/orgs/foobar/');
      });

      it('just replaces the org guid with new guid', () => {
        const path = '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd/users/add'; // with trailing slash
        const result = newOrgPathname(path, newGUID);
        expect(result).toEqual('/orgs/foobar/users/add');
      });
    });
  });
});

describe('randomString', () => {
  it('returns a string', () => {
    expect(typeof randomString()).toBe('string');
  });
});
