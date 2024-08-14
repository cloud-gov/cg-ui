/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Auth } from '@/components/auth/Auth';

describe('Auth', () => {
  it('when not logged in, displays log in button', async () => {
    delete process.env.CF_API_TOKEN;
    render(<Auth />);
    const content = await screen.findByText('Log In');
    expect(content).toBeInTheDocument();
  });

  it('when logged in, displays log out button', async () => {
    process.env.CF_API_TOKEN = 'placeholder';
    render(<Auth />);
    const content = await screen.findByText('Log Out');
    expect(content).toBeInTheDocument();
  });
});
