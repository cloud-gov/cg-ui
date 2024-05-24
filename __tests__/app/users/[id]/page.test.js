/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import UserPage from '@/app/test/users/[id]/page';
import { getUser } from '@/api/users';
/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../../api/users', () => ({
  getUser: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('UserPage', () => {
  it('renders the user on api success', async () => {
    // mock
    getUser.mockImplementation(() => {
      return { name: 'Foo', id: 1 };
    });
    // render
    const params = { id: 1 };
    render(await UserPage({ params }));
    // assert
    expect(await screen.findByText('Foo')).toBeInTheDocument();
  });

  it('shows an error on api failure', async () => {
    // mock
    getUser.mockImplementation(() => {
      throw new Error('an err occurred');
    });
    // render
    const params = { id: 1 };
    render(await UserPage({ params }));
    // assert
    expect(await screen.findByText('an err occurred')).toBeInTheDocument();
  });
});
