/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';

describe('UsersListOrgRoles', () => {
  describe('when only org user', () => {
    it('shows no additional org roles', () => {
      // setup
      const mockRoles = [{ guid: 'guid1', role: 'organization_user' }];
      // act
      render(<UsersListOrgRoles orgRoles={mockRoles} />);
      // query
      const noRolesText = screen.getByText('No additional roles');
      // expect
      expect(noRolesText).toBeInTheDocument();
    });
  });

  describe('when org manager is present', () => {
    it('shows only org manager', () => {
      // setup
      const mockRoles = [
        { guid: 'guid1', role: 'organization_user' },
        { guid: 'guid2', role: 'organization_manager' },
        { guid: 'guid3', role: 'organization_auditor' },
      ];
      // act
      render(<UsersListOrgRoles orgRoles={mockRoles} />);
      // query
      const managerText = screen.getByText('org manager');
      const auditorText = screen.queryByText('auditor');
      // expect
      expect(managerText).toBeInTheDocument();
      expect(auditorText).not.toBeInTheDocument();
    });
  });

  describe('with only non-manager roles', () => {
    it('lists the non-manager roles', () => {
      // setup
      const mockRoles = [
        { guid: 'guid1', role: 'organization_user' },
        { guid: 'guid2', role: 'billing_manager' },
        { guid: 'guid3', role: 'organization_auditor' },
      ];
      // act
      render(<UsersListOrgRoles orgRoles={mockRoles} />);
      // query
      const billingManagerText = screen.getByText('billing manager');
      const auditorText = screen.getByText('org auditor');
      const userText = screen.queryByText('org user');
      // expect
      expect(billingManagerText).toBeInTheDocument();
      expect(auditorText).toBeInTheDocument();
      expect(userText).not.toBeInTheDocument();
    });
  });
});
