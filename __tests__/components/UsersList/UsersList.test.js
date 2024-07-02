/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
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
        spaces={mockSpaces}
        userLoginInfo={mockUserLogonTime}
      />
    );
    // query
    const list = screen.getAllByRole('listitem');
    // expect
    expect(list[0]).toHaveTextContent(/a username 2/);
    expect(list[1]).toHaveTextContent(/b username 3/);
    expect(list[2]).toHaveTextContent(/c username 1/);
  });
});
