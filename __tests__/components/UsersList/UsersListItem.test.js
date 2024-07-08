/**
 * @jest-environment jsdom
 */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListItem } from '@/components/UsersList/UsersListItem';

const mockUser = {
  username: 'User 1',
  guid: 'fooUserGuid-1',
};

const mockRoles = {
  org: [
    { guid: 'orgGuid-1', role: 'org_manager' },
    { guid: 'orgGuid-1', role: 'org_auditor' },
  ],
  space: {
    'spaceGuid-1': [{ guid: 'spaceGuid-1', role: 'space_manager' }],
  },
  allSpaceRoleGuids: ['spaceGuid-1'],
  allOrgRoleGuids: ['orgGuid-1'],
};

const mockSpaces = {
  'spaceGuid-1': { guid: 'spaceGuild-1', name: 'foo space name' },
};

const mockUserLogonTime = {
  userName: 'User 1',
  active: true,
  lastLogonTime: new Date(),
  lastLogonTimePretty: 'placeholder',
};

describe('UserListItem', () => {
  it('when given a current date, displays the days until expiration', () => {
    // act
    render(
      <UsersListItem
        user={mockUser}
        roles={mockRoles}
        spaces={mockSpaces}
        userLogonInfo={mockUserLogonTime}
        removeUserCallback={jest.fn()}
        orgGuid={'orgGuid-1'}
      />
    );
    // query
    const content = screen.getByText('Login expires in 90 days');
    // expect
    expect(content).toBeInTheDocument();
  });

  it('when not given a date, displays that access info is not available', () => {
    // act
    render(
      <UsersListItem
        user={mockUser}
        roles={mockRoles}
        spaces={mockSpaces}
        userLoginInfo={undefined}
        removeUserCallback={jest.fn()}
        orgGuid={'orgGuid-1'}
      />
    );
    // query
    const content = screen.getByText('No access information available');
    // expect
    expect(content).toBeInTheDocument();
  });
});
