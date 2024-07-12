/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Clientside from '@/app/prototype/clientside/page';
import { getUsers } from '@/api/users';

// Initial mock setup:
// All mocks are hoisted to the top of the code block.
// Turning off eslint no-undef rule here,
// because defining the jest global import breaks the mock.
/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../../api/users', () => ({
  getUsers: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('Clientside', () => {
  it('shows a loading indicator by default', async () => {
    // mock
    getUsers.mockImplementation(() => {
      return [{ name: 'Foo', id: 1 }];
    });
    // render
    render(<Clientside />);
    // assert initial state
    const loadingIndicator = screen.getByText('loading...');
    expect(loadingIndicator).toBeInTheDocument();
    // assert eventual load
    // TODO: feels weird to run this extra test just to bypass act warnings
    expect(await screen.findByText('Foo')).toBeInTheDocument();
  });

  it('lists the users when api call succeeds', async () => {
    // mock
    getUsers.mockImplementation(() => {
      return [{ name: 'Foo', id: 1 }];
    });
    // render
    render(<Clientside />);
    // assert
    expect(await screen.findByText('Foo')).toBeInTheDocument();
  });

  it('renders an error if api call fails', async () => {
    // mock
    getUsers.mockImplementation(() => {
      throw new Error('an err occurred');
    });
    // render
    render(<Clientside />);
    // assert
    expect(await screen.findByText('an err occurred')).toBeInTheDocument();
  });
});
