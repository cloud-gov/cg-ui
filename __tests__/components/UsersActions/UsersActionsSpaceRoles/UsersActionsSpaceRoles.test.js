/**
 * @jest-environment jsdom
 */
import { describe, expect, it, xit } from '@jest/globals';
import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersActionsSpaceRoles } from '@/components/UsersActions/UsersActionsSpaceRoles/UsersActionsSpaceRoles';
import { getOrgUserSpacesPage } from '@/controllers/controllers';
import { updateSpaceRolesForUser } from '@/app/orgs/[orgId]/users/[userId]/actions';

/* global jest */
/* eslint no-undef: "off" */
jest.mock('@/controllers/controllers');
jest.mock('@/app/orgs/[orgId]/users/[userId]/actions');
/* eslint no-undef: "error" */

const orgGuid = 'orgGuid1';
const userGuid = 'userGuid1';

const controllerSuccessResponse = {
  meta: { status: 'success' },
  payload: {
    spaces: [{ guid: 'spaceGuid1', name: 'Foo Space' }],
    roles: {
      spaceGuid1: {
        space_supporter: {
          name: 'Supporter',
          type: 'space_supporter',
          description: 'TODO',
          selected: false,
        },
        space_auditor: {
          name: 'Auditor',
          type: 'space_auditor',
          description:
            'Space auditors can view logs, reports, and settings for a space',
          selected: false,
        },
        space_developer: {
          name: 'Developer',
          type: 'space_developer',
          description:
            'Space developers can do everything space auditors can do, and can create and manage apps and services',
          selected: false,
        },
        space_manager: {
          name: 'Manager',
          type: 'space_manager',
          description:
            'Space managers can manage users and enable features but do not create and manage apps and services',
          guid: 'roleGuid1',
          selected: true,
        },
      },
    },
  },
};

describe('UserActionsSpaceRoles', () => {
  describe('checkboxes in form', () => {
    it('can be checked/unchecked', async () => {
      // setup
      const user = userEvent.setup();
      getOrgUserSpacesPage.mockImplementation(() => controllerSuccessResponse);
      // render
      render(<UsersActionsSpaceRoles orgGuid={orgGuid} userGuid={userGuid} />);
      // more setup - wait for data to load
      await waitFor(() =>
        expect(screen.getByText(/Auditor/)).toBeInTheDocument()
      );
      // expect manager to be checked
      const managerCheckbox = screen.getByRole('checkbox', {
        name: /Manager/,
      });
      expect(managerCheckbox.checked).toBe(true);
      // expect developer not to be checked
      const devCheckbox = screen.getByRole('checkbox', {
        name: /Developer/,
      });
      expect(devCheckbox.checked).toBe(false);
      // act - uncheck manager checkbox
      await user.click(managerCheckbox);
      expect(managerCheckbox.checked).toBe(false);
      // act check dev checkbox
      await user.click(devCheckbox);
      expect(devCheckbox.checked).toBe(true);
    });
  });

  describe('when data fetch fails', () => {
    it('shows error message', async () => {
      // setup
      getOrgUserSpacesPage.mockImplementation(() => {
        throw new Error('failed to fetch');
      });
      // render
      render(<UsersActionsSpaceRoles orgGuid={orgGuid} userGuid={userGuid} />);
      // more setup - wait for data to load
      await waitFor(() =>
        expect(screen.getByText(/failed to fetch/)).toBeInTheDocument()
      );
    });
  });
  describe('when form submission succeeds', () => {
    // TODO: cannot get submit function to fire for some reason
    xit('shows success message', async () => {
      // setup
      const user = userEvent.setup();
      getOrgUserSpacesPage.mockImplementation(() => controllerSuccessResponse);
      updateSpaceRolesForUser.mockImplementation(() => true);
      // render
      render(<UsersActionsSpaceRoles orgGuid={orgGuid} userGuid={userGuid} />);
      // more setup - wait for data to load
      await waitFor(() =>
        expect(screen.getByText(/Auditor/)).toBeInTheDocument()
      );
      // query
      const submitBtn = screen.getByText(/Save changes/);
      // act
      user.click(submitBtn);
      // expect a success message
      await waitFor(() =>
        expect(screen.getByText(/Changes saved!/)).toBeInTheDocument()
      );
    });
  });
});
