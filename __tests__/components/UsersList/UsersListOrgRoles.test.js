/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';

describe('UsersListOrgRoles', () => {
  it('lists all given org roles', () => {
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
    expect(userText).toBeInTheDocument();
  });
});
