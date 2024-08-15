/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Auth } from '@/components/auth/Auth';
import { isLoggedIn } from '@/api/cf/token';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/api/cf/token', () => ({
  isLoggedIn: jest.fn(),
}));
/* eslint no-undef: "error" */

describe('Auth', () => {
  it('when not logged in, displays log in button', async () => {
    isLoggedIn.mockReturnValue(false);

    render(<Auth />);
    const content = await screen.findByText('Log In');
    expect(content).toBeInTheDocument();
  });

  it('when logged in, displays log out button', async () => {
    isLoggedIn.mockReturnValue(true);

    render(<Auth />);
    const content = await screen.findByText('Log Out');
    expect(content).toBeInTheDocument();
  });
});
