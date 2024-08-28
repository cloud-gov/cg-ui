/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';

describe('UsersListOrgRoles', () => {
  it('lists the number of active org roles for the user', () => {
    // setup
    const mockRolesCount = 3;
    // act
    render(<UsersListOrgRoles orgRolesCount={mockRolesCount} href="foo" />);
    // query
    const rolesText = screen.getByText(/3 roles/);
    // expect
    expect(rolesText).toBeInTheDocument();
  });

  it('shows correct empty text when no active roles', () => {
    // setup
    render(<UsersListOrgRoles orgRolesCount={0} href="foo" />);
    // query
    const rolesText = screen.getByText(/None yet/);
    // expect
    expect(rolesText).toBeInTheDocument();
  });
});
