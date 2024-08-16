/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Username } from '@/components/Username';

describe('Username', () => {
  it('when given a user, displays the user name', () => {
    // setup
    const mockUser = {
      guid: 'userguid',
      username: 'User 1',
    };
    // act
    render(<Username user={mockUser} />);
    const content = screen.getByText('User 1');
    // assert
    expect(content).toBeInTheDocument();
  });

  it('when given a service account user, displays the service account name', () => {
    // setup
    const guid = 'cafce0be-62dd-4f02-9770-d546c8714430';
    const mockUser = {
      guid: 'userguid',
      username: guid,
    };
    const mockAccount = {
      guid: guid,
      name: 'Auditor 1',
    };
    // act
    render(<Username user={mockUser} serviceAccount={mockAccount} />);
    const auditor = screen.getByText(/Auditor 1/);
    const svcAcct = screen.getByText(/\[service account\]/);
    const username = screen.queryByText(guid);
    // assert
    expect(auditor).toBeInTheDocument();
    expect(svcAcct).toBeInTheDocument();
    expect(username).toBeNull();
  });

  it('when given a user without a username, displays default text', () => {
    // setup
    const mockUser = {
      guid: 'userguid',
      username: '',
    };
    // act
    render(<Username user={mockUser} />);
    const content = screen.getByText('Unnamed user');
    // assert
    expect(content).toBeInTheDocument();
  });
});
