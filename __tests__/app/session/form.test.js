/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SessionForm } from '@/app/test/session/form';

describe('SessionForm', () => {
  it('renders the elements of the form', async () => {
    // not passing anything in as this will need no behavior
    render(<SessionForm />);
    expect(
      await screen.findByText('Add a new user session')
    ).toBeInTheDocument();
    expect(
      await screen.getByRole('textbox', { name: 'username' })
    ).toBeInTheDocument();
    expect(await screen.getByText('Add username')).toBeInTheDocument();
  });

  it('requires that the username input is present', async () => {
    render(<SessionForm />);
    const input = await screen.getByRole('textbox', { name: 'username' });
    expect(input).toHaveAttribute('required', '');
  });

  // TODO try moving function addSession outside of the component
  // so it can be more effectively tested
  it.todo('updates the sessions prop on form submission');
});
