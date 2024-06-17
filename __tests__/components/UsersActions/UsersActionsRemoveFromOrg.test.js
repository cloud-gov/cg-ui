/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsersActionsRemoveFromOrg } from '@/components/UsersActions/UsersActionsRemoveFromOrg';

describe('UsersActionsRemoveFromOrg', () => {
  // prep
  const user = {
    guid: 'fooGuid',
    created_at: 'foo',
    updated_at: 'foo',
    username: 'fooUsername',
    presentation_name: 'fooPresentationName',
    origin: 'foo',
    metadata: {},
    links: {},
  };
  const formAction = () => {};

  it('hides modal on initial load', () => {
    // act
    render(<UsersActionsRemoveFromOrg user={user} formAction={formAction} />);
    // expect
    const content = screen.queryByText(/Are you sure you want to remove/i);
    expect(content).not.toBeInTheDocument();
  });

  it('shows modal when remove button is clicked', () => {
    // act
    render(<UsersActionsRemoveFromOrg user={user} formAction={formAction} />);
    const button = screen.getByText('Remove from org');
    fireEvent.click(button);
    // expect
    const content = screen.getByText(/Are you sure you want to remove/i);
    expect(content).toBeInTheDocument();
  });

  describe('when modal is open', () => {
    it('closes modal when cancel button is clicked', () => {
      // render component
      render(<UsersActionsRemoveFromOrg user={user} formAction={formAction} />);
      // open modal
      const openButton = screen.getByText('Remove from org');
      fireEvent.click(openButton);
      // act
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      // expect
      const content = screen.queryByText(/Are you sure you want to remove/i);
      expect(content).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', () => {
      // render component
      render(<UsersActionsRemoveFromOrg user={user} formAction={formAction} />);
      // open modal
      const openButton = screen.getByText('Remove from org');
      fireEvent.click(openButton);
      // act
      const closeButton = screen.getByLabelText('Close this window');
      fireEvent.click(closeButton);
      // expect
      const content = screen.queryByText(/Are you sure you want to remove/i);
      expect(content).not.toBeInTheDocument();
    });
  });
});
