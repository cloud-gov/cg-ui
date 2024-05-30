/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListOrgRoles } from '@/components/UsersList/UsersListOrgRoles';

describe('UsersListOrgRoles', () => {
  it('lists all given org roles', () => {
    // setup
    const mockRoles = [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }];
    // act
    render(<UsersListOrgRoles roles={mockRoles} />);
    // query
    const item1 = screen.getByText('foo');
    const item2 = screen.getByText('bar');
    const item3 = screen.getByText('baz');
    // expect
    expect(item1).toBeInTheDocument();
    expect(item2).toBeInTheDocument();
    expect(item3).toBeInTheDocument();
  });
});
