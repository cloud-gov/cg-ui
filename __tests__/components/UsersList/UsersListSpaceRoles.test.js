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
  it('shows all roles for each space', () => {
    // act
    render(
      <UsersListSpaceRoles spaces={mockSpaces} roles={multipleRolesForSpace} />
    );
    // query
    const spaceGuid1Role1 = screen.queryByText('fooRoleName1');
    const spaceGuid1Role2 = screen.queryByText('fooRoleName2');
    const spaceGuid2Role1 = screen.queryByText('fooRoleName3');
    const spaceGuid2Role2 = screen.queryByText('fooRoleName4');
    // assert
    expect(spaceGuid1Role1).toBeInTheDocument();
    expect(spaceGuid1Role2).toBeInTheDocument();
    expect(spaceGuid2Role1).toBeInTheDocument();
    expect(spaceGuid2Role2).toBeInTheDocument();
  });

  describe('when there are more spaces than we can show', () => {
    it('hides extra spaces and shows overflow number instead', () => {
      // act
      render(<UsersListSpaceRoles spaces={mockSpaces} roles={mockRoles} />);
      // query
      const extraSpace = screen.queryByText('fooRoleName5');
      const overflowNum = screen.queryByText('+1');
      // assert
      expect(extraSpace).not.toBeInTheDocument();
      expect(overflowNum).toBeInTheDocument();
    });
  });

  describe('when there is no overflow', () => {
    it('does not show overflow amount', () => {
      // act
      render(<UsersListSpaceRoles spaces={mockSpaces} roles={fewerRoles} />);
      // query
      const overflow = screen.queryByText('+');
      // assert
      expect(overflow).not.toBeInTheDocument();
    });
  });
});
