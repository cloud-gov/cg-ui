/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersList } from '@/components/UsersList/UsersList';

const mockUsers = [
  {
    username: 'c username 1',
    guid: 'fooUserGuid-1',
  },
  {
    username: 'a username 2',
    guid: 'fooUserGuid-2',
  },
  {
    username: 'b username 3',
    guid: 'fooUserGuid-3',
  },
];

const mockRoles = {
  'fooUserGuid-1': {
    org: [
      { guid: 'orgGuid-1', role: 'org_manager' },
      { guid: 'orgGuid-1', role: 'org_auditor' },
    ],
    space: {
      'spaceGuid-1': [{ guid: 'spaceGuid-1', role: 'space_manager' }],
    },
    allSpaceRoleGuids: ['spaceGuid-1'],
    allOrgRoleGuids: ['orgGuid-1'],
  },
  'fooUserGuid-2': {
    org: [
      { guid: 'orgGuid-1', role: 'org_manager' },
      { guid: 'orgGuid-1', role: 'org_auditor' },
    ],
    space: {
      'spaceGuid-1': [{ guid: 'spaceGuid-1', role: 'space_developer' }],
    },
    allSpaceRoleGuids: ['spaceGuid-1'],
    allOrgRoleGuids: ['orgGuid-1'],
  },
  'fooUserGuid-3': {
    org: [
      { guid: 'orgGuid-1', role: 'org_manager' },
      { guid: 'orgGuid-1', role: 'org_auditor' },
    ],
    space: {
      'spaceGuid-1': [{ guid: 'spaceGuid-1', role: 'space_auditor' }],
    },
    allSpaceRoleGuids: ['spaceGuid-1'],
    allOrgRoleGuids: ['orgGuid-1'],
  },
};

const mockSpaces = {
  'spaceGuid-1': { guid: 'spaceGuild-1', name: 'foo space name' },
};

const mockUserLogonTime = {
  'fooUserGuid-1': { lastLogonTime: new Date() },
  'fooUserGuid-2': { lastLogonTime: new Date() },
  'fooUserGuid-3': { lastlogonTime: new Date() },
};

describe('UsersList', () => {
  it('sorts all users by username in alpha order', () => {
    // act
    render(
      <UsersList
        users={mockUsers}
        roles={mockRoles}
        serviceAccounts={{}}
        spaces={mockSpaces}
        userLoginInfo={mockUserLogonTime}
      />
    );
    // query
    const list = screen.getAllByRole('row');
    // expect
    expect(list[1]).toHaveTextContent(/a username 2/); // skipping list[0] since that's the header row
    expect(list[2]).toHaveTextContent(/b username 3/);
    expect(list[3]).toHaveTextContent(/c username 1/);
  });

  describe('filtering users', () => {
    it('filters the expected users when search term is submitted', async () => {
      // setup
      const user = userEvent.setup();
      // act
      render(
        <UsersList
          users={mockUsers}
          roles={mockRoles}
          serviceAccounts={{}}
          spaces={mockSpaces}
          userLoginInfo={mockUserLogonTime}
        />
      );
      // act
      const input = screen.getByLabelText(
        'search the list of users by username'
      );
      input.focus();
      await user.keyboard('c us');
      await user.keyboard('{enter}');
      // query
      const list = screen.getAllByRole('row');
      // expect list to be filtered
      expect(list.length).toEqual(2); // includes header row
      expect(list[1]).toHaveTextContent(/c username 1/);
      // expect list to be unfiltered when search term is removed
      await user.keyboard('{backspace}{backspace}{backspace}{backspace}');
      await user.keyboard('{enter}');
      // get same list again
      const listUpdated = screen.getAllByRole('row');
      expect(listUpdated.length).toEqual(4); // includes header row
    });
  });
});
