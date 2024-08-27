/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListSpaceRoles } from '@/components/UsersList/UsersListSpaceRoles';

const mockSpaces = {
  spaceGuid1: { guid: 'spaceGuid1', name: 'fooSpaceName' },
  spaceGuid2: { guid: 'spaceGuid2', name: 'fooSpaceName2' },
  spaceGuid3: { guid: 'spaceGuid3', name: 'fooSpaceName2' },
  spaceGuid4: { guid: 'spaceGuid4', name: 'fooSpaceName2' },
  spaceGuid5: { guid: 'spaceGuid5', name: 'fooSpaceName2' },
};

const mockRoles = {
  spaceGuid1: [{ guid: 'spaceGuid1', role: 'fooRoleName1' }],
  spaceGuid2: [{ guid: 'spaceGuid2', role: 'fooRoleName2' }],
  spaceGuid3: [{ guid: 'spaceGuid3', role: 'fooRoleName3' }],
  spaceGuid4: [{ guid: 'spaceGuid4', role: 'fooRoleName4' }],
  spaceGuid5: [{ guid: 'spaceGuid5', role: 'fooRoleName5' }],
};

const fewerRoles = {
  spaceGuid1: [{ guid: 'spaceGuid1', role: 'fooRoleName1' }],
  spaceGuid2: [{ guid: 'spaceGuid2', role: 'fooRoleName2' }],
  spaceGuid3: [{ guid: 'spaceGuid3', role: 'fooRoleName3' }],
};

const multipleRolesForSpace = {
  spaceGuid1: [
    { guid: 'spaceGuid1', role: 'fooRoleName1' },
    { guid: 'spaceGuid1', role: 'fooRoleName2' },
  ],
  spaceGuid2: [
    { guid: 'spaceGuid2', role: 'fooRoleName3' },
    { guid: 'spaceGuid2', role: 'fooRoleName4' },
  ],
};

describe('UsersListSpaceRoles', () => {
  it('shows the rollup number of active spaces roles with total number of available spaces', () => {
    // act
    render(
      <UsersListSpaceRoles spaces={mockSpaces} roles={multipleRolesForSpace} />
    );
    // query
    const spacesText = screen.queryByText(/2 of 5 spaces/);
    // assert
    expect(spacesText).toBeInTheDocument();
  });
});
