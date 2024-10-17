/**
 * @jest-environment jsdom
 */
import { cookies } from 'next/headers';
import { describe, expect, it, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import { LastViewedOrgLink } from '@/components/LastViewedOrgLink';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
/* eslint no-undef: "error" */

describe.skip('<LastViewedOrgLink />', () => {
  describe('when no org id cookie is found', () => {
    beforeEach(() => {
      // TODO: figure out how to mock cookies (we're mocking same as token.test.js but it doesn't work here)
      cookies.mockImplementation(() => ({
        get: () => null,
      }));
    });
    it('returns nothing', async () => {
      // act
      const component = render(await LastViewedOrgLink());
      // assert
      const link = component.queryByRole('link');
      expect(link).not.toBeInTheDocument();
    });
  });

  describe('when get org request fails', () => {
    it.todo('returns nothing');
  });

  describe('when org cookie is present and get org succeeds', () => {
    it.todo('shows correct hyperlink and org name');
  });
});
