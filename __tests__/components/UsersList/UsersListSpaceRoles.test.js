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

const mockRoles = [
  { guid: 'spaceGuid1', role: 'fooRoleRame1' },
  { guid: 'spaceGuid2', role: 'fooRoleRame2' },
  { guid: 'spaceGuid3', role: 'fooRoleRame3' },
  { guid: 'spaceGuid4', role: 'fooRoleRame4' },
  { guid: 'spaceGuid5', role: 'fooRoleRame5' },
];

describe('UsersListSpaceRoles', () => {
  describe('when there are more spaces than we can show', () => {
    it('hides extra spaces and shows overflow number instead', () => {
      // act
      render(<UsersListSpaceRoles spaces={mockSpaces} roles={mockRoles} />);
      // query
      const extraSpace = screen.queryByText('fooRoleRame5');
      const overflowNum = screen.queryByText('+ 1');
      // assert
      expect(extraSpace).not.toBeInTheDocument();
      expect(overflowNum).toBeInTheDocument();
    });
  });

  describe('when there is no overflow', () => {
    it('does not show overflow amount', () => {
      // setup
      const fewerRoles = mockRoles.slice(0, 4);
      // act
      render(<UsersListSpaceRoles spaces={mockSpaces} roles={fewerRoles} />);
      // query
      const overflow = screen.queryByText('+');
      // assert
      expect(overflow).not.toBeInTheDocument();
    });
  });
});
