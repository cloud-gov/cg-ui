import { describe, expect, it } from '@jest/globals';
import {
  camelToSnakeCase,
  emailIsValid,
  underscoreToText,
  pluralize,
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
});
