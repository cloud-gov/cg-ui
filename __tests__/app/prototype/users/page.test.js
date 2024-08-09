/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import UsersPage from '@/app/prototype/users/page';
import { getUsers } from '@/api/users';
/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/api/users', () => ({
  getUsers: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('UsersPage', () => {
  it('renders the users on api success', async () => {
    // mock
    getUsers.mockImplementation(() => {
      return [{ name: 'Foo', id: 1 }];
    });
    // render
    render(await UsersPage());
    // assert
    expect(await screen.findByText('Foo')).toBeInTheDocument();
  });

  it('shows an error on api failure', async () => {
    // mock
    getUsers.mockImplementation(() => {
      throw new Error('an err occurred');
    });
    // render
    render(await UsersPage());
    // assert
    expect(await screen.findByText('an err occurred')).toBeInTheDocument();
  });
});
