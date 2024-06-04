/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListSpaceRoles } from '@/components/UsersList/UsersListSpaceRoles';

const mockSpaces = [
  { spaceName: 'foo space 1', roleName: 'foo role 1' },
  { spaceName: 'foo space 2', roleName: 'foo role 2' },
  { spaceName: 'foo space 3', roleName: 'foo role 3' },
  { spaceName: 'foo space 4', roleName: 'foo role 4' },
  { spaceName: 'foo space 5', roleName: 'foo role 5' },
  { spaceName: 'foo space 6', roleName: 'foo role 6' },
];

describe('UsersListSpaceRoles', () => {
  describe('when there are more spaces than we can show', () => {
    it('hides extra spaces and shows overflow number instead', () => {
      // act
      render(<UsersListSpaceRoles spaces={mockSpaces} />);
      // query
      const extraSpace = screen.queryByText('foo space 5');
      const overflowNum = screen.queryByText('+ 2');
      // assert
      expect(extraSpace).not.toBeInTheDocument();
      expect(overflowNum).toBeInTheDocument();
    });
  });

  describe('when there is no overflow', () => {
    it('does not show overflow amount', () => {
      // setup
      const fewerSpaces = mockSpaces.slice(0, 4);
      // act
      render(<UsersListSpaceRoles spaces={fewerSpaces} />);
      // query
      const overflow = screen.queryByText('+');
      // assert
      expect(overflow).not.toBeInTheDocument();
    });
  });
});
