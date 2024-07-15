/**
 * @jest-environment jsdom
 */
import { describe, expect, /*it,*/ xit } from '@jest/globals';
import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrgActionsAddUser } from '@/components/OrgActions/OrgActionsAddUser';
import { addUserToOrg } from '@/app/orgs/[orgId]/users/add/actions';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('../../../app/orgs/[orgId]/users/add/actions');
/* eslint no-undef: "error" */

describe('<OrgActionsAddUser />', () => {
  describe('when form submission fails', () => {
    // TODO: cannot get forms to submit
    xit('shows an error message', async () => {
      // setup
      const user = userEvent.setup();
      const controllerErrorResponse = {
        meta: {
          status: 'error',
          errors: ['foo example error'],
        },
      };
      addUserToOrg.mockImplementation(() => controllerErrorResponse);
      // render
      render(
        <OrgActionsAddUser orgId="fooOrgId" onCancelPath="/fooCancelPath" />
      );
      // act
      const input = screen.getByRole('textbox');
      await user.type(input, 'foo@example.com');
      expect(screen.getByDisplayValue('foo@example.com')).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { text: 'Add' });
      await user.click(submitBtn);
      // expect
      await waitFor(() =>
        expect(screen.getByText(/foo example error/)).toBeInTheDocument()
      );
    });
  });
});
