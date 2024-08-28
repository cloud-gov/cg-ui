/**
 * @jest-environment jsdom
 */
import { describe, expect, it, xit } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsersActionsRemoveFromOrg } from '@/components/UsersActions/UsersActionsRemoveFromOrg';
// import { removeFromOrg } from '@/app/orgs/[orgId]/actions';

/* eslint no-undef: "off" */
// jest.mock('@/app/orgs/[orgId]/actions', () => ({
//   removeFromOrg: async () => {
//     return new Promise((resolve) => {
//       resolve({
//         meta: { status: 'error', errors: ['foo error message'] },
//         payload: {},
//       });
//     });
//   },
// }));
/* eslint no-undef: "error" */

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

  it('hides modal on initial load', () => {
    // act
    render(<UsersActionsRemoveFromOrg user={user} />);
    // expect
    const content = screen.queryByText(/Are you sure you want to remove/i);
    expect(content).not.toBeInTheDocument();
  });

  it('shows modal when remove button is clicked', () => {
    // act
    render(<UsersActionsRemoveFromOrg user={user} />);
    const button = screen.getByText(/Remove/);
    fireEvent.click(button);
    // expect
    const content = screen.getByText(/Are you sure you want to remove/i);
    expect(content).toBeInTheDocument();
  });

  describe('when modal is open', () => {
    it('closes modal when cancel button is clicked', () => {
      // render component
      render(<UsersActionsRemoveFromOrg user={user} />);
      // open modal
      const openButton = screen.getByText(/Remove/);
      fireEvent.click(openButton);
      // act
      const cancelButton = screen.getByText('Go back');
      fireEvent.click(cancelButton);
      // expect
      const content = screen.queryByText(/Are you sure you want to remove/i);
      expect(content).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', () => {
      // render component
      render(<UsersActionsRemoveFromOrg user={user} />);
      // open modal
      const openButton = screen.getByText(/Remove/);
      fireEvent.click(openButton);
      // act
      const closeButton = screen.getByLabelText('Close this window');
      fireEvent.click(closeButton);
      // expect
      const content = screen.queryByText(/Are you sure you want to remove/i);
      expect(content).not.toBeInTheDocument();
    });

    xit('resets form when modal is closed and reopened', async () => {
      // render component
      render(<UsersActionsRemoveFromOrg user={user} />);
      // open modal
      const openButton = screen.getByText('Remove from org');
      fireEvent.click(openButton);
      // cause an error
      const removeButton = screen.getAllByRole('button')[1]; // remove button in form
      fireEvent.click(removeButton);
      // show error
      // TODO: cannot figure out how to make the error message show up
      const errMessage = await screen.findByText('foo error message');
      expect(errMessage).toBeInTheDocument();
    });
  });
});
