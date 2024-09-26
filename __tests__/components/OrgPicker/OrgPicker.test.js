/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import { usePathname } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { OrgPicker } from '@/components/OrgPicker/OrgPicker';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd'),
}));
/* eslint no-undef: "error" */

describe('<OrgPicker />', () => {
  const mockOrgs = [
    { name: 'foobar org 1', guid: 'baz' },
    { name: 'foobar org 2', guid: 'baz2' },
  ];
  describe('on initial load', () => {
    it('content is collapsed', () => {
      // act
      render(<OrgPicker orgs={mockOrgs} currentOrgId="baz" />);
      // assert
      const content = screen.queryByText('View all organizations');
      expect(content).not.toBeInTheDocument();
    });
  });

  describe('when button is clicked', () => {
    it('content expands', async () => {
      // setup
      const user = userEvent.setup();
      render(<OrgPicker orgs={mockOrgs} currentOrgId="baz" />);
      // act
      const button = screen.getByRole('button', { expanded: false });
      await user.click(button);
      // assert
      const content = await screen.findByText('View all organizations');
      expect(content).toBeInTheDocument();
    });
  });

  describe('when only one org', () => {
    it('only shows org name instead of the dropdown', () => {
      // setup
      render(<OrgPicker orgs={mockOrgs.slice(0, 1)} currentOrgId="baz" />);
      // act
      const orgName = screen.getByText(/foobar org 1/);
      const button = screen.queryByRole('button');
      // assert
      expect(orgName).toBeInTheDocument();
      expect(button).not.toBeInTheDocument();
    });
  });

  describe('when no orgs at all', () => {
    it('shows nothing', () => {
      // setup
      render(<OrgPicker orgs={[]} currentOrgId="baz" />);
      // act
      const orgName = screen.queryByText(/foobar org 1/);
      const button = screen.queryByRole('button');
      // assert
      expect(orgName).not.toBeInTheDocument();
      expect(button).not.toBeInTheDocument();
    });
  });

  describe('when no current org', () => {
    it('shows nothing', () => {
      // setup
      render(<OrgPicker orgs={mockOrgs} />);
      // act
      const orgName = screen.queryByText(/foobar org 1/);
      const button = screen.queryByRole('button');
      // assert
      expect(orgName).not.toBeInTheDocument();
      expect(button).not.toBeInTheDocument();
    });
  });
});
