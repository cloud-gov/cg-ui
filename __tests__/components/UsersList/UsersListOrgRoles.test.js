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
      { guid: 'guid1', role: 'foo' },
      { guid: 'guid2', role: 'bar' },
      { guid: 'guid3', role: 'baz' },
    ];
    // act
    render(<UsersListOrgRoles orgRoles={mockRoles} />);
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
