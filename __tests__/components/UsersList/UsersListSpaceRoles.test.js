/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { UsersListSpaceRoles } from '@/components/UsersList/UsersListSpaceRoles';

describe('UsersListSpaceRoles', () => {
  it('shows the rollup number of active spaces roles with total number of available spaces', () => {
    // act
    render(
      <UsersListSpaceRoles spaceRolesCount={2} spacesCount={5} href="foo" />
    );
    // query
    const spacesText = screen.queryByText(/2 of 5 spaces/);
    // assert
    expect(spacesText).toBeInTheDocument();
  });
});
