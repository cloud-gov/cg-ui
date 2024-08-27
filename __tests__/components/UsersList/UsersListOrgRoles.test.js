/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';

describe('UsersListOrgRoles', () => {
  it('lists the number of active org roles for the user', () => {
    // setup
    const mockRoles = [
      { guid: 'guid1', role: 'organization_user' },
      { guid: 'guid2', role: 'billing_manager' },
      { guid: 'guid3', role: 'organization_auditor' },
    ];
    // act
    render(<UsersListOrgRoles orgRoles={mockRoles} />);
    // query
    const rolesText = screen.getByText(/3 roles/);
    // expect
    expect(rolesText).toBeInTheDocument();
  });

  it('shows correct empty text when no active roles', () => {
    // setup
    render(<UsersListOrgRoles orgRoles={[]} />);
    // query
    const rolesText = screen.getByText(/None yet/);
    // expect
    expect(rolesText).toBeInTheDocument();
  });
});
