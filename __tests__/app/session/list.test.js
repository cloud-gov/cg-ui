/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { SessionList } from '@/app/session/list';

describe('SessionList', () => {
  it('renders an empty list if no sessions are provided', async () => {
    render(<SessionList sessions={[]} />);
    expect(await screen.findByText('Active sessions')).toBeInTheDocument();
    expect(await screen.getByRole('list')).toBeEmptyDOMElement();
  });

  it('renders a list if sessions are provided', async () => {
    render(
      <SessionList
        sessions={[
          { id: 1, username: 'Test1' },
          { id: 2, username: 'Test2' },
        ]}
      />
    );

    expect(await screen.getAllByRole('listitem')).toHaveLength(2);
    expect(await screen.findByText('Test1')).toBeInTheDocument();
    expect(await screen.findByText('Test2')).toBeInTheDocument();
  });
});
